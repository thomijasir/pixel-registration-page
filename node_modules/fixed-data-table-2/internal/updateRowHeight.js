/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule updateRowHeight
 */

'use strict';

/**
 * Update our cached row height for a specific index
 * based on the value from rowHeightGetter
 *
 * NOTE (jordan) This alters state so it shouldn't be called
 * without state having been cloned first.
 *
 * @param {!Object} state
 * @param {number} rowIdx
 * @return {number} The new row height
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = updateRowHeight;
function updateRowHeight(state, rowIdx) {
  var storedHeights = state.storedHeights,
      rowOffsets = state.rowOffsets,
      rowSettings = state.rowSettings;
  var rowHeightGetter = rowSettings.rowHeightGetter,
      subRowHeightGetter = rowSettings.subRowHeightGetter;


  var newHeight = rowHeightGetter(rowIdx) + subRowHeightGetter(rowIdx);
  var oldHeight = storedHeights[rowIdx];
  if (newHeight !== oldHeight) {
    rowOffsets.set(rowIdx, newHeight);
    storedHeights[rowIdx] = newHeight;
    state.scrollContentHeight += newHeight - oldHeight;
  }

  return storedHeights[rowIdx];
}