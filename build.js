import {mkdirSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {basename, dirname, extname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const TARGET_DIR = resolve(__dirname, 'lib');
const GENERATED_FILE_HEADER = '/* THIS IS A GENERATED FILE; DO NOT MODIFY MANUALLY */\n\n';
const NEWLINE_PATTERN = /(?:\r?\n|\r)\s*/gm;

const sourcePath = resolve(__dirname, 'logos');
const logos = {};
let contents = GENERATED_FILE_HEADER;

readdirSync(sourcePath, { withFileTypes: true })
  .filter(item => item.isFile() && extname(item.name) === '.svg')

  .forEach(file => {
    const name = basename(file.name, '.svg');
    const filePath = resolve(sourcePath, file.name);

    const svg = readFileSync(filePath, 'utf8')
      .trim()
      .replace(NEWLINE_PATTERN, '');
    
    logos[name] = svg;
  });

contents += 'export const logos: Record<string, string> = '
  + JSON.stringify(logos, null, 2) + ';\n';

mkdirSync(TARGET_DIR);
writeFileSync(resolve(TARGET_DIR, 'index.ts'), contents, 'utf8');
