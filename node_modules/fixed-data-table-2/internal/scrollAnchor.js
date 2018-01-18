/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule scrollAnchor
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getScrollAnchor = getScrollAnchor;
exports.scrollTo = scrollTo;

var _clamp = require('./clamp');

var _clamp2 = _interopRequireDefault(_clamp);

var _updateRowHeight = require('./updateRowHeight');

var _updateRowHeight2 = _interopRequireDefault(_updateRowHeight);

var _scrollbarsVisible = require('./scrollbarsVisible');

var _scrollbarsVisible2 = _interopRequireDefault(_scrollbarsVisible);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get the anchor for scrolling.
 * This will either be the first row's index and an offset, or the last row's index.
 * We also pass a flag indicating if the anchor has changed from the state
 *
 * @param {!Object} state
 * @param {!Object} newProps
 * @param {!Object} oldProps
 * @return {{
 *   firstIndex: number,
 *   firstOffset: number,
 *   lastIndex: number,
 *   changed: boolean,
 * }}
 */
function getScrollAnchor(state, newProps, oldProps) {
  if (newProps.scrollToRow !== undefined && newProps.scrollToRow !== null && (!oldProps || newProps.scrollToRow !== oldProps.scrollToRow)) {
    return scrollToRow(state, newProps.scrollToRow);
  }

  if (newProps.scrollTop !== undefined && newProps.scrollTop !== null && (!oldProps || newProps.scrollTop !== oldProps.scrollTop)) {
    return scrollTo(state, newProps.scrollTop);
  }

  return {
    firstIndex: state.firstRowIndex,
    firstOffset: state.firstRowOffset,
    lastIndex: undefined,
    changed: false
  };
}

/**
 * Scroll to a specific position in the grid
 *
 * @param {!Object} state
 * @param {number} scrollY
 * @return {{
 *   firstIndex: number,
 *   firstOffset: number,
 *   lastIndex: number,
 *   changed: boolean,
 * }}
 */
function scrollTo(state, scrollY) {
  var _scrollbarsVisibleSel = (0, _scrollbarsVisible2.default)(state),
      availableHeight = _scrollbarsVisibleSel.availableHeight;

  var rowOffsets = state.rowOffsets,
      rowSettings = state.rowSettings,
      scrollContentHeight = state.scrollContentHeight;
  var rowsCount = rowSettings.rowsCount;


  if (rowsCount === 0) {
    return {
      firstIndex: 0,
      firstOffset: 0,
      lastIndex: undefined,
      changed: state.firstRowIndex !== 0 || state.firstRowOffset !== 0
    };
  }

  var firstIndex = 0;
  var firstOffset = 0;
  var lastIndex = undefined;
  if (scrollY <= 0) {
    // Use defaults (from above) to scroll to first row
  } else if (scrollY >= scrollContentHeight - availableHeight) {
    // Scroll to the last row
    firstIndex = undefined;
    lastIndex = rowsCount - 1;
  } else {
    // Mark the row which will appear first in the viewport
    // We use this as our "marker" when scrolling even if updating rowHeights
    // leads to it not being different from the scrollY specified
    var newRowIdx = rowOffsets.greatestLowerBound(scrollY);
    firstIndex = (0, _clamp2.default)(newRowIdx, 0, Math.max(rowsCount - 1, 0));

    // Record how far into the first row we should scroll
    // firstOffset is a negative value representing how much larger scrollY is
    // than the scroll position of the first row in the viewport
    var firstRowPosition = rowOffsets.sumUntil(firstIndex);
    firstOffset = firstRowPosition - scrollY;
  }

  return {
    firstIndex: firstIndex,
    firstOffset: firstOffset,
    lastIndex: lastIndex,
    // NOTE (jordan) This changed heuristic may give false positives,
    // but that's fine since it's used as a filter to computeRenderedRows
    changed: true
  };
}

/**
 * Scroll a specified row into the viewport
 * If the row is before the viewport, it will become the first row in the viewport
 * If the row is after the viewport, it will become the last row in the viewport
 * If the row is in the viewport, do nothing
 *
 * @param {!Object} state
 * @param {number} rowIndex
 * @return {{
 *   firstIndex: number,
 *   firstOffset: number,
 *   lastIndex: number,
 *   changed: boolean,
 * }}
 * @private
 */
function scrollToRow(state, rowIndex) {
  var _scrollbarsVisibleSel2 = (0, _scrollbarsVisible2.default)(state),
      availableHeight = _scrollbarsVisibleSel2.availableHeight;

  var rowOffsets = state.rowOffsets,
      rowSettings = state.rowSettings,
      storedHeights = state.storedHeights,
      scrollY = state.scrollY;
  var rowsCount = rowSettings.rowsCount;


  if (rowsCount === 0) {
    return {
      firstIndex: 0,
      firstOffset: 0,
      lastIndex: undefined,
      changed: state.firstRowIndex !== 0 || state.firstRowOffset !== 0
    };
  }

  rowIndex = (0, _clamp2.default)(rowIndex, 0, Math.max(rowsCount - 1, 0));
  (0, _updateRowHeight2.default)(state, rowIndex);
  var rowBegin = rowOffsets.sumUntil(rowIndex);
  var rowEnd = rowBegin + storedHeights[rowIndex];

  var firstIndex = rowIndex;
  var lastIndex = undefined;
  if (rowBegin < scrollY) {
    // If before the viewport, set as the first row in the viewport
    // Uses defaults (from above)
  } else if (scrollY + availableHeight < rowEnd) {
    // If after the viewport, set as the last row in the viewport
    firstIndex = undefined;
    lastIndex = rowIndex;
  } else {
    // If already in the viewport, do nothing.
    return {
      firstIndex: state.firstRowIndex,
      firstOffset: state.firstRowOffset,
      lastIndex: undefined,
      changed: false
    };
  }

  return {
    firstIndex: firstIndex,
    firstOffset: 0,
    lastIndex: lastIndex,
    changed: true
  };
}