---
id: jsonselecttojson
title: JSONSelectToJson
sidebar_label: JSONSelectToJson
---

> Component that transforms a JSON resource into another JSON resource by using JSONSelect.

## Install

```bash
yarn webmiddle-component-jsonselect-to-json
```

## Properties


Name                       | Description
---------------------------|------------------------------------------------------
name (optional)            | The name of the returned resource.
from                       | The JSON resource to convert.
content                    | The schema for the conversion.

## Usage

```jsx
import { rootContext, isResource } from "webmiddle";
import JSONSelectToJson, { $$ } from "webmiddle-component-jsonselect-to-json";
import isEqual from 'lodash/isEqual';

const jsonResource = rootContext.createResource(
  "jsonResource",
  "application/json",
  [
    {
      id: "978-0641723445",
      cat: ["book", "hardcover"],
      name: "The Lightning Thief",
      author: "Rick Riordan",
      series_t: "Percy Jackson and the Olympians",
      sequence_i: 1,
      genre_s: "fantasy",
      inStock: true,
      price: 12.5,
      pages_i: 384
    },
    {
      id: "978-1423103349",
      cat: ["book", "paperback"],
      name: "The Sea of Monsters",
      author: "Rick Riordan",
      series_t: "Percy Jackson and the Olympians",
      sequence_i: 2,
      genre_s: "fantasy",
      inStock: true,
      price: 6.49,
      pages_i: 304
    }
  ]
);

const output = await rootContext.evaluate(
  <JSONSelectToJson name="result" from={jsonResource} content={
    {
      books: $$.within(":root > *", $$.map({
        name: $$.getFirst(".name"),
        genre: $$.postprocess(
          $$.getFirst(".genre_s"),
          genreString => genreString.toUpperCase()
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
      name: "The Lightning Thief",
      genre: "FANTASY"
    },
    {
      name: "The Sea of Monsters",
      genre: "FANTASY"
    }
  ]
})); // true
```

## How it works

Parses the JSON resource specified in the `from` prop using the [JSONSelect](https://github.com/lloyd/JSONSelect) library.

Creates and returns a JSON resource with the specified `name` by processing the schema specified in the `content` prop.

The `content` can be any javascript value, such as a plain object, that represents the content of the JSON resource that should be created.

Such javascript value is recursively processed, executing different actions depending on the type of the value.

Note that JSONSelect collections are just plain arrays.

### Evaluate

Initially, the value is evaluated with `context.evaluate`.

Functions are executed with the `(sourceEl, JSONSelect, options)` parameters.

- **sourceEl**: the current JSONSelect collection, by default is `[from.content]`.
- **JSONSelect**: the JSONSelect object.
- **options**: mostly used internally. Contains the current context as `options.context`. 

This means that the dynamic parts of the JSON resource can be specified by using functions.

The `JSONSelect` object is accessible, thus this component can also be used as a plain wrapper on top of the JSONSelect library:

```jsx
<JSONSelectToJson name="result" from={jsonResource} content={
  (rootEl, JSONSelect) => {
    // do whatever with JSONSelect
  }
}/>
```

Since it uses `context.evaluate`, **promise** will be awaited and components will be executed too.

```jsx
<JSONSelectToJson name="result" from={xmlResource} content={
  (rootEl, $) =>
    <SubComponent rootEl={rootEl} />
}/>
```

**In case of exceptions**, instead of failing completely, the error is logged in the console and the `null` value is returned. This choice was made since web pages change often, parts that once were there get rearrenged and removed, thus is better to use a local `null` value rather than failing the whole conversion.

### Undefined

The `undefined` value is converted into `null`.

### Functional layer

The component provides a `$$` object, which is a container of functions that can be used to make the conversion more declarative.

Each of these functions takes some parameters and returns a `(sourceEl, JSONSelect, options)` function which is eventually evaluated to perform some actions on the current `sourceEl`.

#### $$

> `$$(selector)`

Will return a collection of elements that match `selector` relatively to `sourceEl`.

The `selector` can be either a function, a string that can be passed as `JSONSelect.match(selector, undefined, rawItem)` for each `rawItem` in `sourceEl`, or any other value.

If the result isn't a collection, then it will be wrapped into one. If the result is a plain array, then the collection is created  with the items of the array.

```jsx
$$(".name")
// => ["The Lightning Thief", "The Sea of Monsters"]

// or also
$$($$.getFirst(".name")) // will be automatically wrapped into a collection
// => ["The Lightning Thief"]
```

#### within

> `$$.within(selector, body)`

Will process `body` by changing the `sourceEl` to the one obtained with `$$(selector)`.

```jsx
$$.within(".name", el => el[0])

// or also

$$.within($$(".name"), el => el[0])

// => "The Lightning Thief"
```

#### get

> `$$.get(i)`

If `i` is undefined returns the whole `sourceEl`, otherwise returns `sourceEl[i]`.

#### getFirst(selector?)

If selector is undefined, then behaves as `$$.get(0)`, otherwise as `$$.within(selector, $$.get(0))`.

```jsx
$$.getFirst('.name');

// => "The Lightning Thief"
```

#### map

> `$$.map(body)`

Returns a new collection by processing `body` with each item in `sourceEl` as the new `sourceEl`.

Note that each item is wrapped into a collection (plain array).

```jsx
$$.within(".name", $$.map({
  title: $$.get(0)
}))

// => [{ title: "The Lightning Thief" }, { title: "The Sea of Monsters" }]
```

#### filter

> `$$.filter(fn)`

Returns a new collection by only keeping the items in `sourceEl` that pass the `fn([item], JSONSelect, options)` test.

Note that each item is wrapped into a collection (plain array).

```jsx
$$.within(".name", $$.filter(
  nameEl => nameEl.text().search(/monsters/i) >= 0
))

// => ["The Sea of Monsters"]
```

#### pipe

> `$$.pipe(...tasks)`

Eexecutes the tasks in order, using the result of the previous task as the `sourceEl` of the next task.

The first task is called with `sourceEl`.

Note that the result of each task should be a collection, if it isn't one, then it will be wrapped into one automatically.

Returns the result of the last task. If no task is specified, then returns `sourceEl`.

```jsx
$$.within(".name", $$.pipe(
  $$.filter(nameEl => nameEl.text().search(/monsters/i) >= 0),
  $$.map(nameEl => nameEl.text().toUpperCase())
))

// => ["THE SEA OF MONSTERS"]
```

#### postprocess

> `$$.postprocess(body, postprocessFn)`

This function can be used to execute further actions on the processed data.

Will process `body` and then call `postprocessFn(result, JSONSelect, options)` where `result` is the processed body.

Note that the return value of `postprocessFn` is furtherly processed, thus it can contain functions and such.

```jsx
$$.postprocess($$(".name"), titles =>
  titles.reduce((obj, title) => {
    const key = title.replace(/ /g, "_").toUpperCase();
    obj[key] = () => title; // function will be called (the result is processed)
    return obj;
  }, {})
)

/* =>
{
  THE_LIGHTNING_THIEF: "The Lightning Thief",
  THE_SEA_OF_MONSTERS: "The Sea of Monsters"
}
*/
```
