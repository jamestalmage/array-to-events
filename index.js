'use strict';
module.exports = function (emitter, array, opts) {
	var index = 0;
	var running = true;
	var timer;

	opts = opts || {sync: true};

	if (typeof opts === 'function') {
		opts = {
			sync: false,
			delay: 'immediate',
			done: opts
		};
	}

	var sync = opts.sync;

	if (typeof sync !== 'boolean') {
		sync = !(opts.delay || opts.delay === 0 || opts.done);
	}

	function emit(args) {
		emitter.emit.apply(emitter, args);
	}

	function finish(err) {
		if (opts.done) {
			opts.done(err, index >= array.length);
		}
	}

	if (sync) {
		array.forEach(emit);
		index = array.length;
		finish();
		return null;
	}

	var immediate = (!opts.delay && opts.delay !== 0) || opts.delay === 'immediate';
	var delay = opts.delay;

	if (!immediate && typeof opts.delay !== 'number') {
		throw new TypeError('opts.delay must be a number');
	}

	function next() {
		emit(array[index]);
		index++;
		scheduleNext();
	}

	function scheduleNext() {
		if (index >= array.length) {
			stop();
		}
		if (!running) {
			return;
		}
		timer = schedule(next);
	}

	function schedule(next) {
		if (immediate) {
			return setImmediate(next);
		}
		return setTimeout(next, delay);
	}

	function stop() {
		if (!running) {
			return;
		}
		running = false;
		if (immediate) {
			clearImmediate(timer);
		} else {
			clearTimeout(timer);
		}
		schedule(finish);
	}

	scheduleNext();
	return stop;
};
