/*-
 * #%L
 * 
 * Copyright (C) 2018 - 2025 Vaadin Ltd
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
import { html, LitElement, css } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { MediaQueryController } from '@vaadin/component-base/src/media-query-controller.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import '@vaadin/popover';
import '@vaadin/vertical-layout';

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
@customElement("vcf-breadcrumbs")
export class VcfBreadcrumbs extends ResizeMixin(ElementMixin(PolylitMixin(LitElement))) {

  /**
   * Flag to indicate if the component is in mobile mode. 
   * Set based on the value of _mobileMediaQuery.
   */
  @state() 
  private _mobile = false;

  /**
   * Media query definition to determine if the component is in mobile mode.
   * This is used to apply responsive styles and behavior.
   * The value is set to match the same breakpoint as other Vaadin components:
   * `(max-width: 450px), (max-height: 450px)`.
   */
  @state()
  private _mobileMediaQuery = '(max-width: 450px), (max-height: 450px)';

  /**
   * Flag to force mobile mode, which allows the component to display in a mobile-friendly layout regardless of the screen size.
   * @attr {boolean} force-mobile-mode
   */
  @property({ type: Boolean })
  forceMobileMode = false;

  static get is() {
    return 'vcf-breadcrumbs';
  }

  static get version() {
    return '3.0.0';
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
    this.querySelectorAll('[part="ellipsis"]').forEach((el) => el.remove());

    // Get all breadcrumbs elements
    const breadcrumbs = Array.from(this.querySelectorAll('vcf-breadcrumb')) as HTMLElement[];

    // Reset all breadcrumbs to default visibility and allow middle items to shrink
    breadcrumbs.forEach((breadcrumb) => {
      if(breadcrumb.hasAttribute("collapse")){
        breadcrumb.style.display = '';
        breadcrumb.style.flexShrink = '1';    
      } else {
        breadcrumb.style.flexShrink = '0';   
      }
    });

    // If mobile mode is active (responsive or forced), apply mobile-specific logic
    if(this._mobile || this.forceMobileMode) {
      breadcrumbs.forEach((breadcrumb) => {
        breadcrumb.classList.add("mobile-back");
      });

      // Handle the last breadcrumb: if it's not current, show it with a mobile back icon
      const lastItem = breadcrumbs[breadcrumbs.length - 1];
      if (!lastItem.hasAttribute('aria-current')) {
          lastItem.classList.add('is-last-not-current');
          lastItem.querySelector(".breadcrumb-anchor")?.classList.add('add-mobile-back-icon');
      }

      // Iterate through all breadcrumb items except the last, to find the one just before the current item
      for (let i = 0; i < breadcrumbs.length - 1; i++) {
          const currentItem = breadcrumbs[i];
          const nextItem = breadcrumbs[i + 1];
         // If the next breadcrumb is the current one, mark this as the item before current
          if (nextItem.hasAttribute('aria-current')) {
              currentItem.classList.add('is-before-current');
              currentItem.querySelector(".breadcrumb-anchor")?.classList.add('add-mobile-back-icon');
          }
      }

    } else {
      // If not in mobile mode, remove mobile-specific classes
      breadcrumbs.forEach((breadcrumb) => {
        breadcrumb.classList.remove("mobile-back", 'is-last-not-current', 'is-before-current'); 
        breadcrumb.querySelector(".breadcrumb-anchor")?.classList.remove('add-mobile-back-icon');
      });

      // If no breadcrumb has attribute "collapse", show all of them without shrinking
      if(breadcrumbs.every(breadcrumb => !breadcrumb.hasAttribute("collapse"))) {
        breadcrumbs.forEach((breadcrumb) => {
          breadcrumb.style.flexShrink = '0';   
        });
        return;
      }

      // Ensure first item do not shrink
      const firstBreadcrumb = breadcrumbs[0];
      firstBreadcrumb.style.flexShrink = '0';
      firstBreadcrumb.style.minWidth = 'auto';

      // Get available space in the container
      const containerWidth = this.getClientRects()[0].width;

      // Calculate total width of all breadcrumbs
      let totalWidth = breadcrumbs.reduce((sum, item) => sum + item.getClientRects()[0].width, 0);

      // Find collapse ranges
      const collapseRanges = this._findCollapseRanges(breadcrumbs);

      // If space is very limited, handle collapsing logic
      if (totalWidth > (containerWidth + 1)) {
        collapseRanges.forEach(({ start }) => {
          const collapseItem = breadcrumbs[start];

          // save the collapsed items
          let hiddenItems = [];
    
          // Hide collapsed items within this range
          for (let i = start; i <= collapseRanges.find(r => r.start === start)?.end!; i++) {
            breadcrumbs[i].style.display = 'none';
            hiddenItems.push(breadcrumbs[i]);
          }
    
          // Insert an ellipsis element if it doesn't already exist
          if (collapseItem.previousElementSibling?.getAttribute("part") != "ellipsis") {
            let ellipsis = this._createEllipsisBreadcrumb(hiddenItems);
            collapseItem.insertAdjacentElement("beforebegin", ellipsis);
          }        
        });
      } 
    }
  }

 /**
  * Finds ranges of consecutive elements that have the "collapse" attribute.
  */
  _findCollapseRanges(breadcrumbs: HTMLElement[]) { 
    const ranges: { start: number; end: number }[] = [];
    let startIndex: number | null = null;

    breadcrumbs.forEach((item, index) => {
      if (item.hasAttribute("collapse")) {
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
  _createEllipsisBreadcrumb(hiddenItems: HTMLElement[]) {
    let ellipsis = document.createElement("vcf-breadcrumb");
    const id = "ellipsis-" + crypto.randomUUID();
    ellipsis.setAttribute("id", id);
    ellipsis.setAttribute("part", "ellipsis");
    ellipsis.setAttribute("aria-label", "Hidden breadcrumbs");
    ellipsis.innerText = "…";
    // Make sure the ellipsis is visible and positioned correctly
    ellipsis.style.display = 'inline-block';
    ellipsis.style.flexShrink = '0';
    ellipsis.style.minWidth = '0';

    // Create a popover to show the hidden breadcumbs and add it to the ellipsis element
    const popover = document.createElement("vaadin-popover");
    popover.setAttribute("for", id);
    popover.setAttribute("role", "menu");
    popover.setAttribute('aria-labelledby', id);
    popover.setAttribute("theme", "hidden-breadcrumbs");
    popover.setAttribute("position", "bottom-start");
    popover.setAttribute("modal", "true");
    // Prevent the popover itself from being a focus target for accessibility
    popover.setAttribute("tabindex", "-1");

    const verticalLayout = document.createElement('vaadin-vertical-layout');
    verticalLayout.classList.add('hidden-breadcrumbs-layout');
    // Prevent the layout container from being a focus target
    verticalLayout.setAttribute("tabindex", "-1");

    // create new anchor elements for the hidden items and add them to the vertical layout
    hiddenItems.forEach((element) => {
      const item = document.createElement('a');
      item.textContent = element.textContent;
      item.setAttribute("href", element.getAttribute('href') ?? '');
      item.setAttribute("role", "menuitem");
      // Copy element class list
      const elementClasses = Array.from(element.classList);
      item.classList.add(...elementClasses);
      item.classList.add("hidden-breadcrumb-anchor");

      // Add click event to close popover when clicking an item
      item.addEventListener("click", (event) => {
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
          const firstMenuItem = verticalLayout.querySelector('a[role="menuitem"]') as HTMLElement;
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

    // Attach a media query controller to detect mobile mode responsively
    // Updates the `_mobile` state based on a fixed breakpoint
    this.addController(
      new MediaQueryController(this._mobileMediaQuery, (matches) => {
        this._mobile = matches;
      }),
    );
  }

}
