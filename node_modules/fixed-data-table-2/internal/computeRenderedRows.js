/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule computeRenderedRows
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = computeRenderedRows;

var _updateRowHeight = require('./updateRowHeight');

var _updateRowHeight2 = _interopRequireDefault(_updateRowHeight);

var _roughHeights = require('./roughHeights');

var _roughHeights2 = _interopRequireDefault(_roughHeights);

var _scrollbarsVisible = require('./scrollbarsVisible');

var _scrollbarsVisible2 = _interopRequireDefault(_scrollbarsVisible);

var _tableHeights = require('./tableHeights');

var _tableHeights2 = _interopRequireDefault(_tableHeights);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns data about the rows to render
 * rows is a map of rowIndexes to render to their heights
 * firstRowIndex & firstRowOffset are calculated based on the lastIndex if
 * specified in scrollAnchor.
 * Otherwise, they are unchanged from the firstIndex & firstOffset scrollAnchor values.
 *
 * @param {!Object} state
 * @param {{
 *   firstIndex: number,
 *   firstOffset: number,
 *   lastIndex: number,
 * }} scrollAnchor
 * @return {!Object} The updated state object
 */
function computeRenderedRows(state, scrollAnchor) {
  var newState = _extends({}, state);
  var rowRange = calculateRenderedRowRange(newState, scrollAnchor);

  var rowSettings = newState.rowSettings,
      scrollContentHeight = newState.scrollContentHeight;
  var rowsCount = rowSettings.rowsCount;

  var _tableHeightsSelector = (0, _tableHeights2.default)(newState),
      bodyHeight = _tableHeightsSelector.bodyHeight;

  var maxScrollY = scrollContentHeight - bodyHeight;

  // NOTE (jordan) This handles #115 where resizing the viewport may
  // leave only a subset of rows shown, but no scrollbar to scroll up to the first rows.
  if (maxScrollY === 0) {
    if (rowRange.firstViewportIdx > 0) {
      rowRange = calculateRenderedRowRange(newState, {
        firstOffset: 0,
        lastIndex: rowsCount - 1
      });
    }

    newState.firstRowOffset = 0;
  }

  computeRenderedRowOffsets(newState, rowRange);
  var scrollY = 0;
  if (rowsCount > 0) {
    scrollY = newState.rowHeights[rowRange.firstViewportIdx] - newState.firstRowOffset;
  }
  scrollY = Math.min(scrollY, maxScrollY);

  return _extends(newState, {
    maxScrollY: maxScrollY,
    scrollY: scrollY
  });
}

/**
 * Determine the range of rows to render (buffer and viewport)
 * The leading and trailing buffer is based on a fixed count,
 * while the viewport rows are based on their height and the viewport height
 * We use the scrollAnchor to determine what either the first or last row
 * will be, as well as the offset.
 *
 * NOTE (jordan) This alters state so it shouldn't be called
 * without state having been cloned first.
 *
 * @param {!Object} state
 * @param {{
 *   firstIndex: number,
 *   firstOffset: number,
 *   lastIndex: number,
 * }} scrollAnchor
 * @return {{
 *   endBufferIdx: number,
 *   endViewportIdx: number,
 *   firstBufferIdx: number,
 *   firstViewportIdx: number,
 * }}
 * @private
 */
