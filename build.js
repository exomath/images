import {
  readdirSync,
  readFileSync,
  writeFileSync
} from 'fs';

import {
  basename,
  dirname,
  extname,
  resolve
} from 'path';

import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const ROOT_DIR = 'icons/app';
const GENERATED_FILE_HEADER = '/* THIS IS A GENERATED FILE; DO NOT MODIFY MANUALLY */\n';

let contents = GENERATED_FILE_HEADER;

const icons = {};

readdirSync(resolve(__dirname, ROOT_DIR), { withFileTypes: true })
  .filter(item => item.isDirectory())

  .forEach(directory => {
    const style = directory.name;
    const names = {};

    readdirSync(resolve(__dirname, ROOT_DIR, style), { withFileTypes: true })
      .filter(item => item.isFile() && extname(item.name) === '.svg')

      .forEach(file => {
        const name = basename(file.name, '.svg');
        const svg = readFileSync(resolve(__dirname, ROOT_DIR, style, file.name), 'utf8')
          .trim()
          .replace(/(?:\r?\n|\r)\s*/gm, '');
        
        names[name] = svg;
      });

    icons[style] = names;
  });

contents += 'export const icons = ' + JSON.stringify(icons, null, 2) + ';';

writeFileSync(resolve(__dirname, ROOT_DIR, 'index.js'), contents, 'utf8');
