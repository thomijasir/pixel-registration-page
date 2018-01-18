'use strict';

var _DOMMouseMoveTracker = require('./DOMMouseMoveTracker');

var _DOMMouseMoveTracker2 = _interopRequireDefault(_DOMMouseMoveTracker);

var _Locale = require('./Locale');

var _Locale2 = _interopRequireDefault(_Locale);

var _React = require('./React');

var _React2 = _interopRequireDefault(_React);

var _createReactClass = require('create-react-class');

var _createReactClass2 = _interopRequireDefault(_createReactClass);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ReactComponentWithPureRenderMixin = require('./ReactComponentWithPureRenderMixin');

var _ReactComponentWithPureRenderMixin2 = _interopRequireDefault(_ReactComponentWithPureRenderMixin);

var _FixedDataTableEventHelper = require('./FixedDataTableEventHelper');

var _FixedDataTableEventHelper2 = _interopRequireDefault(_FixedDataTableEventHelper);

var _clamp = require('./clamp');

var _clamp2 = _interopRequireDefault(_clamp);

var _cx = require('./cx');

var _cx2 = _interopRequireDefault(_cx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FixedDataTableColumnReorderHandle = (0, _createReactClass2.default)({
  displayName: 'FixedDataTableColumnReorderHandle',
  mixins: [_ReactComponentWithPureRenderMixin2.default],

  propTypes: {

    /**
     * When resizing is complete this is called.
     */
    onColumnReorderEnd: _propTypes2.default.func,

    /**
     * Column key for the column being reordered.
     */
    columnKey: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),

    /**
     * Whether the reorder handle should respond to touch events or not.
     */
    touchEnabled: _propTypes2.default.bool
  },

  getInitialState: function getInitialState() /*object*/{
    return {
      dragDistance: 0
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps( /*object*/newProps) {},
  componentWillUnmount: function componentWillUnmount() {
    if (this._mouseMoveTracker) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
      this._mouseMoveTracker.releaseMouseMoves();
      this._mouseMoveTracker = null;
    }
  },
  render: function render() /*object*/{
    var style = {
      height: this.props.height
    };
    return _React2.default.createElement('div', {
      className: (0, _cx2.default)({
        'fixedDataTableCellLayout/columnReorderContainer': true,
        'fixedDataTableCellLayout/columnReorderContainer/active': false
      }),
      onMouseDown: this.onMouseDown,
      onTouchStart: this.props.touchEnabled ? this.onMouseDown : null,
      onTouchEnd: this.props.touchEnabled ? function (e) {
        return e.stopPropagation();
      } : null,
      onTouchMove: this.props.touchEnabled ? function (e) {
        return e.stopPropagation();
      } : null,
      style: style });
  },
  onMouseDown: function onMouseDown(event) {
    var targetRect = event.target.getBoundingClientRect();
    var coordinates = _FixedDataTableEventHelper2.default.getCoordinatesFromEvent(event);

    var mouseLocationInElement = coordinates.x - targetRect.offsetLeft;
    var mouseLocationInRelationToColumnGroup = mouseLocationInElement + event.target.parentElement.offsetLeft;

    this._mouseMoveTracker = new _DOMMouseMoveTracker2.default(this._onMove, this._onColumnReorderEnd, document.body, this.props.touchEnabled);
    this._mouseMoveTracker.captureMouseMoves(event);
    this.setState({
      dragDistance: 0
    });
    this.props.onMouseDown({
      columnKey: this.props.columnKey,
      mouseLocation: {
        dragDistance: 0,
        inElement: mouseLocationInElement,
        inColumnGroup: mouseLocationInRelationToColumnGroup
      }
    });

    this._distance = 0;
    this._animating = true;
    this.frameId = requestAnimationFrame(this._updateState);

    /**
     * This prevents the rows from moving around when we drag the
     * headers on touch devices.
     */
    if (this.props.touchEnabled) {
      event.stopPropagation();
    }
  },
  _onMove: function _onMove( /*number*/deltaX) {
    this._distance = this.state.dragDistance + deltaX;
  },
  _onColumnReorderEnd: function _onColumnReorderEnd( /*boolean*/cancelReorder) {
    this._animating = false;
    cancelAnimationFrame(this.frameId);
    this.frameId = null;
    this._mouseMoveTracker.releaseMouseMoves();
    this.props.columnReorderingData.cancelReorder = cancelReorder;
    this.props.onColumnReorderEnd();
  },
  _updateState: function _updateState() {
    if (this._animating) {
      this.frameId = requestAnimationFrame(this._updateState);
    }
    this.setState({
      dragDistance: this._distance
    });
    this.props.onColumnReorderMove(this._distance);
  }
}); /**
     * Copyright Schrodinger, LLC
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * This is to be used with the FixedDataTable. It is a header icon
     * that allows you to reorder the corresponding column.
     *
     * @providesModule FixedDataTableColumnReorderHandle
     * @typechecks
     */

module.exports = FixedDataTableColumnReorderHandle;