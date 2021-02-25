import fs from 'fs';
import { join } from 'path';

import pack from '../package.json';
const pkg: any = pack;

const repo = process.argv[2];
const user = process.argv[3] || 'Snazzah';
if (!repo) {
  console.error('No repo name was given!');
  process.exit(1);
} else {
  console.log('Writing package.json...');
  delete pkg.scripts.setup;
  pkg.repository = `https://github.com/${repo}`;
  pkg.bugs.url = `https://github.com/${repo}/issues`;

  pkg.author = user;
  pkg.funding.url = `https://github.com/sponsors/${user}`;

  fs.writeFileSync(join(__dirname, '../package.json'), JSON.stringify(pkg, null, '  ') + '\n');

  console.log('Writing scripts/gpr.ts...');
  const gpr = fs.readFileSync(join(__dirname, '../scripts/gpr.ts'), { encoding: 'utf-8' });
  fs.writeFileSync(join(__dirname, '../scripts/gpr.ts'), gpr.replace('@snazzah', `@${user.toLowerCase()}`));

  console.log('Writing scripts/changelog.ts...');
  const changelogTS = fs.readFileSync(join(__dirname, '../scripts/changelog.ts'), { encoding: 'utf-8' });
  fs.writeFileSync(
    join(__dirname, '../scripts/changelog.ts'),
    changelogTS.replace(/Snazzah\/typescript-env/g, repo)
  );

  console.log('Writing CHANGELOG.md...');
  const changelog = fs.readFileSync(join(__dirname, '../CHANGELOG.md'), { encoding: 'utf-8' });
  fs.writeFileSync(
    join(__dirname, '../CHANGELOG.md'),
    changelog
      .replace(/Snazzah\/typescript-env/g, repo)
      .replace('XXXX-XX-XX', new Date().toISOString().slice(0, 10))
  );

  console.log('Writing .gitignore...');
  const gitignore = fs.readFileSync(join(__dirname, '../.gitignore'), { encoding: 'utf-8' });
  fs.writeFileSync(join(__dirname, '../.gitignore'), gitignore.replace('.vscode/settings.json', '.vscode/'));

  console.log('Removing .keep files...');
  fs.unlinkSync(join(__dirname, '../src/.keep'));
  fs.unlinkSync(join(__dirname, '../test/.keep'));

  console.log('Removing this setup file...');
  fs.unlinkSync(join(__dirname, '../scripts/setup.ts'));

  console.log(
    '\n\nDone! Now what?\n - `git init`\n- Make sure to update the README and add deps\n- Set the `NPM_TOKEN` of the repository\n- Make code/tests\n'
  );
}
