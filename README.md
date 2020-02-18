# Materia - Stripe addon

Stripe addon allow you to add payment in your Materia application using Stripe.

## Features

- Subscriptions
- European VAT & Fixed VAT

## Installation from NPM

In your Materia application, run `yarn add @materia/stripe`

Restart Materia Designer

## Installation from local files

Clone this repository:

```
git clone git@github.com:thyb/materia-stripe.git
cd materia-stripe
```

Then install dependencies and build:

```
yarn
yarn build
```

To test your addon locally before publishing it to NPM, use `npm link`:

```
cd dist && npm link
```

and in your materia application

```
npm link @materia/stripe
```

then add `"@materia/addon-stripe": "^1.0.0"` in the dependencies of the package.json - it will let Materia knows of the existance of the addon.
