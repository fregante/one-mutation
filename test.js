import {createRequire} from 'node:module';
import test from 'ava';
import oneMutation from './index.js';

const require = createRequire(import.meta.url);
const {JSDOM} = require('jsdom');
const delay = require('delay');

const jsdom = new JSDOM('');
global.MutationObserver = jsdom.window.MutationObserver;
global.document = jsdom.window.document;
global.Text = jsdom.window.Text;

function onlyTextNotesMutations(mutations) {
	for (const {addedNodes} of mutations) {
		for (const node of addedNodes) {
			if (node.nodeType === node.TEXT_NODE) {
				return true;
			}
		}
	}
}

test.beforeEach(t => {
	const {window} = new JSDOM('');
	t.context.body = window.document.body;
});

test('should observe one mutation', async t => {
	const observer = oneMutation(t.context.body, {
		childList: true,
	});
	t.context.body.append('Text');
	const records = await observer;
	t.is(records.length, 1);
	t.like(records[0], {
		target: t.context.body,
		type: 'childList',
		addedNodes: {
			0: new Text(),
		},
	});
});

test('should filter unwanted mutations', async t => {
	const observer = oneMutation(t.context.body, {
		filter: onlyTextNotesMutations,
		childList: true,
	});
	t.context.body.append(document.createElement('div'));
	await delay(10);
	t.context.body.append('Text');
	const records = await observer;
	t.is(records.length, 1);
	t.like(records[0], {
		target: t.context.body,
		type: 'childList',
		addedNodes: {
			0: new Text(),
		},
	});
});

test('should only listen to the specified mutations', async t => {
	const observer = oneMutation(t.context.body, {
		attributes: true,
	});
	t.context.body.append(document.createElement('div'));
	t.context.body.dataset.sawadee = 'ครับ';

	const emptyNodeListFixture = document
		.createElement('div')
		.querySelectorAll('a');
	const records = await observer;
	t.is(records.length, 1);
	t.like(records[0], {
		target: t.context.body,
		type: 'attributes',
		attributeName: 'data-sawadee',
		addedNodes: emptyNodeListFixture,
	});
});
