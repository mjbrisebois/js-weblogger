[back to README.md](README.md)

# Contributing

## Overview
This is a micro-package designed to be light-weight and make 1 job as simply as possible.  That job
should only be to make clear log messages by having levels and console coloring.


## Development

### Environment

- Developed using Node.js `v14.17.3`

### Building
No build required.  Vanilla JS only.

### Bundling
Uses webpack

```
npm run build
```

### Testing

To run all tests with logging
```
make test-debug
```

- `make test-unit-debug` - **Unit tests only**
- `make test-integration-debug` - **Integration tests only**

> **NOTE:** remove `-debug` to run tests without logging
