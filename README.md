# &lt;vcf-breadcrumb&gt;

[![npm version](https://badgen.net/npm/v/@vaadin-component-factory/vcf-breadcrumb)](https://www.npmjs.com/package/@vaadin-component-factory/vcf-breadcrumb)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadin-component-factoryvcf-breadcrumb)

This is the LitElement based version of `<vcf-breadcrumbs>` Web Component.

## Installation

Install `vcf-breadcrumb`:

```sh
npm i @vaadin-component-factory/vcf-breadcrumb --save
```

## Usage

Once installed, import it in your application:

```js
import '@vaadin-component-factory/vcf-breadcrumb';
```

Add `<vcf-breadcrumbs>` element to the page. Inside added element add few `<vcf-breadcrumb>` child elements, with `href` attribute. In case you want some `<vcf-breadcrumb>` elements to not be shown in mobile view, add attribute `shift` to those elements. When user click on `<vcf-breadcrumb>` element he/she will be navigated to ULR from `href` attribute of the element.

```html
<vcf-breadcrumbs>
  <vcf-breadcrumb shift href="#">Home</vcf-breadcrumb>
  <vcf-breadcrumb href="#">Directory</vcf-breadcrumb>
  <vcf-breadcrumb href="#">Breadcrumb</vcf-breadcrumb>
</vcf-breadcrumbs>
```

## Updates since version 2.0.0

- Lit based component.
- The first and last item in the breadcrumb are always shown in full.
- The items between first and last can be clipped when space runs out.
- If space is limited, only the first, last, and an ellipsis in the middle are shown.
- `shift` attribute allows to hide elements except for first and last ones.

### Customize vcf-breadcrumb

By default, there are few css variables that help you to change the style of each vcf-breadcrumb:

| CSS Variable | Definition | Default value |
|--------------|------------|---------------|
| --vcf-breadcrumb-separator-font-family | Font family of the separator icon | lumo-icons |
| --vcf-breadcrumb-separator-symbol | Separator icon  | var(--lumo-icons-angle-right) |
| --vcf-breadcrumb-separator-color | Color of the separator icon    | var(--lumo-contrast-40pct) |
| --vcf-breadcrumb-separator-size | Size of the separator icon | var(--lumo-font-size-s) |  
| --vcf-breadcrumb-separator-margin | Margin of the separator icon | 0 |    
| --vcf-breadcrumb-separator-padding | Padding of the separator icon | 0 var(--lumo-space-xs) |    
| --vcf-breadcrumb-anchor-text-decoration | Text decoration of the anchor in the breadcrumb | none |    
| --vcf-breadcrumb-anchor-text-decoration-hover | Text decoration of the anchor in the breadcrumb on hover | underline |    
| --vcf-breadcrumb-anchor-color | Color of the anchor in the breadcrumb | var(--lumo-primary-text-color) |   
| --vcf-breadcrumb-anchor-color-hover  | Color of the anchor in the breadcrumb on hover | var(--vcf-breadcrumb-anchor-color) | 
| --vcf-breadcrumb-ellipsis-color | Color of the ellipsis on the breadcrumb | var(--vcf-breadcrumb-anchor-color) | 
| --vcf-breadcrumb-current-page-color | Color of the current page | var(--lumo-body-text-color) |  

## Running demo

1. Fork the `vcf-breadcrumb` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vcf-breadcrumb` directory, run `npm install` to install dependencies.

1. Run `npm start` to open the demo.

## Contributing

To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.

## License
Distributed under Apache Licence 2.0. 

### Sponsored development
Major pieces of development of this add-on has been sponsored by multiple customers of Vaadin. Read more about Expert on Demand at: [Support](https://vaadin.com/support) and [Pricing](https://vaadin.com/pricing).
