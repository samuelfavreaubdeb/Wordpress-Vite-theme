#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const targetDir = process.argv[2] || "my-wp-theme";
const templateDir = path.join(__dirname, "template");

if (fs.existsSync(targetDir)) {
  console.error(`❌ Directory "${targetDir}" already exists.`);
  process.exit(1);
}

console.log(`\n🚀 Creating WordPress/Vite theme in ./${targetDir}...\n`);

// Copy template files to the target directory
fs.cpSync(templateDir, targetDir, { recursive: true });

// Optionally rename _gitignore → .gitignore (npm strips .gitignore on publish)
const gitignoreSrc = path.join(targetDir, "_gitignore");
if (fs.existsSync(gitignoreSrc)) {
  fs.renameSync(gitignoreSrc, path.join(targetDir, ".gitignore"));
}

console.log(`✅ Done! Now run:\n`);
console.log(`  cd ${targetDir}`);
console.log(`  npm install`);
console.log(`  npm run dev\n`);