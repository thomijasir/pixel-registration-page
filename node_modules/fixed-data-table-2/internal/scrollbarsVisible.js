'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _roughHeights = require('./roughHeights');

var _roughHeights2 = _interopRequireDefault(_roughHeights);

var _shallowEqualSelector = require('./shallowEqualSelector');

var _shallowEqualSelector2 = _interopRequireDefault(_shallowEqualSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * State regarding which scrollbars will be shown.
 * Also includes the actual availableHeight which depends on the scrollbars.
 *
 * @param {{
 *   minAvailableHeight: number,
 *   maxAvailableHeight: number,
 *   scrollStateX: ScrollbarState,
 * }} roughHeights
 * @param {number} scrollContentHeight,
 * @param {{
 *   overflowY: string,
 *   showScrollbarY: boolean,
 * }} scrollFlags
 * @return {{
 *   availableHeight: number,
 *   scrollEnabledX: boolean,
 *   scrollEnabledY: boolean,
 * }}
 */
/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule scrollbarsVisible
 */
function scrollbarsVisible(roughHeights, scrollContentHeight, scrollFlags) {
  var overflowY = scrollFlags.overflowY,
      showScrollbarY = scrollFlags.showScrollbarY;

  var allowScrollbarY = overflowY !== 'hidden' && showScrollbarY !== false;

  var minAvailableHeight = roughHeights.minAvailableHeight,
      maxAvailableHeight = roughHeights.maxAvailableHeight,
      scrollStateX = roughHeights.scrollStateX;

  var scrollEnabledY = false;
  var scrollEnabledX = false;
  if (scrollStateX === _roughHeights.ScrollbarState.VISIBLE) {
    scrollEnabledX = true;
  }
  if (allowScrollbarY && scrollContentHeight > maxAvailableHeight) {
    scrollEnabledY = true;
  }

  // Handle case where vertical scrollbar makes horizontal scrollbar necessary
  if (scrollEnabledY && scrollStateX === _roughHeights.ScrollbarState.JOINT_SCROLLBARS) {
    scrollEnabledX = true;
  }

  var availableHeight = maxAvailableHeight;
  if (scrollEnabledX) {
    availableHeight = minAvailableHeight;
  }

  return {
    availableHeight: availableHeight,
    scrollEnabledX: scrollEnabledX,
    scrollEnabledY: scrollEnabledY
  };
}

exports.default = (0, _shallowEqualSelector2.default)([_roughHeights2.default, function (state) {
  return state.scrollContentHeight;
}, function (state) {
  return state.scrollFlags;
}], scrollbarsVisible);