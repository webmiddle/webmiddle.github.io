---
id: errorboundary
title: ErrorBoundary
sidebar_label: ErrorBoundary
---

> A component used for error handling

## Properties

Name                   | Description
-----------------------|------------------------------------------------------
retries (optional)     | The number of retries, defaults to zero. Use a negative number for unlimited retries.
isRetryable (optional) | Function that given the error returns a boolean stating if a retry should be attempted. Defaults to a function that always return `true`.
try                    | Value that should be evaluated.
catch (optional)       | Function called in case no further retries can be attempted. Gets the error as parameter and must return the value to use as fallback. If this property is not specified, then the error will be thrown instead.

## Usage

```jsx
import { rootContext, ErrorBoundary } from 'webmiddle';

const FallbackComponent = (props, context) => context.createResource(
  "result",
  "text/plain",
  "fallback"
);

const ThrowComponent = () => {
  throw new Error('expected fail');
};

const Component = () => (
  <ErrorBoundary
    retries={-1}
    isRetryable={err => err.message !== 'expected fail'}
    try={
      <ThrowComponent />
    }
    catch={
      err => <FallbackComponent />
    }
  />
);

rootContext.evaluate(
  <Component />
).then(resource => {
  console.log(resource.content); // "fallback"
});
```

## How it works

Evaluates its **only** child by wrapping it in a `try...catch` and allowing for retries and catch handling.

A negative `retries` number means unlimited retries.