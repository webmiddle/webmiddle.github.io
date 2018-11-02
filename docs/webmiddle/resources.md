---
id: resources
title: Resources
sidebar_label: Resources
---

Resources can be:

- created with `context.createResource(name, contentType, content)`
- serialized with `context.stringifyResource(resource)`
- deserialized with `context.parseResource(data)`
- checked with `context.isResource(target)`

When using `context.createResuorce` a different class is instantiated depending on the `contentType`.

Different classes have different serialization and deserialization logic.

Follows a list with the built-in resource classes.

## Resource

Name                   | Description
-----------------------|------------------------------------------------------
content-type           | (default)
stringifyContent       | Cnverted to string by using `String()`. The `null` and `undefined` values are converted to the empty string.
parseContent           | the value is just returned as is, since it is supposed to be a plain string.

## JsonResource

Name                   | Description
-----------------------|------------------------------------------------------
content-type           | `application/json`
stringifyContent       | `JSON.stringify`
parseContent           | `JSON.parse`

## WebmiddleVirtualResource

Name                   | Description
-----------------------|------------------------------------------------------
content-type           | `x-webmiddle-virtual`

Extends `JsonResource`. Used for Virtual objects.

## WebmiddleTypeResource

Name                   | Description
-----------------------|------------------------------------------------------
content-type           | `x-webmiddle-type`

Extends `JsonResource`, but has the ability to serialize Virtual and Resource objects in a reversible way, meaning that the deserialization step will recreate the actual Virtual and Resource instances with the correct types.

Note that when deserializing inner resources, their ID won't be the same as the original one, meaning a new Resource is created.

See the [source code](https://github.com/webmiddle/webmiddle/blob/master/packages/webmiddle/src/utils/resource.js) for `stringifyContent` and `parseContent` functions.