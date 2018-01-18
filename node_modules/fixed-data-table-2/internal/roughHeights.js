'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollbarState = undefined;

var _widthHelper = require('./widthHelper');

var _Scrollbar = require('./Scrollbar');

var _Scrollbar2 = _interopRequireDefault(_Scrollbar);

var _clamp = require('./clamp');

var _clamp2 = _interopRequireDefault(_clamp);

var _shallowEqualSelector = require('./shallowEqualSelector');

var _shallowEqualSelector2 = _interopRequireDefault(_shallowEqualSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule roughHeights
 */
var BORDER_HEIGHT = 1;
var MIN_BUFFER_ROWS = 3;
var MAX_BUFFER_ROWS = 6;

var ScrollbarState = exports.ScrollbarState = {
  HIDDEN: 'hidden',
  JOINT_SCROLLBARS: 'JOINT_SCROLLBARS',
  VISIBLE: 'visible'
};

/**
 * Calculate the available height for the viewport.
 * Since we aren't 100% sure of whether scrollbars are visible
 * at this point, we compute a max & min viewport height.
 *
 * maxAvailableHeight is the largest it could be, while
 * minAvailableHeight is the smallest.
 * We also compute how large it is based on
 * the current scrollContentHeight in scrollbarsVisible.
 *
 * bufferRowCount is the number of rows to buffer both ahead and behind the viewport.
 * In total we will buffer twice this number of rows (half ahead, and half behind).
 *
 * reservedHeight is the height reserved for headers and footers.
 *
 * scrollStateX is the state of the horizontal scrollbar.
 * HIDDEN & VISIBLE are self explanatory, but
 * JOINT_SCROLLBARS mean the horizontal scroll will be shown if and
 * only if the vertical scrollbar is shown.
 *
 * @param {!Array.<{
 *   width: number,
 * }>} columnProps
 * @param {{
 *   footerHeight: number,
 *   groupHeaderHeight: number,
 *   headerHeight: number,
 * }} elementHeights
 * @param {{
 *   bufferRowCount: ?number,
 *   rowHeight: number,
 *   subRowHeight: number,
 * }} rowSettings
 * @param {{
 *   overflowX: string,
 *   showScrollbarX: boolean,
 * }} scrollFlags
 * @param {{
 *   height: ?number,
 *   maxHeight: ?number,
 *   useMaxHeight: boolean,
 *   width: number,
 * }} tableSize
 * @return {{
 *   bufferRowsCount: number,
 *   minAvailableHeight: number,
 *   maxAvailableHeight: number,
 *   reservedHeight: number,
 *   scrollStateX: ScrollbarState,
 * }}
 */
function roughHeights(columnProps, elementHeights, rowSettings, scrollFlags, tableSize) {
  var footerHeight = elementHeights.footerHeight,
      headerHeight = elementHeights.headerHeight,
      groupHeaderHeight = elementHeights.groupHeaderHeight;

  var reservedHeight = footerHeight + headerHeight + groupHeaderHeight + 2 * BORDER_HEIGHT;

  var height = tableSize.height,
      maxHeight = tableSize.maxHeight,
      useMaxHeight = tableSize.useMaxHeight,
      width = tableSize.width;

  var maxComponentHeight = Math.round(useMaxHeight ? maxHeight : height);
  var roughAvailableHeight = maxComponentHeight - reservedHeight;

  var scrollStateX = getScrollStateX(columnProps, scrollFlags, width);

  /*
   * Early estimates of how much height we have to show rows.
   * We won't know which one is real until we know about horizontal scrollbar which
   * requires knowing about vertical scrollbar as well and that
   * requires scrollContentHeight which
   * requires us to have handled scrollTo / scrollToRow...
   */
  var minAvailableHeight = roughAvailableHeight;
  var maxAvailableHeight = roughAvailableHeight;
  switch (scrollStateX) {
    case ScrollbarState.VISIBLE:
      {
        minAvailableHeight -= _Scrollbar2.default.SIZE;
        maxAvailableHeight -= _Scrollbar2.default.SIZE;
        break;
      }
    case ScrollbarState.JOINT_SCROLLBARS:
      {
        minAvailableHeight -= _Scrollbar2.default.SIZE;
        break;
      }
  }

  return {
    bufferRowCount: getBufferRowCount(maxAvailableHeight, rowSettings),
    minAvailableHeight: Math.max(minAvailableHeight, 0),
    maxAvailableHeight: Math.max(maxAvailableHeight, 0),
    reservedHeight: reservedHeight,
    scrollStateX: scrollStateX
  };
}

/**
 * @param {!Array.<{
 *   width: number,
 * }>} columnProps
 * @param {{
 *   overflowX: string,
 *   showScrollbarX: boolean,
 * }}
 * @param {number} width
 * @return {ScrollbarState}
 */
function getScrollStateX(columnProps, scrollFlags, width) {
  var overflowX = scrollFlags.overflowX,
      showScrollbarX = scrollFlags.showScrollbarX;

  var minColWidth = (0, _widthHelper.getTotalWidth)(columnProps);
  if (overflowX === 'hidden' || showScrollbarX === false) {
    return ScrollbarState.HIDDEN;
  } else if (minColWidth > width) {
    return ScrollbarState.VISIBLE;
  }

  var scrollbarSpace = _Scrollbar2.default.SIZE + _Scrollbar2.default.OFFSET;
  if (minColWidth > width - scrollbarSpace) {
    return ScrollbarState.JOINT_SCROLLBARS;
  }
  return ScrollbarState.HIDDEN;
}

/**
 * @param {number} maxAvailableHeight
 * @param {{
 *   bufferRowCount: ?number,
 *   rowHeight: number,
 *   subRowHeight: number,
 * }} rowSettings
 * @return {number}
 */
function getBufferRowCount(maxAvailableHeight, rowSettings) {
  var bufferRowCount = rowSettings.bufferRowCount,
      rowHeight = rowSettings.rowHeight,
      subRowHeight = rowSettings.subRowHeight;

  if (bufferRowCount !== undefined) {
    console.log('buffer set: ' + bufferRowCount);
    return bufferRowCount;
  }

  var fullRowHeight = rowHeight + subRowHeight;
  var avgVisibleRowCount = Math.ceil(maxAvailableHeight / fullRowHeight) + 1;
  return (0, _clamp2.default)(Math.floor(avgVisibleRowCount / 2), MIN_BUFFER_ROWS, MAX_BUFFER_ROWS);
}

exports.default = (0, _shallowEqualSelector2.default)([function (state) {
  return state.columnProps;
}, function (state) {
  return state.elementHeights;
}, function (state) {
  return state.rowSettings;
}, function (state) {
  return state.scrollFlags;
}, function (state) {
  return state.tableSize;
}], roughHeights);