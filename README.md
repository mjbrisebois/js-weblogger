[![](https://img.shields.io/npm/v/@whi/weblogger/latest?style=flat-square)](http://npmjs.com/package/@whi/weblogger)

# `new Logger( context, level )`
This micro-package provides a minimalist logging class for web browsers.

[![](https://img.shields.io/github/issues-raw/mjbrisebois/js-weblogger?style=flat-square)](https://github.com/mjbrisebois/js-weblogger/issues)
[![](https://img.shields.io/github/issues-closed-raw/mjbrisebois/js-weblogger?style=flat-square)](https://github.com/mjbrisebois/js-weblogger/issues?q=is%3Aissue+is%3Aclosed)
[![](https://img.shields.io/github/issues-pr-raw/mjbrisebois/js-weblogger?style=flat-square)](https://github.com/mjbrisebois/js-weblogger/pulls)


## Overview

> Bundled size is less than 2KB

## Install

```bash
npm i @whi/weblogger
```

## Usage

#### Browser
```html
<script src="weblogger.bundled.js"></script>

<script type="text/javascript">
    const { Logger } = WebLogger;
    const log = new Logger( "main" );

    log.fatal("Testing");
    log.error("Testing");
    log.warn("Testing");
    log.normal("Testing"); // default level
    log.info("Testing");
    log.debug("Testing");
    log.trace("Testing");
</script>
```

#### Node
```javascript
const { Logger } = require('@whi/weblogger');

const log = new Logger( "main", "debug" );

log.fatal("Testing");
log.error("Testing");
log.warn("Testing");
log.normal("Testing");
log.info("Testing");
log.debug("Testing");
log.trace("Testing"); // would not log
```

#### Set defaults using `localStorage`

```javascript
window.localStorage.setItem("LOG_COLOR", "false"); // turn off coloring
window.localStorage.setItem("LOG_LEVEL", "debug"); // set default level to "debug"
```

#### Avoiding expensive arg computations

Short-circuit using logical operators
```javascript
log.level.debug && log.debug("Expensive arg computation: %s", value.map(...).join(", ") );
```

Or, a callback function that only evaluates when a message will be logged.
```javascript
log.debug("Expensive arg computation: %s", () => [ value.map(...).join(", ") ]);
```

### API Reference

#### `new Logger( context, level, colors )`
Change this Logger's verbosity level.

- `context` - *(required)* an identifier used in the log format
- `level` - *(optional)* the starting log level
  - defaults to level 3 (normal)
- `colors` - *(optional)* a boolean for log coloring
  - defaults to `true`


#### `<Logger>.setLevel( level )`
Change this Logger's verbosity level.

- `level` - *(required)* the new log level

Returns the integer value of the new level.


### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
