# Documentation

## Table of Contents
- [Doc](#doc)
  - [Class: `Doc`](#class-doc)
    - [`Doc.fetch(source[, options])`](#docfetchsource-options-static)
    - [`Doc.get(parent[, ...children])`](#docgetparent-children)
    - [`Doc.search(query[, options])`](#docsearchquery-options)
    - [`Doc.resolveEmbed(query[, options])`](#docresolveembedquery-options)
  - [Class: `DocElement`](#class-docelement)
    - [`doc`](#doc-1)
    - [`docType`](#doctype)
    - [`parent`](#parent)
    - [`name`](#name)
    - [`description`](#description)
    - [`meta`](#meta)
    - [`returns`](#returns)
    - [`examples`](#examples)
    - [`type`](#type)
    - [`nullable`](#nullable)
    - [`deprecated`](#deprecated)
    - [`access`](#access)

# Doc

## Class: `Doc`

```js
const Doc = require('discord.js-docs');
```

### `Doc.fetch(source[, options])` *(static)*

- `source` [\<String>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) The project to fetch the documentation for. Can be `stable`, `master`, `commando`, `rpc`, `akairo`, `akairo-master`, `collection` or an URL for the raw generated documentation (E.G. <https://raw.githubusercontent.com/discordjs/discord.js/docs/master.json>).
- `options` [\<Object>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `force` [\<Boolean>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) If the cache should be skipped and the API accessed directly.
- **Returns:** [`Promise<Doc?>`](#class-doc)

Fetches and parses the documentation for the specified project.

```js
const doc = await Doc.fetch('master');
const doc = await Doc.fetch('akairo-master', { force: true });
const doc = await Doc.fetch(
  'https://raw.githubusercontent.com/discordjs/discord-rpc/docs/master.json',
  { force: true }
);
```

### `Doc.get(parent[, ...children])`

- `parent` [\<String>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) The parent element.
- `children` [\<String>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) Chained properties/methods.
- **Returns:** [`DocElement?`](#class-docelement)

Gets the documentation for the specified element/property/method. Multiple properties/methods can be chained.

```js
const message = doc.get('message');
const guild = doc.get('message', 'guild');
const members = doc.get('message', 'guild', 'members');
```

### `Doc.search(query[, options])`

- `query` [\<String>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) The search query.
- `options` [\<Object>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `excludePrivateElements` [\<Boolean>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) If private elements should be ignored.
- **Returns:** [`Array<DocElement>?`](#class-docelement)

Searches the documentation (using fuzzy search) for the given query and returns the top 10 results.

```js
const results = doc.search('activity flags');
const results = doc.search('client user', { excludePrivateElements: true });
```

### `Doc.resolveEmbed(query[, options])`

- `query` [\<String>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) The search query.
- `options` [\<Object>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `excludePrivateElements` [\<Boolean>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) If private elements should be ignored.
- **Returns:** [`Object?`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Tries to resolve the query into a [`DocElement`](#class-docelement) using [`Doc.get(parent[, ...children])`](#docgetparent-children). The search terms are expected to be separated  by `#` or `.` (E.G. `message#pin`). If an element cannot be resolved, [`Doc.search(query[, options])`](#docsearchquery-options) is used instead.

The result is then formatted into an object representing a Discord embed (which can be sent directly to a Discord channel without further modification).

```js
const resultsEmbed = doc.resolveEmbed('client#members');
const resultsEmbed = doc.resolveEmbed('Activity Flags');
const resultsEmbed = doc.resolveEmbed('Activity', { excludePrivateElements: true });
```

## Class: `DocElement`

### `doc`

- **Returns:** [`Doc`](#class-doc)

The [`Doc`](#class-doc) this element originates from.

### `docType`

- **Returns:** [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

The type of documentation element. Can be `class`, `event`, `interface`, `method`, `param`, `prop` or `typedef`.

### `parent`

- **Returns:** [`DocElement?`](#class-docelement)

The parent element of this element (if present).

### `name`

- **Returns:** [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

The name of this element.

### `description`

- **Returns:** [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

The description of this element.

### `meta`

- **Returns:** [`String?`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

The metadata of this element (if present).

### `returns`

- **Returns:** [`String?`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

The type this element returns (if applicable).

### `examples`

- **Returns:** [`String?`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

Code examples (if present).

### `type`

- **Returns:** [`String?`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

The JavaScript type of this element (if applicable).

### `nullable`

- **Returns:** [`Boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

If this element can be null.

### `deprecated`

- **Returns:** [`Boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

If this element has been deprecated.

### `access`

- **Returns:** [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

The access level of this element. **Default:** `public`.
