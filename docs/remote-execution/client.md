---
id: client
title: Client
sidebar_label: Client
---

> Connects to a webmiddle-server, allowing remote services execution.

## Install

```bash
yarn webmiddle-client
```

## Usage

Given a [webmiddle-server](https://github.com/webmiddle/webmiddle/tree/master/packages/webmiddle-server) running on port 3000 on localhost:

```javascript
// "localhost" since the server is in the same machine in this example
const client = new Client({
  protocol: "http",
  hostname: "localhost",
  port: "3000",
  apiKey: "justAnyStringHere012"
});

// remote services can now be used like they were defined locally
// e.g. if the remote server has a Multiply service at path "math/multiply"
const Multiply = client.service("math/multiply");

rootContext.extend({
  networkRetries: 2
}).evaluate(
  <Multiply
    a={10}
    b={20}
  />
).then(result => {
  console.log(result);
}).catch(err => {
  console.log((err && err.stack) || err);
});
```

## How it works

Under the hood, it uses the `web-server` REST API (HTTP or WebSocket).

For each path, it creates a component that, when evaluated, executes an HTTP or WebSocket request to the webmiddle-server,
asking it to execute the remote service at that path. The response is used as the component output.

### Constructor parameters

The constructor takes a single options object with the following properties:
- **protocol**: can be either "http" or "ws". Defaults to "ws".
- **hostname**: defaults to "localhost".
- **port**: defaults to 3000.
- **apiKey**: defaults to the empty string.