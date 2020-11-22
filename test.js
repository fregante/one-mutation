import test from 'ava';
import {createRequire} from 'module';
import oneMutation from './index.js';

const require = createRequire(import.meta.url);
export const {JSDOM} = require('jsdom');

const jsdom = new JSDOM('');
global.MutationObserver = jsdom.window.MutationObserver;
global.Text = jsdom.window.Text;

test.beforeEach(t => {
	const {window} = new JSDOM('');
	t.context.body = window.document.body;
});

test('should observe one change', async t => {
	const observer = oneMutation(t.context.body);
	t.context.body.append('Text');
	const records = await observer;
	t.is(records.length, 1);
	t.like(records[0], {
		target: t.context.body,
		type: 'childList',
		addedNodes: {
			0: new Text()
		}
	});
});
