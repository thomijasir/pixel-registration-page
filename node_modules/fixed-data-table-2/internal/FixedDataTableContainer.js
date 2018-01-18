'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ActionTypes = require('./ActionTypes');

var ActionTypes = _interopRequireWildcard(_ActionTypes);

var _FixedDataTable = require('./FixedDataTable');

var _FixedDataTable2 = _interopRequireDefault(_FixedDataTable);

var _FixedDataTableStore = require('./FixedDataTableStore');

var _FixedDataTableStore2 = _interopRequireDefault(_FixedDataTableStore);

var _React = require('./React');

var _React2 = _interopRequireDefault(_React);

var _redux = require('redux');

var _columnActions = require('./columnActions');

var columnActions = _interopRequireWildcard(_columnActions);

var _invariant = require('./invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _scrollActions = require('./scrollActions');

var scrollActions = _interopRequireWildcard(_scrollActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright Schrodinger, LLC
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * LICENSE file in the root directory of this source tree. An additional grant
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * of patent rights can be found in the PATENTS file in the same directory.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @providesModule FixedDataTableContainer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @typechecks
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @noflow
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var FixedDataTableContainer = function (_React$Component) {
  _inherits(FixedDataTableContainer, _React$Component);

  function FixedDataTableContainer(props) {
    _classCallCheck(this, FixedDataTableContainer);

    var _this = _possibleConstructorReturn(this, (FixedDataTableContainer.__proto__ || Object.getPrototypeOf(FixedDataTableContainer)).call(this, props));

    _this.update = _this.update.bind(_this);

    _this.reduxStore = _FixedDataTableStore2.default.get();
    _this.unsubscribe = _this.reduxStore.subscribe(_this.update);

    _this.scrollActions = (0, _redux.bindActionCreators)(scrollActions, _this.reduxStore.dispatch);
    _this.columnActions = (0, _redux.bindActionCreators)(columnActions, _this.reduxStore.dispatch);
    return _this;
  }

  _createClass(FixedDataTableContainer, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var props = this.props;

      this.reduxStore.dispatch({
        type: ActionTypes.INITIALIZE,
        props: props
      });

      this.update();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      (0, _invariant2.default)(nextProps.height !== undefined || nextProps.maxHeight !== undefined, 'You must set either a height or a maxHeight');

      this.reduxStore.dispatch({
        type: ActionTypes.PROP_CHANGE,
        newProps: nextProps,
        oldProps: this.props
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
      }
      this.reduxStore = null;
    }
  }, {
    key: 'render',
    value: function render() {
      return _React2.default.createElement(_FixedDataTable2.default, _extends({}, this.props, this.state, {
        scrollActions: this.scrollActions,
        columnActions: this.columnActions
      }));
    }
  }, {
    key: 'update',
    value: function update() {
      var state = this.reduxStore.getState();
      var boundState = (0, _pick2.default)(state, ['columnGroupProps', 'columnProps', 'columnReorderingData', 'columnResizingData', 'elementHeights', 'elementTemplates', 'firstRowIndex', 'isColumnReordering', 'isColumnResizing', 'maxScrollX', 'maxScrollY', 'rows', 'rowHeights', 'rowSettings', 'scrollContentHeight', 'scrollFlags', 'scrollX', 'scrollY', 'tableSize']);

      this.setState(boundState);
    }
  }]);

  return FixedDataTableContainer;
}(_React2.default.Component);

exports.default = FixedDataTableContainer;