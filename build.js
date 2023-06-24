import {mkdirSync, readdirSync, readFileSync, writeFileSync} from 'fs';
import {basename, dirname, extname, resolve} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const TARGET_DIR = resolve(__dirname, 'lib');
const GENERATED_FILE_HEADER = '/* THIS IS A GENERATED FILE; DO NOT MODIFY MANUALLY */\n\n';
const NEWLINE_PATTERN = /(?:\r?\n|\r)\s*/gm;

/* Static icons */

let sourcePath = resolve(__dirname, 'icons', 'app', 'static');
let contents = GENERATED_FILE_HEADER;

const staticIcons = {};

readdirSync(sourcePath, {withFileTypes: true})
  .filter(item => item.isDirectory())

  .forEach(directory => {
    const style = directory.name;
    const directoryPath = resolve(sourcePath, style);
    const names = {};

    readdirSync(directoryPath, {withFileTypes: true})
      .filter(item => item.isFile() && extname(item.name) === '.svg')

      .forEach(file => {
        const name = basename(file.name, '.svg');
        const filePath = resolve(directoryPath, file.name);

        const svg = readFileSync(filePath, 'utf8')
          .trim()
          .replace(NEWLINE_PATTERN, '');
        
        names[name] = svg;
      });

    staticIcons[style] = names;
  });

contents += 'export const staticIcons = ' + JSON.stringify(staticIcons, null, 2) + ';\n\n';

/* Animated icons */

sourcePath = resolve(__dirname, 'icons', 'app', 'animated');

const animatedIcons = {};

readdirSync(sourcePath, {withFileTypes: true})
  .filter(item => item.isDirectory())

  .forEach(directory => {
    const style = directory.name;
    const directoryPath = resolve(sourcePath, style);
    const names = {};

    readdirSync(directoryPath, {withFileTypes: true})
      .filter(item => item.isFile() && extname(item.name) === '.json')

      .forEach(file => {
        const name = basename(file.name, '.json');
        const filePath = resolve(directoryPath, file.name);

        const json = readFileSync(filePath, 'utf8')
          .trim()
          .replace(NEWLINE_PATTERN, '');
        
        names[name] = json;
      });

    animatedIcons[style] = names;
  });

contents += 'export const animatedIcons = ' + JSON.stringify(animatedIcons, null, 2) + ';\n\n';

/* Logos */

sourcePath = resolve(__dirname, 'logos');

const logos = {};

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

contents += 'export const logos = ' + JSON.stringify(logos, null, 2) + ';\n';

mkdirSync(TARGET_DIR);
writeFileSync(resolve(TARGET_DIR, 'index.ts'), contents, 'utf8');
