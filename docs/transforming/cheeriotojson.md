---
id: cheeriotojson
title: CheerioToJson
sidebar_label: CheerioToJson
---

> Component that transforms a HTML or XML resource into a JSON resource by using Cheerio.

## Install

```bash
yarn webmiddle-component-cheerio-to-json
```

## Properties


Name                       | Description
---------------------------|------------------------------------------------------
name (optional)            | The name of the returned resource.
from                       | The HTML/XML resource to convert.
content                    | The schema for the conversion.

## Usage

```jsx
import { rootContext, isResource } from "webmiddle";
import CheerioToJson, { $$ } from "webmiddle-component-cheerio-to-json";
import isEqual from 'lodash/isEqual';

const xmlResource = rootContext.createResource("xmlResource", "text/xml", `
  <bookstore>
    <book category="COOKING">
      <title lang="en">Everyday Italian</title>
      <author>Giada De Laurentiis</author>
      <year>2005</year>
      <price>30.00</price>
    </book>
    <book category="CHILDREN">
      <title lang="en">Harry Potter</title>
      <author>J K. Rowling</author>
      <year>2005</year>
      <price>29.99</price>
    </book>
  </bookstore>
`);

const output = await rootContext.evaluate(
  <CheerioToJson name="result" from={xmlResource} content={
    {
      books: $$.within("book", $$.map({
        category: $$.attr("category"),
        lang: $$.within("title", $$.attr("lang")),
        title: $$.getFirst("title"),
        author: $$.getFirst("author"),
        year: $$.postprocess(
          $$.getFirst("year"),
          yearString => parseInt(yearString, 10)
        ),
        price: $$.postprocess(
          $$.getFirst("price"),
          priceString => parseFloat(priceString)
        )
      }))
    }
  }/>
);

console.log(isResource(output)); // true
console.log(output.name) // "result"
console.log(output.contentType) // "application/json"
console.log(isEqual(output.content, {
  books: [
    {
      category: "COOKING",
      lang: "en",
      title: "Everyday Italian",
      author: "Giada De Laurentiis",
      year: 2005,
      price: 30
    },
    {
      category: "CHILDREN",
      lang: "en",
      title: "Harry Potter",
      author: "J K. Rowling",
      year: 2005,
      price: 29.99
    }
  ]
})); // true
```

## How it works

