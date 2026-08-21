/*-
 * #%L
 *
 * Copyright (C) 2018 - 2026 Vaadin Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */

/**
 * Releases a new version: rewrites the version baked into each component,
 * commits, tags via `npm version`, pushes and publishes.
 *
 *   node util/publish.js 3.1.0
 *
 * This package is `"type": "module"`, so the script is ESM. It also refuses to
 * run from a dirty tree or a non-default branch, and every source rewrite is
 * verified before anything is committed - a release must not be able to reach
 * `git push` or `npm publish` from a half-applied state.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readDeclaredVersions } from './versions.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RELEASE_BRANCH = 'master';

const fail = (message) => {
  console.error(`publish: ${message}`);
  process.exit(1);
};

const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const run = (command, ...args) => {
  execFileSync(command, args, { cwd: root, stdio: 'inherit' });
};

const version = process.argv[2];

if (!version) {
  fail('missing version. Usage: node util/publish.js <version>');
}

// Deliberately strict: release versions for this package are plain `x.y.z`.
if (!/^\d+\.\d+\.\d+$/u.test(version)) {
  fail(`"${version}" is not a semantic version such as 3.1.0.`);
}

if (git('status', '--porcelain') !== '') {
  fail('the working tree has uncommitted changes. Commit or stash them first.');
}

const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
if (branch !== RELEASE_BRANCH) {
  fail(`on branch "${branch}", expected "${RELEASE_BRANCH}".`);
}

const declared = readDeclaredVersions(root);
if (declared.some(({ version: current }) => current === version)) {
  fail(`version ${version} is already the declared version.`);
}

// Rewrite `static get version()` in every component, verifying each one.
for (const { file, version: current } of declared) {
  const path = resolve(root, file);
  const source = readFileSync(path, 'utf8');
  const updated = source.replace(
    /(get version\(\)\s*\{\s*return\s*')(\d+\.\d+\.\d+)(';)/u,
    `$1${version}$3`,
  );

  if (updated === source) {
    fail(`could not rewrite the version in ${file} (found "${current}").`);
  }

  writeFileSync(path, updated);
  console.log(`publish: ${file}: ${current} -> ${version}`);
}

const rewritten = readDeclaredVersions(root);
const stale = rewritten.filter(({ version: current }) => current !== version);
if (stale.length > 0) {
  fail(`these files still declare the old version: ${stale.map(({ file }) => file).join(', ')}`);
}

run('git', 'commit', '-a', '-m', `chore: update declared version to ${version}`);
// `npm version` bumps package.json, commits and tags.
run('npm', 'version', version);
run('git', 'push', '--follow-tags');
run('npm', 'publish', '--access', 'public');

console.log(`publish: released ${version}.`);
