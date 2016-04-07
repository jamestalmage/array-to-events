import test from 'ava';
import fn from './';
import {EventEmitter} from 'events';
import eventsToArray from 'events-to-array';

test.beforeEach(t => {
	t.context = new EventEmitter();
	t.context.events = eventsToArray(t.context);
});

test('sync', t => {
	fn(t.context, [
		['foo', 1, 2, 3],
		['bar', 4, 5, 6]
	]);

	t.deepEqual(t.context.events, [
		['foo', 1, 2, 3],
		['bar', 4, 5, 6]
	]);
});

test.cb('immediate', t => {
	t.plan(1);
	fn(t.context, [['foo', 1, 2]], {delay: 'immediate'});
	setTimeout(() => {
		t.deepEqual(t.context.events, [['foo', 1, 2]]);
		t.end();
	}, 0);
});

test.cb('timeout', t => {
	t.plan(3);
	fn(t.context, [['foo', 1, 2], ['bar', 4, 5]], {delay: 50});
	setTimeout(() => t.deepEqual(t.context.events, []), 0);
	setTimeout(() => t.deepEqual(t.context.events, [['foo', 1, 2]]), 55);
	setTimeout(() => {
		t.deepEqual(t.context.events, [['foo', 1, 2], ['bar', 4, 5]]);
		t.end();
	}, 120);
});

test('done method - sync', t => {
	t.plan(3);
	let called = false;
	fn(t.context, [['foo'], ['bar']], {
		sync: true,
		done: (err, finished) => {
			t.ifError(err);
			t.true(finished);
			called = true;
		}
	});
	t.true(called);
});

test.cb('done method - async (method instead of opts)', t => {
	t.plan(3);
	let called = false;
	fn(t.context, [['foo'], ['bar']], (err, finished) => {
		t.ifError(err);
		t.true(finished);
		called = true;
		t.end();
	});
	t.false(called);
});

test.cb('done method - async (only done property specified)', t => {
	t.plan(3);
	let called = false;
	fn(t.context, [['foo'], ['bar']], {
		done: (err, finished) => {
			t.ifError(err);
			t.true(finished);
			called = true;
			t.end();
		}
	});
	t.false(called);
});

test.cb('done method - async (sync: false)', t => {
	t.plan(3);
	let called = false;
	fn(t.context, [['foo'], ['bar']], {
		sync: false,
		done: (err, finished) => {
			t.ifError(err);
			t.true(finished);
			called = true;
			t.end();
		}
	});
	t.false(called);
});

test.cb('stop method', t => {
	let stop = fn(t.context, [['foo'], ['bar']], (err, finished) => {
		t.ifError(err);
		t.false(finished);
		t.deepEqual(t.context.events, [['foo']]);
		t.end();
	});
	t.context.on('foo', stop);
});

test.cb('multiple calls to stop method', t => {
	let ct = 0;
	let stop = fn(t.context, [['foo'], ['bar']], () => ct++);
	stop();
	stop();
	stop();
	setTimeout(() => {
		t.is(ct, 1);
		t.end();
	}, 30);
});

test('throws if delay is not a number', t => {
	t.throws(() => {
		fn(t.context, [['foo']], {
			delay: 'hello'
		});
	});
});
