import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';

import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vcf-breadcrumb',
  css`
  
    :host {
      --vcf-breadcrumb-separator-font-family: 'lumo-icons';
      --vcf-breadcrumb-separator-symbol: var(--lumo-icons-angle-right);
      --vcf-breadcrumb-separator-color: var(--lumo-contrast-40pct);
      --vcf-breadcrumb-separator-size: var(--lumo-font-size-s);
      --vcf-breadcrumb-separator-margin: 0;
      --vcf-breadcrumb-separator-padding: 0 var(--lumo-space-xs);
      --vcf-breadcrumb-anchor-text-decoration: none;
      --vcf-breadcrumb-anchor-color: var(--lumo-primary-text-color);
      --vcf-breadcrumb-ellipsis-color: var(--vcf-breadcrumb-anchor-color);
      --vcf-breadcrumb-current-page-color: var(--lumo-body-text-color);
    }

    :host {
      font-family: var(--lumo-font-family);
      color: var(--vcf-breadcrumb-anchor-color);
    }

    :host [part='separator'] {
      margin: var(--vcf-breadcrumb-separator-margin);
      padding: var(--vcf-breadcrumb-separator-padding);
    }

    :host [part='separator']::after {
      font-family: var(--vcf-breadcrumb-separator-font-family);
      content: var(--vcf-breadcrumb-separator-symbol);
      color: var(--vcf-breadcrumb-separator-color);
      font-size: var(--vcf-breadcrumb-separator-size);
      speak: none;
    }
   
    [part='link']{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    :host([aria-current="page"]) {
      color: var(--vcf-breadcrumb-current-page-color);
    }
    
    @media screen and (max-width: 420px) {
      :host([shift]:not(:first-of-type):not(:last-of-type)) {
        display: none;
      } 
    }
  `
);
