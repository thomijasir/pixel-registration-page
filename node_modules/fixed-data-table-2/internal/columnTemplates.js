'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _columnWidths = require('./columnWidths');

var _columnWidths2 = _interopRequireDefault(_columnWidths);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _shallowEqualSelector = require('./shallowEqualSelector');

var _shallowEqualSelector2 = _interopRequireDefault(_shallowEqualSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {{
 *   props: !Object,
 *   template: ReactElement,
 * }}
 */
var cellDetails = void 0;

/**
 * @typedef {{
 *   cell: !Array.<cellDetails>,
 *   footer: !Array.<cellDetails>,
 *   header: !Array.<cellDetails>,
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
 * @providesModule columnTemplates
 */
var columnDetails = void 0;

/**
 * Lists of cell templates & component props for
 * the fixed and scrollable columns and column groups
 *
 * @param {{
 *   columnGroupProps: !Array.<!Object>,
 *   columnProps: !Array.<!Object>,
 *   }>,
 * }} columnWidths
 * @param {{
 *   cell: !Array.<ReactElement>,
 *   footer: !Array.<ReactElement>,
 *   groupHeader !Array.<ReactElement>,
 *   header !Array.<ReactElement>,
 * }} elementTemplates
 * @return {{
 *   fixedColumnGroups: !Array.<cellDetails>,
 *   scrollableColumnGroups: !Array.<cellDetails>,
 *   fixedColumns: !Array.<columnDetails>,
 *   scrollableColumns: !Array.<columnDetails>,
 * }}
 */
function columnTemplates(columnWidths, elementTemplates) {
  var columnGroupProps = columnWidths.columnGroupProps,
      columnProps = columnWidths.columnProps;

  // Ugly transforms to extract data into a row consumable format.
  // TODO (jordan) figure out if this can efficiently be merged with
  // the result of convertColumnElementsToData.

  var fixedColumnGroups = [];
  var scrollableColumnGroups = [];
  (0, _forEach2.default)(columnGroupProps, function (columnGroup, index) {
    var groupData = {
      props: columnGroup,
      template: elementTemplates.groupHeader[index]
    };
    if (columnGroup.fixed) {
      fixedColumnGroups.push(groupData);
    } else {
      scrollableColumnGroups.push(groupData);
    }
  });

  var fixedColumns = {
    cell: [],
    header: [],
    footer: []
  };
  var scrollableColumns = {
    cell: [],
    header: [],
    footer: []
  };
  (0, _forEach2.default)(columnProps, function (column, index) {
    var columnContainer = scrollableColumns;
    if (column.fixed) {
      columnContainer = fixedColumns;
    }

    columnContainer.cell.push({
      props: column,
      template: elementTemplates.cell[index]
    });
    columnContainer.header.push({
      props: column,
      template: elementTemplates.header[index]
    });
    columnContainer.footer.push({
      props: column,
      template: elementTemplates.footer[index]
    });
  });

  return {
    fixedColumnGroups: fixedColumnGroups,
    fixedColumns: fixedColumns,
    scrollableColumnGroups: scrollableColumnGroups,
    scrollableColumns: scrollableColumns
  };
}

exports.default = (0, _shallowEqualSelector2.default)([function (state) {
  return (0, _columnWidths2.default)(state);
}, function (state) {
  return state.elementTemplates;
}], columnTemplates);