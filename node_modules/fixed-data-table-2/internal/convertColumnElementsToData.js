/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule convertColumnElementsToData
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _React = require('./React');

var _React2 = _interopRequireDefault(_React);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _invariant = require('./invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extractProps(column) {
  return (0, _pick2.default)(column.props, ['align', 'allowCellsRecycling', 'cellClassName', 'columnKey', 'flexGrow', 'fixed', 'maxWidth', 'minWidth', 'isReorderable', 'isResizable', 'width']);
};

function _extractTemplates(elementTemplates, columnElement) {
  elementTemplates.cell.push(columnElement.props.cell);
  elementTemplates.footer.push(columnElement.props.footer);
  elementTemplates.header.push(columnElement.props.header);
};

/**
 * Converts React column / column group elements into props and cell rendering templates
 */
function convertColumnElementsToData(childComponents) {
  var children = [];
  _React2.default.Children.forEach(childComponents, function (child, index) {
    if (child == null) {
      return;
    }
    (0, _invariant2.default)(child.type.__TableColumnGroup__ || child.type.__TableColumn__, 'child type should be <FixedDataTableColumn /> or <FixedDataTableColumnGroup />');

    children.push(child);
  });

  var elementTemplates = {
    cell: [],
    footer: [],
    groupHeader: [],
    header: []
  };

  var columnProps = [];
  var hasGroupHeader = children.length && children[0].type.__TableColumnGroup__;
  if (hasGroupHeader) {
    var columnGroupProps = (0, _map2.default)(children, _extractProps);
    (0, _forEach2.default)(children, function (columnGroupElement, index) {
      elementTemplates.groupHeader.push(columnGroupElement.props.header);

      _React2.default.Children.forEach(columnGroupElement.props.children, function (child) {
        var column = _extractProps(child);
        column.groupIdx = index;
        columnProps.push(column);
        _extractTemplates(elementTemplates, child);
      });
    });

    return {
      columnGroupProps: columnGroupProps,
      columnProps: columnProps,
      elementTemplates: elementTemplates,
      useGroupHeader: true
    };
  }

  // Use a default column group
  (0, _forEach2.default)(children, function (child) {
    columnProps.push(_extractProps(child));
    _extractTemplates(elementTemplates, child);
  });
  return {
    columnGroupProps: [],
    columnProps: columnProps,
    elementTemplates: elementTemplates,
    useGroupHeader: false
  };
};

exports.default = convertColumnElementsToData;