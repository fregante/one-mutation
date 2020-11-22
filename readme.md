# one-mutation [![][badge-gzip]][link-bundlephobia]

[badge-gzip]: https://img.shields.io/bundlephobia/minzip/one-mutation.svg?label=gzipped
[link-bundlephobia]: https://bundlephobia.com/result?p=one-mutation

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
oneMutation(document.body, '.btn', 'click', event => {
	console.log(event.oneMutationTarget);
});
```

## Related

- [one-event](https://github.com/fregante/one-event) - Micro module to add an event listener to be executed only once.
- [select-dom](https://github.com/fregante/select-dom) - Lightweight `querySelector`/`All` wrapper that outputs an Array.
- [doma](https://github.com/fregante/doma) - Parse an HTML string into `DocumentFragment` or one `Element`, in a few bytes.
- [Refined GitHub](https://github.com/sindresorhus/refined-github) - Uses this module.
