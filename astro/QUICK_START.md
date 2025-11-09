# Quick Start Guide

## Adding a New Blog Post (5 Steps)

### 1. Copy the Template
```bash
cd astro/src/content/blog
cp _template.md my-new-post.md
```

### 2. Edit the Frontmatter
```yaml
---
title: "Your Post Title"
description: "Brief description"
publishDate: "2025-11-08"
heroImage: "/wp-content/uploads/2024/02/image.webp"
category: "diagnostic"
---
```

### 3. Write Your Content
Use Markdown syntax below the frontmatter.

### 4. Test Locally (Optional)
```bash
cd astro
npm run dev
# Visit http://localhost:4321/blog/
```

### 5. Deploy
```bash
git add .
git commit -m "Add new blog post: Your Title"
git push origin main
```

Done! Your post will be live in ~2 minutes.

---

## Common Tasks

### Preview Changes Locally
```bash
cd astro
npm run dev
```

### Build for Production
```bash
cd astro
npm run build
```

### Add a New Image
1. Place image in `astro/public/wp-content/uploads/2024/02/`
2. Reference as: `/wp-content/uploads/2024/02/filename.webp`

### Categories
- `diagnostic` - Diagnostic tools/procedures
- `treatment` - Treatment options
- `education` - Patient education
- `news` - Clinic updates

---

## Markdown Cheat Sheet

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- Bullet point
- Another point

1. Numbered item
2. Another item

[Link text](https://example.com)

![Image alt text](/path/to/image.jpg)
```

---

## Troubleshooting

**Build fails?**
- Check frontmatter syntax (proper YAML format)
- Ensure publishDate is in quotes: "2025-11-08"
- Verify image paths start with `/`

**Post not showing?**
- Confirm file is in `astro/src/content/blog/`
- Check file extension is `.md`
- Verify frontmatter has all required fields

**Need help?**
- See `BLOG_GUIDE.md` for detailed instructions
- Check `MIGRATION_SUMMARY.md` for technical details

