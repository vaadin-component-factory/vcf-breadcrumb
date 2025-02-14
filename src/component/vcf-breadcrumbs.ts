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
 * LitElement based version of `<vcf-breadcrumbs>` Web Component.
 * Provides an easy way to display breadcrumbs.
 *
 * ```html
 * <vcf-breadcrumbs></vcf-breadcrumbs>
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
    return '2.0.0';
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
   * If space is limited, only the first, last, and an ellipsis in the middle are shown.
   * If there's enough space, the ellipsis element is removed.
   */
  _updateBreadcrumbs() {
    // Get all breadcrumbs elements
    const breadcrumbs = Array.from(this.children) as HTMLElement[];

    // Check if there are enough breadcrumbs to apply the logic
    if (!breadcrumbs || breadcrumbs.length < 3) {
      return;
    }

    // Reset all breadcrumbs to default visibility and allow middle items to shrink
    breadcrumbs.forEach((breadcrumb) => {
      breadcrumb.style.display = '';
      breadcrumb.style.flexShrink = '1';
    });

    // Ensure first and last items do not shrink
    const firstBreadcrumb = breadcrumbs[0];
    const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
    firstBreadcrumb.style.flexShrink = '0';
    firstBreadcrumb.style.minWidth = 'auto';
    lastBreadcrumb.style.flexShrink = '0';
    lastBreadcrumb.style.minWidth = 'auto';

    // Get available space in the container
    const containerWidth = this.clientWidth;

    // Calculate total width of all breadcrumbs
    let totalWidth = breadcrumbs.reduce((sum, item) => sum + item.offsetWidth, 0);

    // If space is very limited, show only first, last, and an ellipsis in the middle
    if (totalWidth > containerWidth) {
      // Hide middle items, excluding the ellipsis
      breadcrumbs.slice(1, -1).forEach((breadcrumb) => {
      if(breadcrumb.getAttribute("part") != "ellipsis") {
          breadcrumb.style.display = 'none';
        }        
      });

      // Create an ellipsis breadcrumb if it does not exist
      const ellipsisInserted = firstBreadcrumb.nextElementSibling?.getAttribute("part") == "ellipsis";
      if (!ellipsisInserted) {
        let ellipsis = document.createElement("vcf-breadcrumb");
        ellipsis.setAttribute("part", "ellipsis");
        ellipsis.innerText = "…";
        firstBreadcrumb.insertAdjacentElement("afterend", ellipsis);

        // Make sure the ellipsis is visible and positioned correctly
        ellipsis.style.display = 'inline-block';
        ellipsis.style.flexShrink = '0';
        ellipsis.style.minWidth = '0';

        // Update ellipsis color
        ellipsis.style.color = "var(--vcf-breadcrumb-ellipsis-color)";
      }      
    } else {
      // Remove ellipsis if there's enough space
      if (firstBreadcrumb.nextElementSibling?.getAttribute("part") == "ellipsis") {
        firstBreadcrumb.nextElementSibling.remove();
      }
    }    
  }

  
  render() {
    return html`
      <div role="list" part="links-list">
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
