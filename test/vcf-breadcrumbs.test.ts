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
import { expect, fixture, html, nextFrame } from '@open-wc/testing';
import '../src/vcf-breadcrumbs.js';
import type { VcfBreadcrumbs } from '../src/component/vcf-breadcrumbs.js';

/** Both the MutationObserver and ResizeObserver deliveries are async. */
async function settle() {
  await nextFrame();
  await nextFrame();
  await nextFrame();
}

function addItem(
  list: VcfBreadcrumbs,
  label: string,
  options: { collapse?: boolean; href?: string } = {}
) {
  const item = document.createElement('vcf-breadcrumb');
  if (options.href !== undefined) {
    item.setAttribute('href', options.href);
  }
  if (options.collapse) {
    item.setAttribute('collapse', '');
  }
  item.textContent = label;
  list.appendChild(item);
  return item;
}

const items = (list: VcfBreadcrumbs) =>
  Array.from(list.querySelectorAll('vcf-breadcrumb'));
const visible = (list: VcfBreadcrumbs) =>
  items(list).filter(item => item.style.display !== 'none');
const ellipses = (list: VcfBreadcrumbs) =>
  list.querySelectorAll('[part="ellipsis"]');

/**
 * The generated ellipsis carries its popover, and therefore the hidden items'
 * labels, inside itself - so read it as "…" rather than by text content.
 */
const labelOf = (item: Element) =>
  item.getAttribute('part') === 'ellipsis' ? '…' : item.textContent!.trim();