Parses the HTML or XML resource specified in the `from` prop using the [Cheerio](https://github.com/cheeriojs/cheerio) library.

Creates and returns a JSON resource with the specified `name` by processing the schema specified in the `content` prop.

The `content` can be any javascript value, such as a plain object, that represents the content of the JSON resource that should be created.

Such javascript value is recursively processed, executing different actions depending on the type of the value.

### Evaluate

Initially, the value is evaluated with `context.evaluate`.

Functions are executed with the `(sourceEl, $, options)` parameters.

- **sourceEl**: the current cheerio collection, by default is the document root.
- **$**: the cheerio object obtained by parsing the xml/html resource.
- **options**: mostly used internally. Contains the current context as `options.context`. 

This means that the dynamic parts of the JSON resource can be specified by using functions.

The `$` object is accessible, thus this component can also be used as a plain wrapper on top of the Cheerio library:

```jsx
<CheerioToJson name="result" from={xmlResource} content={
  (rootEl, $) => {
    // do whatever with $
  }
}/>
```

Since it uses `context.evaluate`, **promise** will be awaited and components will be executed too.

```jsx
<CheerioToJson name="result" from={xmlResource} content={
  (rootEl, $) =>
    <SubComponent rootEl={rootEl} />
}/>
```

**In case of exceptions**, instead of failing completely, the error is logged in the console and the `null` value is returned. This choice was made since web pages change often, parts that once were there get rearrenged and removed, thus is better to use a local `null` value rather than failing the whole conversion.

### DOM nodes

When processing a DOM node:

- If it's a DOM element, then returns the cheerio `val()` or `text()` of the element.
- Otherwise, returns the node `data`  property.

### Cheerio collections

A cheerio collection is converted into a plain array by recursively processing the items in the collection.

Given how DOM nodes are converted, this means that if the collection only contains DOM elements (the common use case), then it will be converted into an array with the text of each element.

```jsx
<CheerioToJson name="result" from={xmlResource} content={
  (rootEl, $) =>
    rootEl.find('title')
}/>

// => ["Everyday Italian", "Harry Potter"]
```

### Undefined

The `undefined` value is converted into `null`.

### Functional layer

The component provides a `$$` object, which is a container of functions that can be used to make the conversion more declarative.

Each of these functions takes some parameters and returns a `(sourceEl, $, options)` function which is eventually evaluated to perform some actions on the current `sourceEl`.

#### $$

> `$$(selector)`

Will return a collection of elements that match `selector` relatively to `sourceEl`.

The `selector` can be either a function, a string that can be passed as `$(selector, sourceEl)` or any other value.

If the result isn't a collection, then it will be wrapped into one. If the result is a plain array, then the collection is created  with the items of the array.

```jsx
$$("title")

// or also

$$(el => el.find('title').get()) // will be automatically wrapped into a collection

// => ["Everyday Italian", "Harry Potter"]
```

#### within

> `$$.within(selector, body)`

Will process `body` by changing the `sourceEl` to the one obtained with `$$(selector)`.

```jsx
$$.within("book", $$.attr("category"))

// or also

$$.within($$("book"), $$.attr("category"))

// => "COOKING"
```

#### attr

> `$$.attr(...args)`

Will execute `sourceEl.attr(...args)`

#### get

> `$$.get(...args)`

Will execute `sourceEl.get(...args)`

#### getFirst(selector?)

If selector is undefined, then behaves as `$$.get(0)`, otherwise as `$$.within(selector, $$.get(0))`.

```jsx
$$.getFirst('title');

// => "Everyday Italian"
```

#### map

> `$$.map(body)`

Returns a new collection by processing `body` with each item in `sourceEl` as the new `sourceEl`.

Note that differently from the cheerio `map` function, here each item is wrapped into a cheerio collection.

```jsx
$$.within("title", $$.map({
  title: $$.get(0)
}))

// => [{ title: "Everyday Italian" }, { title: "Harry Potter" }]
```

#### filter

> `$$.filter(fn)`

Returns a new collection by only keeping the items in `sourceEl` that pass the `fn($([item]), $, options)` test.

Note that differently from the cheerio `filter` function, here each item is wrapped into a cheerio collection.

```jsx
$$.within("title", $$.filter(
  titleEl => titleEl.text().search(/italian/i) >= 0
))

// => ["Everyday Italian"]
```

#### pipe

> `$$.pipe(...tasks)`

Eexecutes the tasks in order, using the result of the previous task as the `sourceEl` of the next task.

The first task is called with `sourceEl`.

Note that the result of each task should be a cheerio collection, if it isn't one, then it will be wrapped into one automatically.

Returns the result of the last task. If no task is specified, then returns `sourceEl`.

```jsx
$$.within("title", $$.pipe(
  $$.filter(titleEl => titleEl.text().search(/italian/i) >= 0),
  $$.map(titleEl => titleEl.text().toUpperCase())
))

// => ["EVERYDAY ITALIAN"]
```

#### postprocess

> `$$.postprocess(body, postprocessFn)`

This function can be used to execute further actions on the processed data.

Will process `body` and then call `postprocessFn(result, $, options)` where `result` is the processed body.

Note that the return value of `postprocessFn` is furtherly processed, thus it can contain functions and such.

```jsx
$$.postprocess($$("title"), titles =>
  titles.reduce((obj, title) => {
    const key = title.replace(/ /g, "_").toUpperCase();
    obj[key] = () => title; // function will be called (the result is processed)
    return obj;
  }, {})
)

/* =>
{
  EVERYDAY_ITALIAN: "Everyday Italian",
  HARRY_POTTER: "Harry Potter"
}
*/
```