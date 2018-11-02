---
id: withoptions
title: WithOptions
sidebar_label: WithOptions
---

> A component that evaluates its **only** child by extending the current context with the new given options.

## Properties

Name                   | Description
-----------------------|------------------------------------------------------
children               | Array containing a single child that should be evaluated.
...options             | All the other passed properties are used as the new context options.

## Example

```jsx
import { rootContext, WithOptions } from 'webmiddle';

const ReturnOption = ({ optionName }, context) => context.createResource(
  "result",
  "text/plain",
  context.options[optionName],
);

const Component = () => (
  <WithOptions foo="bar">
    <ReturnOption optionName="foo" />
  </WithOptions>
);

rootContext.extend({
  foo: "some"
}).evaluate(
  <Component />
).then(resource => {
  console.log(resource.content); // "bar"
});
```
