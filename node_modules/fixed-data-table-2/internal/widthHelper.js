/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule widthHelper
 * @typechecks
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sumPropWidths = sumPropWidths;
exports.getTotalWidth = getTotalWidth;
exports.getTotalFlexGrow = getTotalFlexGrow;

var _reduce = require('lodash/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sumPropWidths(columns) {
  return (0, _reduce2.default)(columns, function (accum, column) {
    return accum + column.props.width;
  }, 0);
}

function getTotalWidth(columns) {
  return (0, _reduce2.default)(columns, function (accum, column) {
    return accum + column.width;
  }, 0);
}

function getTotalFlexGrow(columns) {
  return (0, _reduce2.default)(columns, function (accum, column) {
    return accum + (column.flexGrow || 0);
  }, 0);
}