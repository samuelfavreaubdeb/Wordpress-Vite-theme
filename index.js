#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templateDir = path.join(__dirname, 'template');

const { projectName } = await prompts({
  type: 'text',
  name: 'projectName',
  message: 'Theme name:',
  initial: 'my-wp-theme',
});

const { author } = await prompts({
  type: 'text',
  name: 'author',
  message: 'Author name:',
  initial: 'Your Name',
});

const { templates } = await prompts({
  type: 'multiselect',
  name: 'templates',
  message: 'Select php pages to generate:',
  hint: 'Space to select, Enter to confirm',
  instructions: false,
  choices: [
    { title: 'front-page', value: 'front-page', selected: true },
    { title: 'single', value: 'single', selected: true },
    { title: 'page', value: 'page', selected: true },
    { title: '404', value: '404' },
  ],
});

// Guard: user hit Ctrl+C
if (!projectName || !templates) {
  console.log('\n❌ Cancelled.');
  process.exit(1);
}

if (fs.existsSync(projectName)) {
  console.error(`\n❌ Directory "${projectName}" already exists.`);
  process.exit(1);
}

console.log(`\n🚀 Creating "${projectName}"...\n`);

// Copy template files to the target directory
fs.cpSync(path.join(templateDir, 'base'), projectName, { recursive: true });

// Copy each selected template file
for (const t of templates) {
  const src = path.join(templateDir, 'pages', `${t}.php`);
  const dest = path.join(projectName, `${t}.php`);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`  ✔ ${t}.php`);
  }
}

// Optionally rename _gitignore → .gitignore (npm strips .gitignore on publish)
const gitignoreSrc = path.join(projectName, '_gitignore');
if (fs.existsSync(gitignoreSrc)) {
  fs.renameSync(gitignoreSrc, path.join(projectName, '.gitignore'));
}

// Create style.css with theme header
const themeHeader = `/**
 * Theme Name:        ##-DEV-## ${projectName}
 * Author:            ${author}
 * Description:       A custom WordPress theme built with Vite.
 * Version:           1.0.0
 */`;

fs.writeFileSync(path.join(projectName, 'style.css'), themeHeader);

console.log(`✅ Done! Now run:\n`);
console.log(`  cd ${projectName}`);
console.log(`  npm install`);
console.log(`  npm run dev\n`);
