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
import { customElement} from 'lit/decorators.js';
import { ThemableMixin } from "@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js";
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
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
 * @mixes ThemableMixin
 * @mixes PolylitMixin
 * @demo demo/index.html
 */
@customElement("vcf-breadcrumbs")
export class VcfBreadcrumbs extends ResizeMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {

  static get is() {
    return 'vcf-breadcrumbs';
  }

  static get version() {
    return '2.1.0';
  }

  static get styles() {
    return css`
        :host {
          display: block;
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
   * Updates the visibility of breadcrumbs based on available space.
   * 
   * - If all breadcrumbs have enough space, they are fully visible with no shrinking.
   * - If space is limited and some breadcrumbs have the "collapse" attribute:
   *    - Consecutive collapsed items are grouped into ranges.
   *    - These ranges are hidden when necessary and replaced with an ellipsis element.
   *    - The ellipsis element serves as an interactive control, revealing hidden breadcrumbs in a popover.
   * - If more space becomes available, hidden items are restored, and unnecessary ellipses are removed.
   * - The first breadcrumb remains fully visible and does not shrink.
   */   
  _updateBreadcrumbs() {
    // Get all breadcrumbs elements
    const breadcrumbs = Array.from(this.children) as HTMLElement[];

    // If no breadcrumb has attribute "collapse", show all of them without shrinking
    if(breadcrumbs.every(breadcrumb => !breadcrumb.hasAttribute("collapse"))) {
      breadcrumbs.forEach((breadcrumb) => {
        breadcrumb.style.flexShrink = '0';   
      });
      return;
    }

    // Reset all breadcrumbs to default visibility and allow middle items to shrink
    breadcrumbs.forEach((breadcrumb) => {
      if(breadcrumb.hasAttribute("collapse")){
        breadcrumb.style.display = '';
        breadcrumb.style.flexShrink = '1';    
      } else {
        breadcrumb.style.flexShrink = '0';   
      }
    });

    // Ensure first item do not shrink
    const firstBreadcrumb = breadcrumbs[0];
    firstBreadcrumb.style.flexShrink = '0';
    firstBreadcrumb.style.minWidth = 'auto';

    // Get available space in the container
    const containerWidth = this.clientWidth;

    // Calculate total width of all breadcrumbs
    let totalWidth = breadcrumbs.reduce((sum, item) => sum + item.offsetWidth, 0);

    // Find collapse ranges
    const collapseRanges = this._findCollapseRanges(breadcrumbs);

    // Remove existing ellipsis elements before recalculating
    this.querySelectorAll('[part="ellipsis"]').forEach((el) => el.remove());

    // If space is very limited, handle collapsing logic
    if (totalWidth > containerWidth) {
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
    let popover = document.createElement("vaadin-popover");
    popover.setAttribute("for", id);
    popover.setAttribute("overlay-role", "menu");
    popover.setAttribute('accessible-name-ref', "hidden breadcrumbs"); 
    popover.setAttribute("theme", "hidden-breadcrumbs");
    popover.setAttribute("position", "bottom-start");
    popover.setAttribute("modal", "true");

    popover.renderer = (root) => {
      // Ensure content is only added once
      if (!root.firstChild) {
        const verticalLayout = document.createElement('vaadin-vertical-layout');
        verticalLayout.classList.add('hidden-breadcrumbs-layout');

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
          item.addEventListener("click", () => {
            popover.opened = false;
          });

          verticalLayout.appendChild(item); 
        });              
        root.appendChild(verticalLayout);    
      }
    };

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
  }

}
