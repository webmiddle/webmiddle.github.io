---
id: pipe
title: Pipe
sidebar_label: Pipe
---

> Executes a sequence of tasks, piping the result of a task to the next task.

## Install

```bash
yarn webmiddle-component-pipe
```

## Properties

Name                   | Description
-----------------------|------------------------------------------------------
children               | The tasks to execute.

## Usage


```jsx
import { PropTypes, rootContext } from 'webmiddle';
import Pipe from 'webmiddle-component-pipe';

const SubComponent1 = () => 'foo';
const SubComponent2 = ({ input }) => input + 'Bar';
const SubComponent3 = ({ input }) => input + 'Some';

const MyComponent = () => (
  <Pipe>
    <SubComponent1 />

    {result1 =>
      <SubComponent2
        input={result1}
      />
    }

    {result2 =>
      <SubComponent3
        input={result2}
      />
    }
  </Pipe>
);

rootContext.evaluate(<MyComponent />)
  .then(result => {
    console.log(result); // "fooBarSome"
  });
```

## How it works

The tasks to execute are specified via **children**. In case a
function is specified, then such function is called with the last result.

The component resolves with the result returned by the last child.
.
If any of the child fails, then the component fails with the error
returned by the failed child.