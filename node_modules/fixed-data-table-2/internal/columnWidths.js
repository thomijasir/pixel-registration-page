'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Copyright Schrodinger, LLC
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * LICENSE file in the root directory of this source tree. An additional grant
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * of patent rights can be found in the PATENTS file in the same directory.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @providesModule columnWidths
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */


var _widthHelper = require('./widthHelper');

var _Scrollbar = require('./Scrollbar');

var _Scrollbar2 = _interopRequireDefault(_Scrollbar);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _partition3 = require('lodash/partition');

var _partition4 = _interopRequireDefault(_partition3);

var _scrollbarsVisible = require('./scrollbarsVisible');

var _scrollbarsVisible2 = _interopRequireDefault(_scrollbarsVisible);

var _shallowEqualSelector = require('./shallowEqualSelector');

var _shallowEqualSelector2 = _interopRequireDefault(_shallowEqualSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {{
 *   fixed: boolean,
 *   flexGrow: number,
 *   width: number,
 * }}
 */
var columnDefinition = void 0;

/**
 * @param {!Array.<columnDefinition>} columnGroupProps
 * @param {!Array.<columnDefinition>} columnProps
 * @param {boolean} scrollEnabledY
 * @param {number} width
 * @return {{
 *   columnGroupProps: !Array.<columnDefinition>,
 *   columnProps: !Array.<columnDefinition>,
 *   availableScrollWidth: number,
 *   fixedColumns: !Array.<columnDefinition>,
 *   scrollableColumns: !Array.<columnDefinition>,
 *   maxScrollX: number,
 * }} The total width of all columns.
 */
function columnWidths(columnGroupProps, columnProps, scrollEnabledY, width) {
  var scrollbarSpace = scrollEnabledY ? _Scrollbar2.default.SIZE + _Scrollbar2.default.OFFSET : 0;
  var viewportWidth = width - scrollbarSpace;

  var _flexWidths = flexWidths(columnGroupProps, columnProps, viewportWidth),
      newColumnGroupProps = _flexWidths.newColumnGroupProps,
      newColumnProps = _flexWidths.newColumnProps;

  var _partition = (0, _partition4.default)(newColumnProps, function (column) {
    return column.fixed;
  }),
      _partition2 = _slicedToArray(_partition, 2),
      fixedColumns = _partition2[0],
      scrollableColumns = _partition2[1];

  var availableScrollWidth = viewportWidth - (0, _widthHelper.getTotalWidth)(fixedColumns);
  var maxScrollX = Math.max(0, (0, _widthHelper.getTotalWidth)(newColumnProps) - viewportWidth);
  return {
    columnGroupProps: newColumnGroupProps,
    columnProps: newColumnProps,
    availableScrollWidth: availableScrollWidth,
    fixedColumns: fixedColumns,
    scrollableColumns: scrollableColumns,
    maxScrollX: maxScrollX
  };
}

/**
 * @param {!Array.<columnDefinition>} columnGroupProps
 * @param {!Array.<columnDefinition>} columnProps
 * @param {number} viewportWidth
 * @return {{
 *   newColumnGroupProps: !Array.<columnDefinition>,
 *   newColumnProps: !Array.<columnDefinition>
 * }}
 */
function flexWidths(columnGroupProps, columnProps, viewportWidth) {
  var remainingFlexGrow = (0, _widthHelper.getTotalFlexGrow)(columnProps);
  if (remainingFlexGrow === 0) {
    return {
      newColumnGroupProps: columnGroupProps,
      newColumnProps: columnProps
    };
  }

  var columnsWidth = (0, _widthHelper.getTotalWidth)(columnProps);
  var remainingFlexWidth = Math.max(viewportWidth - columnsWidth, 0);

  var newColumnProps = (0, _map2.default)(columnProps, function (column) {
    var flexGrow = column.flexGrow;

    if (!flexGrow) {
      return column;
    }

    var flexWidth = Math.floor(flexGrow * remainingFlexWidth / remainingFlexGrow);
    var newWidth = column.width + flexWidth;
    remainingFlexGrow -= flexGrow;
    remainingFlexWidth -= flexWidth;

    return _extends({}, column, { width: newWidth });
  });

  var columnGroupWidths = (0, _map2.default)(columnGroupProps, function () {
    return 0;
  });
  (0, _forEach2.default)(newColumnProps, function (column) {
    if (column.groupIdx !== undefined) {
      columnGroupWidths[column.groupIdx] += column.width;
    }
  });

  var newColumnGroupProps = (0, _map2.default)(columnGroupProps, function (columnGroup, idx) {
    if (columnGroupWidths[idx] === columnGroup.width) {
      return columnGroup;
    }
    return _extends({}, columnGroup, { width: columnGroupWidths[idx] });
  });

  return {
    newColumnGroupProps: newColumnGroupProps,
    newColumnProps: newColumnProps
  };
}

exports.default = (0, _shallowEqualSelector2.default)([function (state) {
  return state.columnGroupProps;
}, function (state) {
  return state.columnProps;
}, function (state) {
  return (0, _scrollbarsVisible2.default)(state).scrollEnabledY;
}, function (state) {
  return state.tableSize.width;
}], columnWidths);