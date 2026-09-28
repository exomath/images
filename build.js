import {mkdirSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {basename, dirname, extname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const GENERATED_FILE_HEADER = '/* THIS IS A GENERATED FILE; DO NOT MODIFY MANUALLY */\n\n';
const NEWLINE_PATTERN = /(?:\r?\n|\r)\s*/gmu;

const thisDirectory = dirname(fileURLToPath(import.meta.url));
const inputDirectory = resolve(thisDirectory, 'logos');
const outputDirectory = resolve(thisDirectory, 'lib');
const logos = {};

let contents = GENERATED_FILE_HEADER;

readdirSync(inputDirectory, {withFileTypes: true})
  .filter(item => item.isFile() && extname(item.name) === '.svg')

  .forEach(file => {
    const name = basename(file.name, '.svg');
    const filePath = resolve(inputDirectory, file.name);

    const svg = readFileSync(filePath, 'utf8')
      .trim()
      .replace(NEWLINE_PATTERN, '');
    
    logos[name] = svg;
  });

contents += `export const logos: Record<string, string> = ${JSON.stringify(logos, null, 2)};\n`;

mkdirSync(outputDirectory);
writeFileSync(resolve(outputDirectory, 'index.ts'), contents, 'utf8');
