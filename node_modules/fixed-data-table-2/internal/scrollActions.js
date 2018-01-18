/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * @providesModule scrollActions
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stopScroll = exports.startScroll = exports.scrollToY = exports.scrollToX = undefined;

var _ActionTypes = require('././ActionTypes');

/**
 * Scrolls the table horizontally to position
 *
 * @param {number} scrollX
 */
var scrollToX = exports.scrollToX = function scrollToX(scrollX) {
  return {
    type: _ActionTypes.SCROLL_TO_X,
    scrollX: scrollX
  };
};

/**
 * Scrolls the table vertically to position
 *
 * @param {number} scrollY
 */
var scrollToY = exports.scrollToY = function scrollToY(scrollY) {
  return {
    type: _ActionTypes.SCROLL_TO_Y,
    scrollY: scrollY
  };
};

/**
 * Fire when user starts scrolling
 */
var startScroll = exports.startScroll = function startScroll() {
  return {
    type: _ActionTypes.SCROLL_START
  };
};

/**
 * Fire when user starts scrolling
 */
var stopScroll = exports.stopScroll = function stopScroll() {
  return {
    type: _ActionTypes.SCROLL_END
  };
};