---
id: resume
title: Resume
sidebar_label: Resume
---

> A component that makes a task **resumable** by caching the result.

## Install

```bash
yarn webmiddle-component-resume
```

## Properties

Name                   | Description
-----------------------|------------------------------------------------------
savePath               | The filesystem path where the result should be saved.
task                   | Task that should be resumable.

## Usage

```jsx
import { PropTypes, rootContext } from 'webmiddle';
import Resume from 'webmiddle-component-resume';

const SubComponent = () => 'foo';

const MyComponent = () => (
  <Resume savePath="./cache/resource1" task={
    <SubComponent />
  }/>
);

rootContext.evaluate(<MyComponent />)
.then(resource => {
  console.log(resource.name); // "foo"
});
```

## How it works

Evaluates the `task`, the result is wrapped into a `x-webmiddle-type` resource, so to preserve any Resource and Virtual objects, then saves it to the **filesystem**.

On subsequent executions, the component checks if the result is already
stored in the filesystem, if so it just returns such result.

Since the result is stored in the filesystem, it will last even among
different executions of the application. This makes possible to resume
work in case the application terminated abruptly and in other similar
scenarios.

The save path is specified via the **savePath** property, which is
relative to the **outputBasePath** context option.
