/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule reducers
 */

'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _scrollAnchor3 = require('./scrollAnchor');

var _ActionTypes = require('./ActionTypes');

var ActionTypes = _interopRequireWildcard(_ActionTypes);

var _IntegerBufferSet = require('./IntegerBufferSet');

var _IntegerBufferSet2 = _interopRequireDefault(_IntegerBufferSet);

var _PrefixIntervalTree = require('./PrefixIntervalTree');

var _PrefixIntervalTree2 = _interopRequireDefault(_PrefixIntervalTree);

var _columnStateHelper = require('./columnStateHelper');

var _columnStateHelper2 = _interopRequireDefault(_columnStateHelper);

var _computeRenderedRows = require('./computeRenderedRows');

var _computeRenderedRows2 = _interopRequireDefault(_computeRenderedRows);

var _convertColumnElementsToData = require('./convertColumnElementsToData');

var _convertColumnElementsToData2 = _interopRequireDefault(_convertColumnElementsToData);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _shallowEqual = require('./shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Input state set from props
 */
var DEFAULT_INPUT_STATE = {
  columnProps: [],
  columnGroupProps: [],
  elementTemplates: {
    cell: [],
    footer: [],
    groupHeader: [],
    header: []
  },
  elementHeights: {
    footerHeight: 0,
    groupHeaderHeight: 0,
    headerHeight: 0
  },
  rowSettings: {
    bufferRowCount: undefined,
    rowHeight: 0,
    rowHeightGetter: function rowHeightGetter() {
      return 0;
    },
    rowsCount: 0,
    subRowHeight: 0,
    subRowHeightGetter: function subRowHeightGetter() {
      return 0;
    }
  },
  scrollFlags: {
    overflowX: 'auto',
    overflowY: 'auto',
    showScrollbarX: true,
    showScrollbarY: true
  },
  tableSize: {
    height: undefined,
    maxHeight: 0,
    ownerHeight: undefined,
    useMaxHeight: false,
    width: 0
  }
};

/**
 * Output state passed as props to the the rendered FixedDataTable
 * NOTE (jordan) rows may contain undefineds if we don't need all the buffer positions
 */
var DEFAULT_OUTPUT_STATE = {
  columnReorderingData: {},
  columnResizingData: {},
  firstRowIndex: 0,
  firstRowOffset: 0,
  isColumnReordering: false,
  isColumnResizing: false,
  maxScrollX: 0,
  maxScrollY: 0,
  rowHeights: {},
  rows: [], // rowsToRender
  scrollContentHeight: 0,
  scrollX: 0,
  scrollY: 0
};

/**
 * Internal state only used by this file
 * NOTE (jordan) internal state is altered in place
 * so don't trust it for redux history or immutability checks
 * TODO (jordan) investigate if we want to move this to local or scoped state
 */
var DEFAULT_INTERNAL_STATE = {
  bufferSet: new _IntegerBufferSet2.default(),
  storedHeights: [],
  rowOffsets: null // PrefixIntervalTree
};

var DEFAULT_STATE = _extends({}, DEFAULT_INPUT_STATE, DEFAULT_OUTPUT_STATE, DEFAULT_INTERNAL_STATE);

function reducers() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_STATE;
  var action = arguments[1];

  switch (action.type) {
    case ActionTypes.INITIALIZE:
      {
        var props = action.props;


        var newState = setStateFromProps(state, props);
        newState = initializeRowHeights(newState);
        var scrollAnchor = (0, _scrollAnchor3.getScrollAnchor)(newState, props);
        newState = (0, _computeRenderedRows2.default)(newState, scrollAnchor);
        return _columnStateHelper2.default.initialize(newState, props, {});
      }
    case ActionTypes.PROP_CHANGE:
      {
        var newProps = action.newProps,
            oldProps = action.oldProps;

        var _newState = setStateFromProps(state, newProps);

        if (oldProps.rowsCount !== newProps.rowsCount || oldProps.rowHeight !== newProps.rowHeight || oldProps.subRowHeight !== newProps.subRowHeight) {
          _newState = initializeRowHeights(_newState);
        }

        if (oldProps.rowsCount !== newProps.rowsCount) {
          // NOTE (jordan) bad practice to modify state directly, but okay since
          // we know setStateFromProps clones state internally
          _newState.bufferSet = new _IntegerBufferSet2.default();
        }

        var _scrollAnchor = (0, _scrollAnchor3.getScrollAnchor)(_newState, newProps, oldProps);

        // If anything has changed in state, update our rendered rows
        if (!(0, _shallowEqual2.default)(state, _newState) || _scrollAnchor.changed) {
          _newState = (0, _computeRenderedRows2.default)(_newState, _scrollAnchor);
        }

        _newState = _columnStateHelper2.default.initialize(_newState, newProps, oldProps);

        // TODO REDUX_MIGRATION solve w/ evil-diff
        // TODO (jordan) check if relevant props unchanged and
        // children column widths and flex widths are unchanged
        // alternatively shallow diff and reconcile props
        return _newState;
      }
    case ActionTypes.SCROLL_END:
      {
        return _extends({}, state, {
          scrolling: false
        });
      }
    case ActionTypes.SCROLL_START:
      {
        return _extends({}, state, {
          scrolling: true
        });
      }
    case ActionTypes.SCROLL_TO_Y:
      {
        var scrollY = action.scrollY;


        var _scrollAnchor2 = (0, _scrollAnchor3.scrollTo)(state, scrollY);
        return (0, _computeRenderedRows2.default)(state, _scrollAnchor2);
      }
    case ActionTypes.COLUMN_RESIZE:
      {
        var resizeData = action.resizeData;

        return _columnStateHelper2.default.resizeColumn(state, resizeData);
      }
    case ActionTypes.COLUMN_REORDER_START:
      {
        var reorderData = action.reorderData;

        return _columnStateHelper2.default.reorderColumn(state, reorderData);
      }
    case ActionTypes.COLUMN_REORDER_END:
      {
        return _extends({}, state, {
          isColumnReordering: false,
          columnReorderingData: {}
        });
      }
    case ActionTypes.COLUMN_REORDER_MOVE:
      {
        var deltaX = action.deltaX;

        return _columnStateHelper2.default.reorderColumnMove(state, deltaX);
      }
    case ActionTypes.SCROLL_TO_X:
      {
        var scrollX = action.scrollX;

        return _extends({}, state, {
          scrollX: scrollX
        });
      }
    default:
      {
        return state;
      }
  }
}