function calculateRenderedRowRange(state, scrollAnchor) {
  var _roughHeightsSelector = (0, _roughHeights2.default)(state),
      bufferRowCount = _roughHeightsSelector.bufferRowCount,
      maxAvailableHeight = _roughHeightsSelector.maxAvailableHeight;

  var rowsCount = state.rowSettings.rowsCount;

  if (rowsCount === 0) {
    return {
      endBufferIdx: 0,
      endViewportIdx: 0,
      firstBufferIdx: 0,
      firstViewportIdx: 0
    };
  }

  // If our first or last index is greater than our rowsCount,
  // treat it as if the last row is at the bottom of the viewport
  var firstIndex = scrollAnchor.firstIndex,
      firstOffset = scrollAnchor.firstOffset,
      lastIndex = scrollAnchor.lastIndex;

  if (firstIndex >= rowsCount || lastIndex >= rowsCount) {
    lastIndex = rowsCount - 1;
  }

  // Walk the viewport until filled with rows
  // If lastIndex is set, walk backward so that row is the last in the viewport
  var step = 1;
  var startIdx = firstIndex;
  var totalHeight = firstOffset;
  if (lastIndex !== undefined) {
    step = -1;
    startIdx = lastIndex;
    totalHeight = 0;
  }

  // Loop to walk the viewport until we've touched enough rows to fill its height
  var rowIdx = startIdx;
  var endIdx = rowIdx;
  while (rowIdx < rowsCount && rowIdx >= 0 && totalHeight < maxAvailableHeight) {
    totalHeight += (0, _updateRowHeight2.default)(state, rowIdx);
    endIdx = rowIdx;
    rowIdx += step;
  }

  // Loop to walk the leading buffer
  var firstViewportIdx = Math.min(startIdx, endIdx);
  var firstBufferIdx = Math.max(firstViewportIdx - bufferRowCount, 0);
  for (rowIdx = firstBufferIdx; rowIdx < firstViewportIdx; rowIdx++) {
    (0, _updateRowHeight2.default)(state, rowIdx);
  }

  // Loop to walk the trailing buffer
  var endViewportIdx = Math.max(startIdx, endIdx) + 1;
  var endBufferIdx = Math.min(endViewportIdx + bufferRowCount, rowsCount);
  for (rowIdx = endViewportIdx; rowIdx < endBufferIdx; rowIdx++) {
    (0, _updateRowHeight2.default)(state, rowIdx);
  }

  var _scrollbarsVisibleSel = (0, _scrollbarsVisible2.default)(state),
      availableHeight = _scrollbarsVisibleSel.availableHeight;

  if (lastIndex !== undefined) {
    // Calculate offset needed to position last row at bottom of viewport
    // This should be negative and represent how far the first row needs to be offscreen
    firstOffset = Math.min(availableHeight - totalHeight, 0);

    // Handle a case where the offset puts the first row fully offscreen
    // This can happen if availableHeight & maxAvailableHeight are different
    var storedHeights = state.storedHeights;

    if (-1 * firstOffset >= storedHeights[firstViewportIdx]) {
      firstViewportIdx += 1;
      firstOffset += storedHeights[firstViewportIdx];
    }
  }

  state.firstRowIndex = firstViewportIdx;
  state.firstRowOffset = firstOffset;
  return {
    endBufferIdx: endBufferIdx,
    endViewportIdx: endViewportIdx,
    firstBufferIdx: firstBufferIdx,
    firstViewportIdx: firstViewportIdx
  };
}

/**
 * Walk the rows to render and compute the height offsets and
 * positions in the row buffer.
 *
 * NOTE (jordan) This alters state so it shouldn't be called
 * without state having been cloned first.
 *
 * @param {!Object} state
 * @param {{
 *   endBufferIdx: number,
 *   endViewportIdx: number,
 *   firstBufferIdx: number,
 *   firstViewportIdx: number,
 * }} rowRange
 * @private
 */
function computeRenderedRowOffsets(state, rowRange) {
  var bufferSet = state.bufferSet,
      rowOffsets = state.rowOffsets,
      storedHeights = state.storedHeights;
  var endBufferIdx = rowRange.endBufferIdx,
      endViewportIdx = rowRange.endViewportIdx,
      firstBufferIdx = rowRange.firstBufferIdx,
      firstViewportIdx = rowRange.firstViewportIdx;


  var renderedRowsCount = endBufferIdx - firstBufferIdx;
  if (renderedRowsCount === 0) {
    state.rowHeights = {};
    state.rows = [];
    return;
  }

  var bufferMapping = []; // state.rows
  var rowOffsetsCache = {}; // state.rowHeights
  var runningOffset = rowOffsets.sumUntil(firstBufferIdx);
  for (var rowIdx = firstBufferIdx; rowIdx < endBufferIdx; rowIdx++) {

    // Update the offset for rendering the row
    rowOffsetsCache[rowIdx] = runningOffset;
    runningOffset += storedHeights[rowIdx];

    // Check if row already has a position in the buffer
    var rowPosition = bufferSet.getValuePosition(rowIdx);

    // Request a position in the buffer through eviction of another row
    if (rowPosition === null && bufferSet.getSize() >= renderedRowsCount) {
      rowPosition = bufferSet.replaceFurthestValuePosition(firstViewportIdx, endViewportIdx - 1, rowIdx);
    }

    // If we can't reuse any existing position, create a new one
    if (rowPosition === null) {
      rowPosition = bufferSet.getNewPositionForValue(rowIdx);
    }

    bufferMapping[rowPosition] = rowIdx;
  }

  state.rowHeights = rowOffsetsCache;
  state.rows = bufferMapping;
}