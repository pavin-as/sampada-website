export const tools = [
  { id: 'amsler-grid', title: 'Do straight lines look wavy?', category: 'Central vision', time: '3–5 minutes', description: 'A guided Amsler grid check for each eye. Notice distortion, blurred lines or missing areas.' },
  { id: 'flashes-and-floaters', title: 'New flashes, floaters or a shadow?', category: 'Symptoms & next steps', time: '1 minute', description: 'Understand when a sudden vision change needs immediate attention.' },
  { id: 'diabetes-retina-check', title: 'Is your diabetes eye check due?', category: 'Diabetes & your retina', time: '2 minutes', description: 'Review your examination history and prepare for your next eye appointment.' },
  { id: 'retina-quiz', title: 'How well do you know your retina?', category: 'Learn about your eyes', time: '2 minutes', description: 'Five questions about retinal health, with an explanation after each answer.' },
];
export const sources = [
  ['American Academy of Ophthalmology: Amsler grid', 'https://www.aao.org/eye-health/tips-prevention/facts-about-amsler-grid-daily-vision-test'],
  ['National Eye Institute: retinal detachment', 'https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/retinal-detachment'],
  ['CDC: diabetes and vision loss', 'https://www.cdc.gov/diabetes/diabetes-complications/diabetes-and-vision-loss.html'],
];
export const urgentText = 'Seek an eye doctor or emergency department immediately for sudden vision loss, a curtain or shadow, new flashes, or a sudden increase in floaters. Do not wait to finish a check or for a routine appointment. If the clinic is closed or cannot respond promptly, go to an emergency service.';
export const quiz = [
  { question: 'Can diabetes damage the retina before vision changes are noticeable?', options: ['Yes', 'No'], correct: 0, explanation: 'Early diabetic retinopathy may have no symptoms. Retinal examinations remain important even when vision feels normal.' },
  { question: 'What should you do about a new curtain-like shadow in your vision?', options: ['Wait for the next routine visit', 'Seek immediate eye care'], correct: 1, explanation: 'A new curtain or shadow can be a warning sign of retinal detachment. Seek immediate assessment.' },
  { question: 'How should you use an Amsler grid?', options: ['With both eyes together', 'One eye at a time, looking at the centre dot'], correct: 1, explanation: 'Check each eye separately with your usual reading glasses, keeping your gaze on the centre dot.' },
  { question: 'Can high myopia increase the risk of retinal detachment?', options: ['Yes', 'No'], correct: 0, explanation: 'High myopia is a risk factor. Discuss retinal examinations with your eye doctor and know the warning symptoms.' },
  { question: 'Does an unchanged Amsler grid prove your retina is healthy?', options: ['Yes', 'No'], correct: 1, explanation: 'The grid checks only part of your vision and cannot rule out retinal disease or replace an eye examination.' },
];