/**
 * Initialize row heights (storedHeights) & offsets based on the default rowHeight
 *
 * @param {!Object} state
 * @private
 */
function initializeRowHeights(state) {
  var _state$rowSettings = state.rowSettings,
      rowHeight = _state$rowSettings.rowHeight,
      rowsCount = _state$rowSettings.rowsCount,
      subRowHeight = _state$rowSettings.subRowHeight;

  var defaultFullRowHeight = rowHeight + subRowHeight;
  var rowOffsets = _PrefixIntervalTree2.default.uniform(rowsCount, defaultFullRowHeight);
  var scrollContentHeight = rowsCount * defaultFullRowHeight;
  var storedHeights = new Array(rowsCount);
  for (var idx = 0; idx < rowsCount; idx++) {
    storedHeights[idx] = defaultFullRowHeight;
  }
  return _extends({}, state, {
    rowOffsets: rowOffsets,
    scrollContentHeight: scrollContentHeight,
    storedHeights: storedHeights
  });
}

/**
 * @param {!Object} state
 * @param {!Object} props
 * @return {!Object}
 * @private
 */
function setStateFromProps(state, props) {
  var _convertColumnElement = (0, _convertColumnElementsToData2.default)(props.children),
      columnGroupProps = _convertColumnElement.columnGroupProps,
      columnProps = _convertColumnElement.columnProps,
      elementTemplates = _convertColumnElement.elementTemplates,
      useGroupHeader = _convertColumnElement.useGroupHeader;

  var newState = _extends({}, state, { columnGroupProps: columnGroupProps, columnProps: columnProps, elementTemplates: elementTemplates });

  newState.elementHeights = _extends({}, newState.elementHeights, (0, _pick2.default)(props, ['footerHeight', 'groupHeaderHeight', 'headerHeight']));
  if (!useGroupHeader) {
    newState.elementHeights.groupHeaderHeight = 0;
  }

  newState.rowSettings = _extends({}, newState.rowSettings, (0, _pick2.default)(props, ['bufferRowCount', 'rowHeight', 'rowsCount', 'subRowHeight']));
  var _newState$rowSettings = newState.rowSettings,
      rowHeight = _newState$rowSettings.rowHeight,
      subRowHeight = _newState$rowSettings.subRowHeight;

  newState.rowSettings.rowHeightGetter = props.rowHeightGetter || function () {
    return rowHeight;
  };
  newState.rowSettings.subRowHeightGetter = props.subRowHeightGetter || function () {
    return subRowHeight || 0;
  };

  newState.scrollFlags = _extends({}, newState.scrollFlags, (0, _pick2.default)(props, ['overflowX', 'overflowY', 'showScrollbarX', 'showScrollbarY']));

  newState.tableSize = _extends({}, newState.tableSize, (0, _pick2.default)(props, ['height', 'maxHeight', 'ownerHeight', 'width']));
  newState.tableSize.useMaxHeight = newState.tableSize.height === undefined;

  return newState;
}

module.exports = reducers;