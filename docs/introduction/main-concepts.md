---
id: main-concepts
title: Main concepts
---

webmiddle is an open source framework for extracting data from
websites and web APIs. It is built with Node.js and has extensibility at its core.

## Component

The building block of any webmiddle application is the **component**: a function that takes a `props` object as parameter.

**Example:**

```jsx
const Sum = (props) => props.a + props.b;

// can also be written as
const Sum = ({ a, b }) => a + b;
```

The main aspect is that components logic can be defined with [JSX](http://facebook.github.io/jsx/).

```jsx
const SumItself = ({ number }) =>
  <Sum a={number} b={number} />
```

Roughly speaking, JSX can be seen as similar to XML but with the ability of embedding JavaScript expressions inside curly braces `{}`.

In the example above, we are defining the `SumItself` component logic as

```jsx
<Sum a={number} b={number} />
```

which will be evaluated by the framework as

```javascript
Sum({ a: number, b: number })
```

Similarly to XML, we can also specify `children` nodes:

```jsx
const Component = () =>
  <OtherComponent foo="bar">
    <ChildComponent />
    <OtherChildComponent />
  </OtherComponent>
```

Children are passed to the component as `props.children` property:

```jsx
const OtherComponent = ({ foo, children }) => {
  // do something with `children`
  console.log(children.length);
};
```

## Virtual

Note that on build, JSX such as

```jsx
  <OtherComponent foo="bar">
    <ChildComponent />
    <OtherChildComponent />
  </OtherComponent>
```

is transpiled to something like

```javascript
{
  type: OtherComponent,
  attributes: { foo: "bar" },
  children: [
    {
      type: ChildComponent,
      attributes: {},
      children: []
    },
    {
      type: OtherChildComponent,
      attributes: {},
      children: []
    }
  ]
}
```

This tree structure, called **Virtual**, can be analyzed and evaluated by the framework and is what makes features such as devtools debugging possible.

## Context

The other main aspect of a webmiddle application is the **context**. It's used for evaluating components and contains all the options and configurations for doing so.

The framework provides a `rootContext` that can be extended for defining further options.

```javascript
import { rootContext } from "webmiddle";

const context = rootContext.extend({
  debug: true,
  networkRetries: 2,
});

const otherContext = context.extend({
  networkRetries: 0,
});
```

Given a context, it can be used for evaluating **virtuals** and other values:

```javascript
const result = await context.evaluate(
  <Sum a={10} b={20} />
);
console.log(result); // 30
```

Components get the context they are being evaluated with as second parameter:

```javascript
const Sum = ({ a, b }, context) => {
  console.log(context.options); // { debug: true, networkRetries: 2 }
  return a + b;
};
```

As such, `context.options` is a useful way for passing common properties down the components tree, without having to specify them everytime as `props`.

## Resource

The last important aspect of webmiddle applications is the **resource**.

A resource can be created with the `context.createResource` function and is an object with the format

```javascript
{ id, name, contentType, content }
```

**Example:**

```javascript
const resource = context.createResource(
  'rawHTML',
  'text/html',
  '<h1>Hello World</h1>'
);
```

Resources can be returned by components and passed as props. They are an useful way of defining data that has been extracted from a webpage or that has been transformed.

The `context.isResource` function can be used to check if a certain value is a resource:

```javascript
console.log( context.isResource(resource) ); // true

console.log({
  id: "some",
  name: 'rawHTML',
  contentType: 'text/html'
  content: '<h1>Hello World</h1>'
}); // false, must use `context.createResource`
```

A `resource` can be stringified and parsed back. This is useful to store a resource in the filesystem or for sending it over the network.

```javascript
const stringifiedResource = context.stringifyResource(resource);

const parsedResource = context.parseResource(stringifiedResource);
```

Note that the stringify/parse operation changes depending on the `contentType` of the resource, for example `text/html` resources are just kept as is, while `application/json` resources are stringified by using the standard `JSON.stringify` function.

## Service

A service is just a Component that only accepts and returns JSON-serializable data.

Services are used as the "top-level" components of a webmiddle application, their input could be from a JSON configuration file or from an HTTP request.

They are mainly used for [webmiddle-server](http://localhost:3000/docs/remote-execution/server).