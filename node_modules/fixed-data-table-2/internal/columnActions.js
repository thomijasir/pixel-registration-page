/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * @providesModule columnActions
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resizeColumn = exports.moveColumnReorder = exports.stopColumnReorder = exports.startColumnReorder = undefined;

var _ActionTypes = require('././ActionTypes');

/**
 * Initiates column reordering
 *
 * @param {{scrollStart: number, columnKey: string, with: number, left: number}} reorderData
 */
var startColumnReorder = exports.startColumnReorder = function startColumnReorder(reorderData) {
  return {
    type: _ActionTypes.COLUMN_REORDER_START,
    reorderData: reorderData
  };
};

/**
 * Stops column reordering
 */
var stopColumnReorder = exports.stopColumnReorder = function stopColumnReorder() {
  return {
    type: _ActionTypes.COLUMN_REORDER_END
  };
};

/**
 * Stops column reordering
 *
 * @param {number} deltaX
 */
var moveColumnReorder = exports.moveColumnReorder = function moveColumnReorder(deltaX) {
  return {
    type: _ActionTypes.COLUMN_REORDER_MOVE,
    deltaX: deltaX
  };
};

/**
 * Fires a resize on column
 *
 * @param {!Object} reorderData
 */
var resizeColumn = exports.resizeColumn = function resizeColumn(resizeData) {
  return {
    type: _ActionTypes.COLUMN_RESIZE,
    resizeData: resizeData
  };
};