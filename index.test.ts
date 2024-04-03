import {setTimeout} from 'node:timers/promises';
import {assert, test} from 'vitest';
import {JSDOM} from 'jsdom';
import oneMutation from './index.js';

const jsdom = new JSDOM('');
globalThis.document = jsdom.window.document;
globalThis.Text = jsdom.window.Text;
globalThis.MutationObserver = jsdom.window.MutationObserver;

const t = {
	is: assert.equal,
	like: assert.containSubset,
	deepEqual: assert.deepEqual,
};

function onlyTextNotesMutations(mutations: MutationRecord[]) {
	for (const {addedNodes} of mutations) {
		for (const node of addedNodes) {
			if (node.nodeType === node.TEXT_NODE) {
				return true;
			}
		}
	}

	return false;
}

test('should observe one mutation', async () => {
	const observer = oneMutation(document.body, {
		childList: true,
	});
	document.body.append('Text');
	const records = await observer;
	t.is(records.length, 1);
	t.like(records[0], {
		target: document.body,
		type: 'childList',
		addedNodes: [
			new Text(),
		],
	});
});

test('should filter unwanted mutations', async () => {
	const observer = oneMutation(document.body, {
		filter: onlyTextNotesMutations,
		childList: true,
	});
	document.body.append(document.createElement('div'));
	await setTimeout(10);
	document.body.append('Text');
	const records = await observer;
	t.is(records.length, 1);
	t.like(records[0], {
		target: document.body,
		type: 'childList',
		addedNodes: [
			new Text(),
		],
	});
});

test('should only listen to the specified mutations', async () => {
	const observer = oneMutation(document.body, {
		attributes: true,
	});
	document.body.append(document.createElement('div'));
	document.body.dataset.sawadee = 'ครับ';

	const emptyNodeListFixture = document
		.createElement('div')
		.querySelectorAll('a');
	const records = await observer;
	t.is(records.length, 1);
	t.like(records[0], {
		target: document.body,
		type: 'attributes',
		attributeName: 'data-sawadee',
		addedNodes: emptyNodeListFixture,
	});
});
