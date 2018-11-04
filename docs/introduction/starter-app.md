---
id: starter-app
title: Starter App
sidebar_label: Starter App
---

## Files structure

```
- src
 -- services
  --- FetchPageLinks.js
 -- components
 -- tests
  --- index.js
  --- FetchPageLinks.js
```

Put your services into the `src/services` folder. They will be accessible from within `webmiddle-devtools`. Their props, context options and return value should all be JSON-serializable since will be transferred over the network.

Put your other components into `src/components`.

Organize your tests info multiple files and folders into `src/tests`.

## Testing

 Remember to export the tests with [index.js](https://github.com/webmiddle/webmiddle-starter-app/blob/master/src/tests/index.js) files or they won't be accessible from within `webmiddle-devtools`.

By default tests use [AVA](https://github.com/avajs), which means they will be executed in parallel and can be written with modern JavaScript, since they are transpiled with Babel.

Every test you define also creates a Service that can be used within `webmiddle-devtools` to debug the test. This is done by using [test-wrapper.js](https://github.com/webmiddle/webmiddle-starter-app/blob/master/src/test-wrapper.js). If you would like to use another testing library, then you should create an appropriate `test-wrapper.js` file.

Ckeck out [src/tests/FetchPageLinks](https://github.com/webmiddle/webmiddle-starter-app/blob/master/src/tests/FetchPageLinks.js) for an example.

## Debugging

Start the `webmiddle-server` together with `webmiddle-devtools` and rebuild automatically on changes with

```sh
yarn start:devtools
```

To change the ports of `webmiddle-server` and `webmiddle-devtools`, set the PORT env variable in `package.json` scripts `server` and `devtools`, respectively.

In the **evaluation** tab, you can also put the description of a test to search for it.

Make sure to set the `debug` context option to `true`, otherwise you won't be able to inspect the evaluation call tree.

Specify further `props` and `context.options` and then press **Evaluate**.
 