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
 * Every source file that hardcodes the package version in `static get version()`.
 * Shared by `publish.js`, which rewrites them, and `check-versions.js`, which
 * asserts they still match package.json.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const VERSION_SOURCES = [
  'src/component/vcf-breadcrumb.ts',
  'src/component/vcf-breadcrumbs.ts',
];

/**
 * Reads the version each component declares.
 *
 * @param {string} root repository root
 * @returns {{ file: string, version: string | null }[]}
 */
export function readDeclaredVersions(root) {
  return VERSION_SOURCES.map((file) => {
    const source = readFileSync(resolve(root, file), 'utf8');
    const match = /get version\(\)\s*\{\s*return\s*'(\d+\.\d+\.\d+)';/u.exec(source);
    return { file, version: match ? match[1] : null };
  });
}

/**
 * @param {string} root repository root
 * @returns {string} the version in package.json
 */
export function readPackageVersion(root) {
  return JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')).version;
}
