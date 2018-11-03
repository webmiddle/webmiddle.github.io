---
id: parallel
title: Parallel
sidebar_label: Parallel
---

> Executes multiple tasks concurrently.

## Install

```bash
yarn webmiddle-component-parallel
```

## Properties

Name                   | Description
-----------------------|------------------------------------------------------
limit (optional)       | An integer for setting the maximum concurrency.
tasks                  | The tasks to execute, can be an array or an object.

## Usage

```jsx
import { PropTypes, rootContext } from 'webmiddle';
import Parallel from 'webmiddle-component-parallel';
import isEqual from 'lodash/isEqual';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const SubComponent = ({ ms, string }) => delay(ms).then(() => {
  console.log(input);
  return string;
});

const MyComponent = () => (
  <Parallel tasks={
    {
      result1: <SubComponent delay={500} string="foo" />,
      result2: <SubComponent delay={0} string="bar" />,
      result3: <SubComponent delay={250} string="some" />
    }
  }/>
);

rootContext.evaluate(<MyComponent />)
.then(result => {
  // was logged in the console:
  // - "bar"
  // - "some"
  // - "foo"

  console.log(isEqual(result, {
    result1: 'foo',
    result2: 'bar',
    result3: 'some',
  })); // true
});
```

## How it works

Tasks can be specified as an array of tasks or as an object that maps task names to tasks.
The component resolves with such array/object mapped with the results of the tasks.

If every child is fully synchronous, then its behavior is like that of Pipe.<br />
In the other end, if the task returns a promise, then such promise will
be added to a pool and the next task will be executed immediately.

If any of the task fails, then the whole component fails with the error
returned by the failed task.

This component also supports a **limit** property that can be used to
limit the maximum number of concurrent tasks that should be running at
any given time. If limit is 1, then the tasks will be executed in
order, one after another, similarly to the Pipe component.