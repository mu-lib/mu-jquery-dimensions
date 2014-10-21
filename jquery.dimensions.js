/**
 * @license MIT http://mu-lib.mit-license.org/
 */
define([ "jquery" ], function ($) {

	/**
	 * Dimensions event for DOM elements. Extends {@link jQuery} with:
	 *
	 * - {@link $#event-dimensions} event
	 *
	 * @class mu-lib.jquery.dimensions
	 * @static
	 * @alias plugin.jquery
	 */

	var NULL = null;
	var DIMENSIONS = "dimensions";
	var RESIZE = "resize." + DIMENSIONS;
	var W = "w";
	var H = "h";
	var _W = "_" + W;
	var _H = "_" + H;

	function reverse(a, b) {
		return b - a;
	}

	function onResize() {
		var self = this;
		var $self = $(self);
		var width = $self.width();
		var height = $self.height();

		// Iterate all dimensions
		$.each($.data(self, DIMENSIONS), function (namespace, dimension) {
			var w = dimension[W];
			var h = dimension[H];
			var _w;
			var _h;
			var i;

			i = w.length;
			_w = w[i - 1];
			while(w[--i] < width) {
				_w = w[i];
			}

			i = h.length;
			_h = h[i - 1];
			while(h[--i] < height) {
				_h = h[i];
			}

			// If _w or _h has changed, update and trigger
			if (_w !== dimension[_W] || _h !== dimension[_H]) {
				dimension[_W] = _w;
				dimension[_H] = _h;

				$self.trigger(DIMENSIONS + "." + namespace, [ _w, _h ]);
			}
		});
	}

	$.event.special[DIMENSIONS] = {
		setup : function () {
			$(this)
				.bind(RESIZE, onResize)
				.data(DIMENSIONS, {});
		},

		add : function (handleObj) {
			var self = this;
			var namespace = handleObj.namespace;
			var dimension = {};
			var w = dimension[W] = [];
			var h = dimension[H] = [];
			var re = /(w|h)(\d+)/g;
			var matches;

			while ((matches = re.exec(namespace)) !== NULL) {
				dimension[matches[1]].push(parseInt(matches[2], 10));
			}

			w.sort(reverse);
			h.sort(reverse);

			$.data(self, DIMENSIONS)[namespace] = dimension;
		},

		remove : function (handleObj) {
			delete $.data(this, DIMENSIONS)[handleObj.namespace];
		},

		teardown : function onDimensionsTeardown() {
			$(this)
				.removeData(DIMENSIONS)
				.unbind(RESIZE, onResize);
		}
	};
});