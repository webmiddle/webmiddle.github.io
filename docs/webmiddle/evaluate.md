---
id: evaluate
title: Evaluate
sidebar_label: Evaluate
---

The `context.evaluate(value)` function executes different actions depending on the type of `value`.
Once the result is obtained, it recursively calls the `evaluate` function on it.

During the evaluations, new children contexts could be created.

- If `value` is a **function**, calls it with the spreaded `context.options.functionParameters` parameters.

- If `value` is a **promise**, awaits it.

- If `value` is a **Virtual**, then evaluates it (see **evaluateVirtual** section).

At the end, if the result isn't a Resource but the `context.options.expectResource` is true, then throws an error.

## evaluateVirtual

If `virtual.type` isn't a function, then just return `virtual`.

Otherwise `virtual.type` is the `component` that needs to be called.

If `component.propTypes` is set, then validates the prop types, logging an error in the console if it fails.

Then it calls `component(props, context)`, where `props` is obtained as

```javascript
const props = {
  ...virtual.attributes,
  children: virtual.children
};
```

Finally, recursively call `evaluate` on the result.

## PropTypes

Uses https://www.npmjs.com/package/prop-types

Eample:

```
import { PropTypes } from "webmiddle";

const Component = ({ input }) => input + 'foo';
Component.propTypes = {
  input: PropTypes.string.isRequired,
};