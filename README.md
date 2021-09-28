# vcf-breadcrumbs Web Component
[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadin-component-factoryvcf-breadcrumb)

&lt;vcf-breadcrumbs&gt; is a Web Component providing an easy way to display breadcrumb on web pages.

[Live Demo ↗](https://incubator.app.fi/breadcrumb-demo/breadcrumbs)

<img src="https://raw.githubusercontent.com/vaadin/incubator-breadcrumb/master/screenshot.png" width="400" alt="Screenshot of vcf-breadcrumbs">


## Usage
Add `<vcf-breadcrumbs>` element to the page. Inside added element add few `<vcf-breadcrumb>` child elements, with `href` attribute. In case you want some `<vcf-breadcrumb>` elements to not be shown in mobile view, add attribute `shift` to those elements. When user click on `<vcf-breadcrumb>` element he/she will be navigated to ULR from `href` attribute of the element.

```html
  <vcf-breadcrumbs>
    <vcf-breadcrumb shift href="#">Home</vcf-breadcrumb>
    <vcf-breadcrumb href="#">Directory</vcf-breadcrumb>
    <vcf-breadcrumb href="#">Breadcrumb</vcf-breadcrumb>
  </vcf-breadcrumbs>
```

## Installation

This components is distributed as Bower packages.

### Polymer 2 and HTML Imports compatible version

Install `vcf-breadcrumbs`:

```sh
bower i vaadin/vcf-breadcrumbs --save
```

Once installed, import it in your application:

```html
<link rel="import" href="bower_components/vcf-breadcrumbs/vcf-breadcrumbs.html">
```

## Getting Started

Vaadin components use the Lumo theme by default.

## The file structure for Vaadin components

- `src/vcf-breadcrumbs.html`

  Unstyled component.

- `theme/lumo/vcf-breadcrumbs.html`

  Component with Lumo theme.

- `vcf-breadcrumbs.html`

  Alias for theme/lumo/vcf-breadcrumbs.html


## Running demos and tests in browser

1. Fork the `vcf-breadcrumbs` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vcf-breadcrumbs` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vcf-breadcrumbs/demo
  - http://127.0.0.1:8080/components/vcf-breadcrumbs/test


## Running tests from the command line

1. When in the `vcf-breadcrumbs` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Contributing

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `polymer test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin components team members

# Vaadin Prime
This component is available in Vaadin Prime subscription. It is still open source, but you need to have a valid CVAL license in order to use it. Read more at: https://vaadin.com/pricing

# License
Commercial Vaadin Add-on License version 3 (CVALv3). For license terms, see LICENSE.

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
