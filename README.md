# &lt;vcf-breadcrumb&gt;

[![npm version](https://badgen.net/npm/v/@vaadin-component-factory/vcf-breadcrumb)](https://www.npmjs.com/package/@vaadin-component-factory/vcf-breadcrumb)

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

Add `<vcf-breadcrumbs>` element to the page. Inside added element add few `<vcf-breadcrumb>` child elements, with `href` attribute. In case you want some `<vcf-breadcrumb>` elements collapse when there's not enough space, add attribute `collapse` to those elements. When user clicks on a `<vcf-breadcrumb>` element, it will navigate to the URL from `href` attribute of the element.

```html
<vcf-breadcrumbs>
  <vcf-breadcrumb href="#">Home</vcf-breadcrumb>
  <vcf-breadcrumb href="#">Directory</vcf-breadcrumb>
  <vcf-breadcrumb href="#" collapse>Components</vcf-breadcrumb>
  <vcf-breadcrumb href="#" collapse>VCF Components</vcf-breadcrumb>
  <vcf-breadcrumb>Breadcrumb</vcf-breadcrumb>
</vcf-breadcrumbs>
```
![breadcrumbs-01](https://github.com/user-attachments/assets/68327eba-57d6-48ad-9b92-3e0bf9c2623b)
![breadcrumbs-02](https://github.com/user-attachments/assets/f56e9aa0-756a-412e-86d6-71ee341fd878)
![breadcrumbs-03](https://github.com/user-attachments/assets/ae3b4816-0892-4651-b002-b4ac99412687)

## Updates since version 2.0.0

- Lit based component with theming support.
- The first item in the breadcrumb is always shown in full.
- The items can be collapsed when space runs out. This is configurable by using the attribute `collapse`. When availabe space is not enough to display the full label, then the label is shown with ellipsis.
- If space is even more limited, and some breadcrumbs have the `collapse` attribute:
    - Consecutive collapsed items are grouped into ranges.
    - Each range is hidden when necessary and replaced with an ellipsis element.
- `shift` attribute from previous version was removed. Responsive behavior is now given by the `collapse` attribute implementation.

### Customize separators

By default, there are few css variables that help you update the separator's style:

| CSS Variable | Definition | Default value |
|--------------|------------|---------------|
| --vcf-breadcrumb-separator-font-family | Font family of the separator icon | lumo-icons |
| --vcf-breadcrumb-separator-symbol | Separator icon | var(--lumo-icons-angle-right) |
| --vcf-breadcrumb-separator-color | Color of the separator icon | var(--lumo-contrast-40pct) |
| --vcf-breadcrumb-separator-size | Size of the separator icon | var(--lumo-font-size-s) |  
| --vcf-breadcrumb-separator-margin | Margin of the separator icon | 0 |    
| --vcf-breadcrumb-separator-padding | Padding of the separator icon | 0 var(--lumo-space-xs) |    

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
