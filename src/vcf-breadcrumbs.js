/**
 * @license
 * Copyright (C) 2015 Vaadin Ltd.
 * This program is available under Commercial Vaadin Add-On License 3.0 (CVALv3).
 * See the file LICENSE.md distributed with this software for more information about licensing.
 * See [the website]{@link https://vaadin.com/license/cval-3} for the complete license.
 */

import { html, PolymerElement } from '@polymer/polymer/polymer-element';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { ElementMixin } from '@vaadin/vaadin-element-mixin';
import '@vaadin/vaadin-license-checker/vaadin-license-checker';
import '@polymer/iron-media-query';

/**
 * `<vcf-breadcrumbs>` Web Component providing an easy way to display breadcrumbs.
 *
 * ```html
 * <vcf-breadcrumbs></vcf-breadcrumbs>
 * ```
 *
 * @memberof Vaadin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @demo demo/index.html
 */
class VcfBreadcrumbs extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>

      <iron-media-query query="[[_phoneMediaQuery]]" query-matches="{{mobile}}"> </iron-media-query>

      <div part="links-list">
        <slot></slot>
      </div>
    `;
  }

  static get is() {
    return 'vcf-breadcrumbs';
  }

  static get version() {
    return '1.2.2';
  }

  ready() {
    super.ready();

    this.setAttribute('aria-label', 'breadcrumb');
    this.setAttribute('role', 'navigation');
  }

  static get properties() {
    return {
      steps: {
        type: Array,
        value: () => []
      },

      mobile: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: '_isMobile'
      },

      _phoneMediaQuery: {
        value: '(max-width: 420px)'
      }
    };
  }

  /**
   * @protected
   */
  static _finalizeClass() {
    super._finalizeClass();

    const devModeCallback = window.Vaadin.developmentModeCallback;
    const licenseChecker = devModeCallback && devModeCallback['vaadin-license-checker'];
    if (typeof licenseChecker === 'function') {
      licenseChecker(VcfBreadcrumbs);
    }
  }

  _isMobile() {
    this._getSteps();

    if (this.mobile && this.steps.length > 0) {
      this.steps.forEach(step => {
        if (step.href && step.shift) {
          step.style.display = 'none';
        }
      });
    } else {
      this.steps.forEach(step => {
        step.style.display = 'inline';
      });
    }
  }

  _getSteps() {
    const steps = this.querySelectorAll('vcf-breadcrumb');
    if (steps.length > 0) {
      this.set('steps', steps);
    }
  }
}

customElements.define(VcfBreadcrumbs.is, VcfBreadcrumbs);

/**
 * @namespace Vaadin
 */
window.Vaadin.VcfBreadcrumbs = VcfBreadcrumbs;
