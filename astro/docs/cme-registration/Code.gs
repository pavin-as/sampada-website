/**
 * Samanvayam 2026 (Sampada CME): registration collector.
 * Receives the form posted by https://sampadavr.com/cme/ and appends one row per doctor to a Google Sheet.
 *
 * SETUP (about 3 minutes)
 * 1. Create a Google Sheet (e.g. "Samanvayam 2026 Registrations"). Open Extensions > Apps Script.
 * 2. Paste this file in as Code.gs and save. (Optional: set NOTIFY_EMAIL below.)
 * 3. Deploy > New deployment > type "Web app".
 *      Execute as: Me
 *      Who has access: Anyone
 *    Authorise when prompted, then copy the Web app URL (ends in /exec).
 * 4. Paste that URL into REGISTRATION_ENDPOINT in src/data/cme.ts, commit and deploy the site.
 * 5. Test: open the /cme/ page, submit a dummy registration, check the sheet, then delete the test row.
 *
 * After editing this script later, use Deploy > Manage deployments > Edit > New version
 * (the /exec URL stays the same).
 */

const SHEET_NAME = 'Registrations';
const NOTIFY_EMAIL = ''; // e.g. 'admin@gs.sampadavr.com' to get an email per registration; leave '' to skip
const HEADERS = ['Timestamp', 'Name', 'Speciality', 'Hospital / Clinic', 'Mobile', 'Email', 'Source page'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const d = JSON.parse((e.postData && e.postData.contents) || '{}');

    const mobile = String(d.mobile || '').replace(/\D/g, '');
    const name = clean_(d.name), speciality = clean_(d.speciality), hospital = clean_(d.hospital);
    if (!name || !speciality || !hospital || !/^\d{10}$/.test(mobile)) {
      return json_({ ok: false, error: 'Missing or invalid fields' });
    }

    const sheet = getSheet_();
    // Duplicate check on mobile number (column E). Phone is stored as text so leading digits are kept.
    const last = sheet.getLastRow();
    if (last > 1) {
      const phones = sheet.getRange(2, 5, last - 1, 1).getDisplayValues().flat();
      if (phones.indexOf(mobile) !== -1) return json_({ ok: true, duplicate: true });
    }

    sheet.appendRow([new Date(), name, speciality, hospital, '', clean_(d.email), clean_(d.page)]);
    const row = sheet.getLastRow();
    sheet.getRange(row, 5).setNumberFormat('@').setValue(mobile);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL, 'Samanvayam 2026: new registration (' + (row - 1) + ')',
        [name, speciality, hospital, mobile, clean_(d.email)].join('\n'));
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

/** Health check / running total: open the /exec URL in a browser. */
function doGet() {
  const sheet = getSheet_();
  return json_({ ok: true, registrations: Math.max(0, sheet.getLastRow() - 1) });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function clean_(v) {
  // Trim, collapse whitespace, and neutralise spreadsheet formula injection.
  let s = String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, 300);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
