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

const projectNameDev = 'DEV_' + projectName;

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
    { title: '404', value: '404', selected: true },
  ],
});

// Guard: user hit Ctrl+C
if (!projectName || !templates) {
  console.log('\n❌ Cancelled.');
  process.exit(1);
}

if (fs.existsSync(projectNameDev)) {
  console.error(`\n❌ Directory "${projectNameDev}" already exists.`);
  process.exit(1);
}

console.log(`\n🚀 Creating new dev directory for "${projectName}"...\n`);

// Copy template files to the target directory
fs.cpSync(path.join(templateDir, 'base'), projectNameDev, { recursive: true });

// Copy each selected template file
for (const t of templates) {
  const src = path.join(templateDir, 'pages', `${t}.php`);
  const dest = path.join(projectNameDev, `${t}.php`);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`  ✔ ${t}.php`);
  }
}

// Optionally rename _gitignore → .gitignore (npm strips .gitignore on publish)
const gitignoreSrc = path.join(projectNameDev, '_gitignore');
if (fs.existsSync(gitignoreSrc)) {
  fs.renameSync(gitignoreSrc, path.join(projectNameDev, '.gitignore'));
}

// Create style.css with theme header
const themeHeader = `/**
 * Theme Name:        ##-DEV-## ${projectName}
 * Author:            ${author}
 * Description:       A custom WordPress theme built with Vite.
 * Version:           1.0.0
 */`;

fs.writeFileSync(path.join(projectNameDev, 'style.css'), themeHeader);

// Setting the name of the dist folder in vite.config.js
const viteConfigPath = path.join(projectNameDev, 'vite.config.js');
let viteConfigSrc = fs.readFileSync(viteConfigPath, 'utf-8');
viteConfigSrc = viteConfigSrc.replace('Dist Vite Theme', projectName);
fs.writeFileSync(viteConfigPath, viteConfigSrc);

console.log(`✅ Done! Now run:\n`);
console.log(`  cd "${projectNameDev}"`);
console.log(`  npm install`);
console.log(`  npm run dev\n`);
