## discord.js docs

A parser and wrapper for the [discord.js](https://github.com/discordjs/discord.js) docs.

## Documentation below is outdated cba updating nobody uses this except me smh sorry

## Usage

### Doc

```js
const Doc = require('discord.js-docs')
```
**Warning: all methods will return `null` in case they somehow fail to resolve what you're looking for.**\
Will probably have them throw an error in the future... maybe..

### Doc.fetch(sourceName[, options])
Fetches and parses the docs for the given project.\
`sourceName` can be any of the predefined values (`stable`, `master`, `commando`, `rpc`, `akairo` and `akairo-master`)
or an URL which will return the raw generated docs (e.g https://raw.githubusercontent.com/discordjs/discord.js/docs/master.json ).\
Once a documentation is fetched it will be cached. Use `options.force` to avoid this behavior.

**Params**:

|name       |type  |required|
|:---------:|:----:|:------:|
|sourceName |string|yes     |
|options    |object|no      |

**Returns**: `Promise<Doc?>`

```js
const doc = await Doc.fetch('main', 'master')
const doc = await Doc.fetch('main', 'master', { force: true })
```

### Doc#get(parent[, child1[ ...[, childN]]])
Gets documention for one element. Multiple properties/methods can be chained.
**Params**:

|name       |type  |required|
|:---------:|:----:|:------:|
|parent     |string|yes     |
|...children|string|no      |

**Returns**: `DocElement?`

```js
doc.get('message')
doc.get('message', 'guild')
doc.get('message', 'guild', 'members')
```

### Doc#search(query)
Searches the documentation using fuzzy search for the given query and returns top 10 hits.

**Params**:

|name   |type  |required|
|:-----:|:----:|:------:|
|query  |string|yes     |

**Returns**: `Array<DocElement>?`

### Doc#resolveEmbed(query)
Tries to resolve the query into a `DocElement` using `Doc#get`. The search terms are expected to be separated by `#` or `.`, example: `message#pin`. If an element cannot be resolved, falls back to `Doc#search`. The result is then formatted into an object representing a Discord embed which can be sent directly to a Discord channel.

**Params**:

|name   |type  |required|
|:-----:|:----:|:------:|
|query  |string|yes     |

**Returns**: `object?`

### DocElement
Cba documenting pls help







