#!/usr/bin/env node
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const TYPES = ['film', 'serie', 'boek', 'album', 'game', 'anders'];

const [type, title] = process.argv.slice(2);

if (!type || !title) {
  console.error('Gebruik: npm run new <type> "<titel>"');
  console.error(`Types:   ${TYPES.join(', ')}`);
  process.exit(1);
}

if (!TYPES.includes(type)) {
  console.error(`Ongeldig type "${type}". Kies uit: ${TYPES.join(', ')}`);
  process.exit(1);
}

function toSlug(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const date = new Date().toISOString().split('T')[0];
const slug = toSlug(title);
const filename = `${slug}.md`;
const filepath = join(process.cwd(), 'src/content/log', filename);

if (existsSync(filepath)) {
  console.error(`Bestaat al: src/content/log/${filename}`);
  process.exit(1);
}

const content = `---
type: ${type}
title: ${title}
creator:
year: ${new Date().getFullYear()}
date: ${date}
rating:
cover:
tags: []
link:
draft: true
---

`;

writeFileSync(filepath, content, 'utf8');
console.log(`Aangemaakt: src/content/log/${filename}`);
console.log('Vergeet draft: true te verwijderen als je klaar bent.');
