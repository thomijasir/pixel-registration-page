/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule columnStateHelper
 */

'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _emptyFunction = require('./emptyFunction');

var _emptyFunction2 = _interopRequireDefault(_emptyFunction);

var _isNil = require('lodash/isNil');

var _isNil2 = _interopRequireDefault(_isNil);

var _columnWidths5 = require('./columnWidths');

var _columnWidths6 = _interopRequireDefault(_columnWidths5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DRAG_SCROLL_SPEED = 15;
var DRAG_SCROLL_BUFFER = 100;

/**
 * Initialize scrollX state
 * TODO (jordan) Audit this method for cases where deep values are not properly cloned
 *
 * @param {!Object} state
 * @param {!Object} props
 * @param {Object} oldProps
 * @return {!Object}
 */
function initialize(state, props, oldProps) {
  var scrollLeft = props.scrollLeft,
      scrollToColumn = props.scrollToColumn;
  var columnResizingData = state.columnResizingData,
      isColumnResizing = state.isColumnResizing,
      scrollX = state.scrollX;


  if (scrollLeft !== undefined && (!oldProps || scrollLeft !== oldProps.scrollLeft)) {
    scrollX = scrollLeft;
  }

  scrollX = scrollTo(state, props, oldProps.scrollToColumn, scrollX);

  var _columnWidths = (0, _columnWidths6.default)(state),
      maxScrollX = _columnWidths.maxScrollX;

  scrollX = Math.min(scrollX, maxScrollX);

  // isColumnResizing should be overwritten by value from props if available
  isColumnResizing = props.isColumnResizing !== undefined ? props.isColumnResizing : isColumnResizing;
  columnResizingData = isColumnResizing ? columnResizingData : {};

  return _extends({}, state, {
    columnResizingData: columnResizingData,
    isColumnResizing: isColumnResizing,
    maxScrollX: maxScrollX,
    scrollX: scrollX
  });
};

/**
 * @param {!Object} state
 * @param {{
 *   scrollToColumn: number,
 *   width: number,
 * }} props
 * @param {number} oldScrollToColumn
 * @param {number} scrollX
 * @return {number} The new scrollX
 */
function scrollTo(state, props, oldScrollToColumn, scrollX) {
  var scrollToColumn = props.scrollToColumn;

  var _columnWidths2 = (0, _columnWidths6.default)(state),
      availableScrollWidth = _columnWidths2.availableScrollWidth,
      fixedColumns = _columnWidths2.fixedColumns,
      scrollableColumns = _columnWidths2.scrollableColumns;

  var fixedColumnsCount = fixedColumns.length;

  var scrollToUnchanged = scrollToColumn === oldScrollToColumn;
  var selectedColumnFixed = scrollToColumn < fixedColumnsCount;
  if ((0, _isNil2.default)(scrollToColumn) || scrollToUnchanged || selectedColumnFixed) {
    return scrollX;
  }

  // Convert column index (0 indexed) to scrollable index (0 indexed)
  // and clamp to max scrollable index
  var clampedColumnIndex = Math.min(scrollToColumn - fixedColumnsCount, scrollableColumns.length - 1);

  // Compute the width of all columns to the left of the column
  var previousWidth = 0;
  for (var columnIdx = 0; columnIdx < clampedColumnIndex; ++columnIdx) {
    previousWidth += scrollableColumns[columnIdx].width;
  }

  // Get width of specified column
  var selectedColumnWidth = scrollableColumns[clampedColumnIndex].width;

  // Compute the scroll position which sets the column on the right of the viewport
  // Must scroll at least far enough for end of column (previousWidth + selectedColumnWidth)
  // to be in viewport.
  var minScrollPosition = previousWidth + selectedColumnWidth - availableScrollWidth;

  // Handle offscreen to the left
  // If scrolled less than minimum amount, scroll to minimum amount
  // so column on right of viewport
  if (scrollX < minScrollPosition) {
    return minScrollPosition;
  }

  // Handle offscreen to the right
  // If scrolled more than previous columns, at least part of column will be offscreen to left
  // Scroll so column is flush with left edge of viewport
  if (scrollX > previousWidth) {
    return previousWidth;
  }

  return scrollX;
}

/**
 * This is called when a cell that is in the header of a column has its
 * resizer knob clicked on. It displays the resizer and puts in the correct
 * location on the table.
 */
function resizeColumn(state, resizeData) {
  var cellMinWidth = resizeData.cellMinWidth,
      cellMaxWidth = resizeData.cellMaxWidth,
      cellWidth = resizeData.cellWidth,
      columnKey = resizeData.columnKey,
      combinedWidth = resizeData.combinedWidth,
      clientX = resizeData.clientX,
      clientY = resizeData.clientY,
      leftOffset = resizeData.leftOffset;

  return _extends({}, state, {
    isColumnResizing: true,
    columnResizingData: {
      left: leftOffset + combinedWidth - cellWidth,
      width: cellWidth,
      minWidth: cellMinWidth,
      maxWidth: cellMaxWidth,
      initialEvent: {
        clientX: clientX,
        clientY: clientY,
        preventDefault: _emptyFunction2.default
      },
      key: columnKey
    }
  });
};

function reorderColumn(state, reorderData) {
  var columnKey = reorderData.columnKey,
      left = reorderData.left,
      scrollStart = reorderData.scrollStart,
      width = reorderData.width;

  var _columnWidths3 = (0, _columnWidths6.default)(state),
      fixedColumns = _columnWidths3.fixedColumns;

  var isFixed = fixedColumns.some(function (column) {
    return column.columnKey === columnKey;
  });

  return _extends({}, state, {
    isColumnReordering: true,
    columnReorderingData: {
      cancelReorder: false,
      dragDistance: 0,
      isFixed: isFixed,
      scrollStart: scrollStart,
      columnKey: columnKey,
      columnWidth: width,
      originalLeft: left,
      columnBefore: undefined,
      columnAfter: undefined
    }
  });
};

function reorderColumnMove(state, deltaX) {
  var _state$columnReorderi = state.columnReorderingData,
      isFixed = _state$columnReorderi.isFixed,
      originalLeft = _state$columnReorderi.originalLeft,
      scrollStart = _state$columnReorderi.scrollStart;
  var maxScrollX = state.maxScrollX,
      scrollX = state.scrollX;

  if (!isFixed) {
    // Relative dragX position on scroll
    var dragX = originalLeft - scrollStart + deltaX;

    var _columnWidths4 = (0, _columnWidths6.default)(state),
        availableScrollWidth = _columnWidths4.availableScrollWidth;

    deltaX += scrollX - scrollStart;

    // Scroll the table left or right if we drag near the edges of the table
    if (dragX > availableScrollWidth - DRAG_SCROLL_BUFFER) {
      scrollX = Math.min(scrollX + DRAG_SCROLL_SPEED, maxScrollX);
    } else if (dragX <= DRAG_SCROLL_BUFFER) {
      scrollX = Math.max(scrollX - DRAG_SCROLL_SPEED, 0);
    }
  }

  // NOTE (jordan) Need to clone this object when use pureRendering
  var reorderingData = _extends({}, state.columnReorderingData, {
    dragDistance: deltaX,
    columnBefore: undefined,
    columnAfter: undefined
  });

  return _extends({}, state, {
    scrollX: scrollX,
    columnReorderingData: reorderingData
  });
};

module.exports = {
  initialize: initialize,
  reorderColumn: reorderColumn,
  reorderColumnMove: reorderColumnMove,
  resizeColumn: resizeColumn
};