describe('vcf-breadcrumbs', () => {
  let list: VcfBreadcrumbs;

  beforeEach(async () => {
    list = await fixture<VcfBreadcrumbs>(html`
      <vcf-breadcrumbs style="width: 240px">
        <vcf-breadcrumb href="/">Home</vcf-breadcrumb>
        <vcf-breadcrumb>Current</vcf-breadcrumb>
      </vcf-breadcrumbs>
    `);
    await settle();
  });

  it('is registered and labelled as navigation', () => {
    expect(customElements.get('vcf-breadcrumbs')).to.exist;
    expect(list.getAttribute('role')).to.equal('navigation');
    expect(list.getAttribute('aria-label')).to.equal('breadcrumb');
  });

  describe('collapsing', () => {
    it('collapses when items are added, without waiting for a resize', async () => {
      const current = list.lastElementChild!;
      ['Directory', 'Flow', 'Vaadin Latest', 'Components'].forEach(label => {
        const item = addItem(list, label, { collapse: true, href: '/x' });
        list.insertBefore(item, current);
      });
      await settle();

      expect(ellipses(list)).to.have.lengthOf(1);
      expect(visible(list).map(labelOf)).to.eql(['Home', '…', 'Current']);
    });

    it('attaches a popover listing the hidden items to the ellipsis', async () => {
      const current = list.lastElementChild!;
      ['Directory', 'Flow', 'Vaadin Latest', 'Components'].forEach(label => {
        const item = addItem(list, label, { collapse: true, href: '/x' });
        list.insertBefore(item, current);
      });
      await settle();

      const popover = list.querySelector('vaadin-popover');
      expect(popover).to.exist;
      expect(popover!.querySelectorAll('a[role="menuitem"]')).to.have.lengthOf(
        4
      );
    });

    it('removes the ellipsis and restores every item when the trail shrinks again', async () => {
      const current = list.lastElementChild!;
      ['Directory', 'Flow', 'Vaadin Latest', 'Components'].forEach(label => {
        const item = addItem(list, label, { collapse: true, href: '/x' });
        list.insertBefore(item, current);
      });
      await settle();
      expect(ellipses(list)).to.have.lengthOf(1);

      items(list)
        .filter(item => item.hasAttribute('collapse'))
        .forEach(item => item.remove());
      await settle();

      expect(ellipses(list)).to.have.lengthOf(0);
      expect(visible(list)).to.have.lengthOf(2);
    });

    it('restores visibility when an item loses its collapse attribute', async () => {
      const current = list.lastElementChild!;
      ['Directory', 'Flow', 'Vaadin Latest', 'Components'].forEach(label => {
        const item = addItem(list, label, { collapse: true, href: '/x' });
        list.insertBefore(item, current);
      });
      await settle();
      expect(visible(list)).to.have.lengthOf(3);

      items(list).forEach(item => item.removeAttribute('collapse'));
      await settle();

      // Every item is visible again: none may be left behind with display: none.
      expect(ellipses(list)).to.have.lengthOf(0);
      expect(items(list).every(item => item.style.display !== 'none')).to.be
        .true;
    });

    it('keeps the first breadcrumb visible when only later items collapse', async () => {
      const current = list.lastElementChild!;
      ['Directory', 'Flow', 'Vaadin Latest', 'Components'].forEach(label => {
        const item = addItem(list, label, { collapse: true, href: '/x' });
        list.insertBefore(item, current);
      });
      await settle();

      expect(list.firstElementChild!.textContent!.trim()).to.equal('Home');
      expect(
        (list.firstElementChild as HTMLElement).style.display
      ).to.not.equal('none');
    });
  });

  describe('trail observation', () => {
    it('recalculates once per batch of mutations', async () => {
      let calls = 0;
      const original = list._updateBreadcrumbs.bind(list);
      list._updateBreadcrumbs = () => {
        calls += 1;
        original();
      };

      const current = list.lastElementChild!;
      for (let i = 0; i < 10; i += 1) {
        list.insertBefore(
          addItem(list, `S${i}`, { collapse: true, href: `/s${i}` }),
          current
        );
      }
      await settle();

      expect(calls).to.equal(1);
    });

    it('survives the trail being emptied', async () => {
      list.innerHTML = '';
      await settle();

      expect(items(list)).to.have.lengthOf(0);
      expect(ellipses(list)).to.have.lengthOf(0);
    });

    it('survives the trail changing while the component is hidden', async () => {
      list.style.display = 'none';
      addItem(list, 'Hidden', { collapse: true, href: '/hidden' });
      await settle();

      list.style.display = '';
      await settle();

      expect(items(list)).to.have.lengthOf(3);
    });

    it('recalculates when a full trail replacement happens', async () => {
      list.innerHTML = '';
      await settle();
      ['Home', 'A', 'B', 'C', 'D', 'Leaf'].forEach((label, index, all) => {
        const middle = index > 0 && index < all.length - 1;
        addItem(list, label, {
          collapse: middle,
          href: middle || index === 0 ? `/${index}` : undefined,
        });
      });
      await settle();

      expect(items(list)).to.have.lengthOf(7);
      expect(ellipses(list)).to.have.lengthOf(1);
    });
  });

  describe('responsive breakpoint', () => {
    let matchMedia: typeof window.matchMedia;

    beforeEach(() => {
      matchMedia = window.matchMedia;
    });

    afterEach(() => {
      window.matchMedia = matchMedia;
    });

    it('applies the mobile layout when the breakpoint matches on connect', async () => {
      // `MediaQueryController.hostConnected()` calls `window.matchMedia(query)` and
      // invokes the callback immediately, so stubbing it covers the responsive path
      // without needing a real viewport resize.
      const listeners: ((event: { matches: boolean }) => void)[] = [];
      window.matchMedia = ((query: string) => ({
        media: query,
        matches: true,
        addListener: (listener: (event: { matches: boolean }) => void) =>
          listeners.push(listener),
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        onchange: null,
        dispatchEvent: () => false,
      })) as unknown as typeof window.matchMedia;

      const responsive = await fixture<VcfBreadcrumbs>(html`
        <vcf-breadcrumbs>
          <vcf-breadcrumb href="/">Home</vcf-breadcrumb>
          <vcf-breadcrumb>Current</vcf-breadcrumb>
        </vcf-breadcrumbs>
      `);
      await settle();

      expect(
        items(responsive).every(item => item.classList.contains('mobile-back'))
      ).to.be.true;
      expect(listeners).to.have.lengthOf.at.least(1);

      // A later breakpoint change must recalculate too, even though `_mobile` is
      // no longer a reactive property.
      listeners.forEach(listener => listener({ matches: false }));
      await settle();

      expect(
        items(responsive).some(item => item.classList.contains('mobile-back'))
      ).to.be.false;
    });
  });

  describe('mobile mode', () => {
    it('applies forceMobileMode immediately', async () => {
      expect(items(list).some(item => item.classList.contains('mobile-back')))
        .to.be.false;

      list.forceMobileMode = true;
      await settle();

      expect(items(list).every(item => item.classList.contains('mobile-back')))
        .to.be.true;
    });

    it('clears the mobile classes when forceMobileMode is turned off', async () => {
      list.forceMobileMode = true;
      await settle();

      list.forceMobileMode = false;
      await settle();

      expect(items(list).some(item => item.classList.contains('mobile-back')))
        .to.be.false;
    });

    it('shows the item before the current one as the back path', async () => {
      list.forceMobileMode = true;
      await settle();

      const [home] = items(list);
      expect(home.classList.contains('is-before-current')).to.be.true;
    });
  });
});
