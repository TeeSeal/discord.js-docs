## discord.js docs

A parser and wrapper for the [discord.js](https://github.com/discordjs/discord.js) docs.

## Usage

### Doc

```js
const Doc = require('discord.js-docs')
```

### Doc.fetch(sourceName[, options])
Fetches and parses the docs for the given project.\
`sourceName` can be any of the predefined values (`stable`, `main`, `commando`, `rpc`, `akairo`, `collection`, `builders`, `voice` and `rest`)
or an URL which will return the raw generated docs (e.g https://raw.githubusercontent.com/discordjs/docs/main/discord.js/main.json ).\
Once a documentation is fetched it will be cached. Use `options.force` to avoid this behavior.

**Params**:

|name       |type  |required|
|:---------:|:----:|:------:|
|sourceName |string|yes     |
|options    |object|no      |

**Returns**: `Promise<Doc?>`

```js
const doc = await Doc.fetch('main')
const doc = await Doc.fetch('akairo', { force: true })
const doc = await Doc.fetch(
  'https://raw.githubusercontent.com/discordjs/rpc/docs/master.json',
  { force: true }
)
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
#### Properties:
- `doc` - the Doc this element originates from;
- `docType` - the type of this documentation element. One of `class`, `event`, `interface`, `method`, `param`, `prop` and `typedef`;
- `parent` - parent element if present;
- `name` - self-explanatory;
- `description` - self-explanatory;
- `meta` - any meta information if present;
- `returns` - the type this element returns, if applicable;
- `examples` - code examples, if any;
- `type` - the JS type of this element, if applicable;
- `nullable` - tells whether this element can be null;
- `deprecated` - tells whether this element has been deprecated;
- `access` - access level for this element. Defaults to `public`;








