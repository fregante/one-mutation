# one-mutation [![][badge-gzip]][link-bundlephobia]

[badge-gzip]: https://img.shields.io/bundlephobia/minzip/one-mutation.svg?label=gzipped
[link-bundlephobia]: https://bundlephobia.com/result?p=one-mutation

> Observe one mutation via `MutationObserver`, then resolve a Promise.

## Install

```
npm install one-mutation
```

```js
// This module is only offered as a ES Module
import oneMutation from 'one-mutation';
```

## Usage

```js
oneMutation(document.body, {childList: true}).then(mutations => {
	// A text node was added!
});

document.body.append('Text');
```

```js
oneMutation(document.body, {
	childList: true,
	filter: mutations => mutations.find(mutation => {
		for (const node of mutation.addedNodes) {
			if (node.textContent === 'Just me!') {
				return true;
			}
		}
	})
}).then(mutations => {
	// The expected 'Just me!' node was added!
});

document.body.append('Text'); // Won't resolve the promise
document.body.append(document.createElement('div')); // Won't resolve the promise
document.body.append('Just me!'); // Now!
```

## API

### oneMutation(node, options)

Example:

Returns a `Promise` that is fulfilled when the expected mutation is found.

#### node

Type: `Node` <br>
Example: `document.body`, `document.querySelector('.article-list')`

The node/element to observe. The equivalent parameter of:

```JS
new MutationObserver(callback).observe(NODE, options)
```

#### options

Type: `object` <br>
Example: `{childList: true}`, `{subtree: true, filter: filterFunction}`

This matches [`MutationObserverInit`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit) and adds a `filter` method.

The equivalent parameter of:

```JS
new MutationObserver(callback).observe(node, OPTIONS)
```

##### subtree, childList, ...

Refer to the MDN [MutationObserver documentation](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit) to find the full list of properties.

##### filter

Type: boolean-returning `function` <br>
Example:

```js
function filterFunction(mutations) {
	for (const mutation of mutations) {
		for (const node of mutation.addedNodes) {
			if (node.textContent === 'Just me!') {
				return true;
			}
		}
	}
}
```

A function that will be called every time that `MutationObserver` detects a change, the equivalent parameter of:

```JS
new MutationObserver(FILTER)
```

**But** it should only be used to return `true` or `false` so that the Promise can be resolved.

## Related

- [one-event](https://github.com/fregante/one-event) - Micro module to add an event listener to be executed only once.
- [select-dom](https://github.com/fregante/select-dom) - Lightweight `querySelector`/`All` wrapper that outputs an Array.
- [doma](https://github.com/fregante/doma) - Parse an HTML string into `DocumentFragment` or one `Element`, in a few bytes.
- [Refined GitHub](https://github.com/sindresorhus/refined-github) - Uses this module.

## License

MIT © [Federico Brigante](https://fregante.com)
