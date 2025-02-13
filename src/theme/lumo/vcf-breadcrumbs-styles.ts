import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vcf-breadcrumbs',
  css`
    [part='links-list'] {
      display: flex;
      justify-content: start;
      align-content: center;
      align-items: center;
    }   
  `
);
