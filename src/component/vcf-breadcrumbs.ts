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
import { LitElement, PropertyValues, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { MediaQueryController } from '@vaadin/component-base/src/media-query-controller.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import '@vaadin/popover';
import '@vaadin/vertical-layout';

/**
 * Breakpoint at which the mobile layout is applied. Matches the one other Vaadin
 * components use.
 */
const MOBILE_MEDIA_QUERY = '(max-width: 450px), (max-height: 450px)';

/**
 * Whether the node is part of the ellipsis element that `_updateBreadcrumbs()`
 * generates, and therefore a mutation the component caused itself.
 */
function isGeneratedEllipsis(node: Node) {
  return node instanceof Element && !!node.closest('[part="ellipsis"]');
}

/**
 * Finds ranges of consecutive elements that have the "collapse" attribute.
 */
function findCollapseRanges(breadcrumbs: HTMLElement[]) {
  const ranges: { start: number; end: number }[] = [];
  let startIndex: number | null = null;

  breadcrumbs.forEach((item, index) => {
    if (item.hasAttribute('collapse')) {
      if (startIndex === null) {
        startIndex = index; // Start a new range
      }
    } else if (startIndex !== null) {
      ranges.push({ start: startIndex, end: index - 1 });
      startIndex = null;
    }
  });

  // If last item is part of a range, finalize it
  if (startIndex !== null) {
    ranges.push({ start: startIndex, end: breadcrumbs.length - 1 });
  }
  return ranges;
}

/**
 * Creates an ellipsis breadcrumb element to represent hidden items.
 *
 * - The element is a `<vcf-breadcrumb>` with a unique ID and "ellipsis" part.
 * - It displays "…" to indicate collapsed breadcrumbs.
 * - It does not shrink and maintains minimal width to prevent layout shifts.
 * - A `vaadin-popover` is attached to display the hidden breadcrumbs as a vertical list.
 * - Clicking an item inside the popover closes the popover.
 * - The ellipsis is dynamically inserted and removed as needed based on available space.
 * - The popover element is not focusable to improve accessibility; focus is set to the first menu item when opened.
 *
 * @param {HTMLElement[]} hiddenItems - The list of breadcrumbs that will be hidden and represented by the ellipsis
 * @returns {HTMLElement} An ellipsis breadcrumb element with an associated popover
 */
function createEllipsisBreadcrumb(hiddenItems: HTMLElement[]) {
  const ellipsis = document.createElement('vcf-breadcrumb');
  const id = `ellipsis-${crypto.randomUUID()}`;
  ellipsis.setAttribute('id', id);
  ellipsis.setAttribute('part', 'ellipsis');
  ellipsis.setAttribute('aria-label', 'Hidden breadcrumbs');
  ellipsis.innerText = '…';
  // Make sure the ellipsis is visible and positioned correctly
  ellipsis.style.display = 'inline-block';
  ellipsis.style.flexShrink = '0';
  ellipsis.style.minWidth = '0';

  // Create a popover to show the hidden breadcumbs and add it to the ellipsis element
  const popover = document.createElement('vaadin-popover');
  popover.setAttribute('for', id);
  popover.setAttribute('role', 'menu');
  popover.setAttribute('aria-labelledby', id);
  popover.setAttribute('theme', 'hidden-breadcrumbs');
  popover.setAttribute('position', 'bottom-start');
  popover.setAttribute('modal', 'true');
  // Prevent the popover itself from being a focus target for accessibility
  popover.setAttribute('tabindex', '-1');

  const verticalLayout = document.createElement('vaadin-vertical-layout');
  verticalLayout.classList.add('hidden-breadcrumbs-layout');
  // Prevent the layout container from being a focus target
  verticalLayout.setAttribute('tabindex', '-1');

  // create new anchor elements for the hidden items and add them to the vertical layout
  hiddenItems.forEach(element => {
    const item = document.createElement('a');
    item.textContent = element.textContent;
    item.setAttribute('href', element.getAttribute('href') ?? '');
    item.setAttribute('role', 'menuitem');
    // Copy element class list
    const elementClasses = Array.from(element.classList);
    item.classList.add(...elementClasses);
    item.classList.add('hidden-breadcrumb-anchor');

    // Add click event to close popover when clicking an item
    item.addEventListener('click', event => {
      popover.opened = false;
      // Stop propagation, since the popover is nested within the trigger
      // element the click would otherwise re-open the popover
      event.stopPropagation();
    });

    verticalLayout.appendChild(item);
  });
  popover.appendChild(verticalLayout);

  // Focus the first menu item when the popover opens
  popover.addEventListener('opened-changed', (event: any) => {
    if (event.detail.value) {
      // Use requestAnimationFrame to ensure the popover is fully rendered before focusing
      requestAnimationFrame(() => {
        const firstMenuItem = verticalLayout.querySelector(
          'a[role="menuitem"]'
        ) as HTMLElement;
        if (firstMenuItem) {
          firstMenuItem.focus();
        }
      });
    }
  });

  // append popover to ellipsis to move it later to the anchor within the container
  ellipsis.appendChild(popover);
  return ellipsis;
}

/**
 * A Web Component based on LitElement for displaying breadcrumbs.
 *
 * - Manages multiple `<vcf-breadcrumb>` elements, ensuring proper layout and responsiveness.
 * - Automatically hides breadcrumbs when space is limited, replacing them with an ellipsis element.
 * - Uses `ResizeMixin` to dynamically update visibility based on available space.
 * - The first breadcrumb always remains visible and does not shrink.
 * - Implements accessibility attributes to improved usability.
 * - Uses a `vaadin-popover` to display hidden breadcrumbs when the ellipsis is clicked.
 * - Themeable via Vaadin's ThemableMixin.
 *
 * Since version 2.2.0, mobile mode is added, which can be triggered in two ways:
 * - Based on a fixed breakpoint (same as other Vaadin components):
 *   `(max-width: 450px), (max-height: 450px)`
 * - Programmatically, using the flag `forceMobileMode`, which allows to enable mobile layout manually.
 *
 * Example usage:
 * ```html
 * <vcf-breadcrumbs>
 *   <vcf-breadcrumb href="/home">Home</vcf-breadcrumb>
 *   <vcf-breadcrumb href="/category" collapse>Category</vcf-breadcrumb>
 *   <vcf-breadcrumb href="/product" collapse>Product</vcf-breadcrumb>
 *   <vcf-breadcrumb>Details</vcf-breadcrumb>
 * </vcf-breadcrumbs>
 * ```
 *
 * @memberof Vaadin
 * @name vcf-breadcrumbs
 * @mixes ResizeMixin
 * @mixes ElementMixin
 * @mixes PolylitMixin
 * @demo demo/index.html
 */
@customElement('vcf-breadcrumbs')
export class VcfBreadcrumbs extends ResizeMixin(
  ElementMixin(PolylitMixin(LitElement))
) {
  /**
   * Flag to indicate if the component is in mobile mode.
   * Set based on the value of MOBILE_MEDIA_QUERY.
   *
   * Deliberately not a `@state()`: `PolylitMixin` overwrites the `attribute: false`
   * that `@state()` sets, which would expose this internal flag as a settable
   * `_mobile` attribute. The media query callback recalculates directly instead.
   */
  private _mobile = false;

  /**
   * Flag to force mobile mode, which allows the component to display in a mobile-friendly layout regardless of the screen size.
   * @attr {boolean} force-mobile-mode
   */
  @property({ type: Boolean })
  forceMobileMode = false;

  /**
   * Observes the light DOM so that the layout is recalculated whenever the
   * breadcrumb trail itself changes, not only when the component is resized.
   */
  private __trailObserver?: MutationObserver;

  static get is() {
    return 'vcf-breadcrumbs';
  }

  static get version() {
    return '3.0.3';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      [part='links-list'] {
        display: flex;
        justify-content: start;
        align-content: center;
        align-items: center;
      }
    `;
  }

  /**
   * Implement callback from `ResizeMixin` to update the vcf-breadcrumb elements visibility.
   *
   * @protected
   * @override
   */
  _onResize() {
    this._updateBreadcrumbs();
  }

  /**
   * Recalculate when the mobile mode changes, so that toggling `forceMobileMode`
   * (or crossing the responsive breakpoint) applies immediately instead of
   * waiting for the next resize.
   *
   * @protected
   * @override
   */
  updated(props: PropertyValues) {
    super.updated(props);

    if (props.has('forceMobileMode')) {
      this._updateBreadcrumbs();
    }
  }

  /**
   * Updates the visibility of breadcrumbs based on available space and mobile mode.
   *
   * Behavior summary:
   * - If all breadcrumbs have enough space, they are fully visible with no shrinking.
   * - If space is limited and some breadcrumbs have the "collapse" attribute:
   *    - Consecutive collapsed items are grouped into ranges.
   *    - These ranges are hidden when necessary and replaced with an ellipsis element.
   *    - The ellipsis element serves as an interactive control, revealing hidden breadcrumbs in a popover.
   * - If more space becomes available, hidden items are restored, and unnecessary ellipses are removed.
   * - The first breadcrumb remains fully visible and does not shrink.
   * - On mobile mode (either responsive or forced):
   *   - Breadcrumbs are styled for mobile navigation showing only back path.
   *   - Shows the last breadcrumb unless it's the current one.
   *   - Shows the breadcrumb directly before the current one.
   * - When returning to desktop mode:
   *   - Mobile-specific styles and classes are removed.
   *   - Breadcrumbs are adjusted for width and collapsing if needed.
   *
   * Mobile mode can be triggered in two ways:
   * - Based on a fixed breakpoint (same as other Vaadin components):
   *   `(max-width: 450px), (max-height: 450px)`
   * - Programmatically, using the flag `forceMobileMode`, which allows to enable mobile layout manually.
   */
  _updateBreadcrumbs() {
    // Remove existing ellipsis elements before recalculating
    this.querySelectorAll('[part="ellipsis"]').forEach(el => el.remove());

    // Get all breadcrumbs elements
    const breadcrumbs = Array.from(
      this.querySelectorAll('vcf-breadcrumb')
    ) as HTMLElement[];

    // Nothing to lay out. Reachable now that the trail is observed: a consumer
    // may empty the component before repopulating it.
    if (breadcrumbs.length === 0) {
      return;
    }

    // Reset all breadcrumbs to default visibility and allow middle items to shrink.
    // Visibility is restored unconditionally: an item hidden by a previous run may
    // since have lost its "collapse" attribute, and would otherwise stay hidden.
    //
    // The mobile classes are cleared here rather than only on the desktop branch,
    // so that every recalculation starts from a clean slate and the branch below
    // is free to just add what currently applies. This matters because the first
    // relayout can run before the items have marked themselves with
    // `aria-current` in their own `firstUpdated()`: without the reset, the
    // `is-last-not-current` decision taken on that incomplete state would stick
    // and leave the current page visible in mobile mode for good.
    breadcrumbs.forEach(breadcrumb => {
      breadcrumb.style.display = '';
      breadcrumb.style.flexShrink = breadcrumb.hasAttribute('collapse')
        ? '1'
        : '0';
      breadcrumb.classList.remove(
        'mobile-back',
        'is-last-not-current',
        'is-before-current'
      );
      breadcrumb
        .querySelector('.breadcrumb-anchor')
        ?.classList.remove('add-mobile-back-icon');
    });

    // If mobile mode is active (responsive or forced), apply mobile-specific logic
    if (this._mobile || this.forceMobileMode) {
      breadcrumbs.forEach(breadcrumb => {
        breadcrumb.classList.add('mobile-back');
      });

      // Handle the last breadcrumb: if it's not current, show it with a mobile back icon
      const lastItem = breadcrumbs[breadcrumbs.length - 1];
      if (!lastItem.hasAttribute('aria-current')) {
        lastItem.classList.add('is-last-not-current');
        lastItem
          .querySelector('.breadcrumb-anchor')
          ?.classList.add('add-mobile-back-icon');
      }

      // Iterate through all breadcrumb items except the last, to find the one just before the current item
      for (let i = 0; i < breadcrumbs.length - 1; i += 1) {
        const currentItem = breadcrumbs[i];
        const nextItem = breadcrumbs[i + 1];
        // If the next breadcrumb is the current one, mark this as the item before current
        if (nextItem.hasAttribute('aria-current')) {
          currentItem.classList.add('is-before-current');
          currentItem
            .querySelector('.breadcrumb-anchor')
            ?.classList.add('add-mobile-back-icon');
        }
      }
    } else {
      // If no breadcrumb has attribute "collapse", show all of them without shrinking
      if (
        breadcrumbs.every(breadcrumb => !breadcrumb.hasAttribute('collapse'))
      ) {
        breadcrumbs.forEach(breadcrumb => {
          breadcrumb.style.flexShrink = '0';
        });
        return;
      }

      // Ensure first item do not shrink
      const firstBreadcrumb = breadcrumbs[0];
      firstBreadcrumb.style.flexShrink = '0';
      firstBreadcrumb.style.minWidth = 'auto';

      // Get available space in the container. There is no box to measure while
      // the component is detached or hidden, in which case collapsing is
      // deferred to the next resize or trail change that happens when visible.
      const containerRect = this.getClientRects()[0];
      if (!containerRect) {
        return;
      }
      const containerWidth = containerRect.width;

      // Calculate total width of all breadcrumbs
      const totalWidth = breadcrumbs.reduce(
        (sum, item) => sum + (item.getClientRects()[0]?.width ?? 0),
        0
      );

      // Find collapse ranges
      const collapseRanges = findCollapseRanges(breadcrumbs);

      // If space is very limited, handle collapsing logic
      if (totalWidth > containerWidth + 1) {
        collapseRanges.forEach(({ start }) => {
          const collapseItem = breadcrumbs[start];

          // save the collapsed items
          const hiddenItems = [];

          // Hide collapsed items within this range
          for (
            let i = start;
            i <= collapseRanges.find(r => r.start === start)?.end!;
            i += 1
          ) {
            breadcrumbs[i].style.display = 'none';
            hiddenItems.push(breadcrumbs[i]);
          }

          // Insert an ellipsis element if it doesn't already exist
          if (
            collapseItem.previousElementSibling?.getAttribute('part') !==
            'ellipsis'
          ) {
            const ellipsis = createEllipsisBreadcrumb(hiddenItems);
            collapseItem.insertAdjacentElement('beforebegin', ellipsis);
          }
        });
      }
    }
  }

  render() {
    return html`
      <div part="links-list" role="list">
        <slot></slot>
      </div>
    `;
  }

  firstUpdated() {
    // Add aria tags to the component
    this.setAttribute('aria-label', 'breadcrumb');
    this.setAttribute('role', 'navigation');

    // Attach a media query controller to detect mobile mode responsively.
    // Updates the `_mobile` flag based on a fixed breakpoint and recalculates,
    // since `_mobile` is not a reactive property.
    this.addController(
      new MediaQueryController(MOBILE_MEDIA_QUERY, matches => {
        if (this._mobile !== matches) {
          this._mobile = matches;
          this._updateBreadcrumbs();
        }
      })
    );

    this.__observeTrail();
  }

  /**
   * Observes the breadcrumb trail so that the layout is recalculated whenever it
   * changes, and not only when the component is resized. Without this, adding,
   * removing or reordering `<vcf-breadcrumb>` elements at runtime leaves the
   * previous collapse and mobile state in place until the next resize, which
   * means every consumer that renders the trail dynamically - React, Flow or
   * plain JS - has to reach for an internal method to force a recalculation.
   *
   * Two kinds of change are watched:
   * - the child list, which covers adding, removing and reordering items;
   * - the `collapse` and `aria-current` attributes on items, which decide what
   *   may be collapsed and which item is the current page.
   *
   * `_updateBreadcrumbs()` itself removes and inserts the generated ellipsis
   * element, so those records are filtered out. Otherwise each recalculation
   * would trigger the observer again and loop indefinitely.
   *
   * @private
   */
  private __observeTrail() {
    this.__trailObserver = new MutationObserver(records => {
      const changed = records.some(record => {
        if (record.type === 'attributes') {
          return !isGeneratedEllipsis(record.target);
        }

        // Only the host's own children form the trail. Nodes added deeper in the
        // subtree, such as the anchor each `<vcf-breadcrumb>` builds for itself,
        // do not change it.
        if (record.target !== this) {
          return false;
        }

        return Array.from(record.addedNodes)
          .concat(Array.from(record.removedNodes))
          .some(node => !isGeneratedEllipsis(node));
      });

      if (changed) {
        this._updateBreadcrumbs();
      }
    });

    this.__trailObserver.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['collapse', 'aria-current'],
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vcf-breadcrumbs': VcfBreadcrumbs;
  }
}
