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
import { customElement, queryAssignedElements} from 'lit/decorators.js';
import { ThemableMixin } from "@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js";
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';

/**
 * A Web Component based on LitElement for displaying breadcrumbs.
 * 
 * - Manages multiple `<vcf-breadcrumb>` elements, ensuring proper layout and responsiveness.
 * - Automatically hides breadcrumbs when space is limited, replacing them with an ellipsis element.
 * - Uses `ResizeMixin` to dynamically update visibility based on available space.
 * - The first breadcrumb always remains visible and does not shrink.
 * - Implements accessibility attributes to improved usability.
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
  
  @queryAssignedElements()
  steps!: Array<HTMLElement>;

  static get is() {
    return 'vcf-breadcrumbs';
  }

  static get version() {
    return '2.0.1';
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
   * - If some breadcrumbs have the "collapse" attribute and space is limited:
   *    - Consecutive collapsed items are grouped into ranges.
   *    - Each range is hidden when necessary and replaced with an ellipsis element.
   * - If space allows, previously hidden items are restored and ellipses are removed.
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
  
        // Hide collapsed items within this range
        for (let i = start; i <= collapseRanges.find(r => r.start === start)?.end!; i++) {
          breadcrumbs[i].style.display = 'none';
        }
  
        // Insert an ellipsis element if it doesn't already exist
        if (collapseItem.previousElementSibling?.getAttribute("part") != "ellipsis") {
          let ellipsis = this._createEllipsisBreadcrumb();
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
   * - The element is a `<vcf-breadcrumb>` with an "ellipsis" part.
   * - It displays as "…" to indicate collapsed breadcrumbs.
   * - It does not shrink and maintains minimal width to avoid layout shifts.
   * - This element is inserted dynamically when space constraints require hiding breadcrumbs.
   * 
   * @returns {HTMLElement} An ellipsis breadcrumb element.
   */
  _createEllipsisBreadcrumb() {
    let ellipsis = document.createElement("vcf-breadcrumb");
    ellipsis.setAttribute("part", "ellipsis");
    ellipsis.innerText = "…";
    // Make sure the ellipsis is visible and positioned correctly
    ellipsis.style.display = 'inline-block';
    ellipsis.style.flexShrink = '0';
    ellipsis.style.minWidth = '0';
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
