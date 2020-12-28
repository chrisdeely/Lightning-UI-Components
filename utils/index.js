/**
 * Copyright 2020 Comcast Cable Communications Management, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import lng from '@lightningjs/core';

/**
 * Lightning uses ARGB values, use this function
 * to convert know color to Lightning value
 * https://ifpb.github.io/javascript-guide/ecma/expression-and-operator/argb.html
 */
export function rgba2argb(rgbaStr) {
  let rgba = rgbaStr.replace(/rgba\(|\)/g, '').split(',');
  // Multiple Alpha Value
  rgba[3] = rgba[3] * 255;
  return lng.StageUtils.getArgbNumber(rgba);
}

/**
 * Helpers for lng.Tools.getRoundRect
 */
export const RoundRect = {
  /**
   * Returns a value that will render as the given width (w)
   * when passed to lng.Tools.getRoundRect
   * @param {number} w - px value for expected width
   * @param {*} options
   * @param {number} options.padding - px value for both left and right padding
   * @param {number} options.paddingLeft - px value for left padding, overrides options.padding
   * @param {number} options.paddingRight - px value for right padding, overrides options.padding
   * @param {number} options.strokeWidth - px value for stroke width
   */
  getWidth(w, options = {}) {
    const { padding, paddingLeft, paddingRight, strokeWidth } = {
      padding: 0,
      paddingLeft: 0,
      paddingRight: 0,
      strokeWidth: 0,
      ...options
    };

    if (!w) return 0;

    return (
      w - (paddingLeft || padding) - (paddingRight || padding) - strokeWidth
    );
  },
  /**
   * Returns a value that will render as the given height (h)
   * when passed to lng.Tools.getRoundRect
   * @param {number} h - px value for expected width
   * @param {*} options
   * @param {number} options.padding - px value for both bottom and top padding
   * @param {number} options.paddingBottom - px value for bottom padding, overrides options.padding
   * @param {number} options.paddingTop - px value for top padding, overrides options.padding
   * @param {number} options.strokeWidth - px value for stroke width
   */
  getHeight(h, options = {}) {
    const { padding, paddingBottom, paddingTop, strokeWidth } = {
      padding: 0,
      paddingBottom: 0,
      paddingTop: 0,
      strokeWidth: 0,
      ...options
    };

    if (!h) return 0;

    return (
      h - (paddingBottom || padding) - (paddingTop || padding) - strokeWidth
    );
  }
};

export const getTheme = (prev = {}, next = {}) => {
  return {
    ...prev,
    ...next,
    focus: {
      ...prev.focus,
      ...next.focus
    },
    unfocus: {
      ...prev.unfocus,
      ...next.unfocus
    }
  };
};

/**
 * Merges two objects together and returns the duplicate.
 *
 * @param {Object} target - object to be cloned
 * @param {Object} [object] - secondary object to merge into clone
 */
export function clone(target, object) {
  const _clone = { ...target };
  if (!object || target === object) return _clone;

  for (let key in object) {
    const value = object[key];
    if (target.hasOwnProperty(key)) {
      _clone[key] = getMergeValue(key, target, object);
    } else {
      _clone[key] = value;
    }
  }

  return _clone;
}

function getMergeValue(key, target, object) {
  const targetVal = target[key];
  const objectVal = object[key];
  const targetValType = typeof targetVal;
  const objectValType = typeof objectVal;

  if (
    targetValType !== objectValType ||
    objectValType === 'function' ||
    Array.isArray(objectVal)
  ) {
    return objectVal;
  }

  if (objectVal && objectValType === 'object') {
    return clone(targetVal, objectVal);
  }

  return objectVal;
}

/**
 * Returns the rendered width of a given text texture
 * @param {Object} text - text texture properties
 * @param {string} text.text - text value
 * @param {string} text.fontStyle - css font-style property
 * @param {(string|number)} text.fontWeight - css font-weight property
 * @param {string} [fontSize=0] - css font-size property (in px)
 * @param {string} [text.fontFamily=sans-serif] - css font-weight property
 * @param {string} text.fontFace - alias for fontFamily
 *
 * @returns {number} text width
 * */
export function measureTextWidth(text = {}) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const {
    fontStyle,
    fontWeight,
    fontSize,
    fontFamily = text.fontFace || 'sans-serif'
  } = text;
  const fontCss = [
    fontStyle,
    fontWeight,
    fontSize ? `${fontSize}px` : '0',
    `'${fontFamily}'`
  ]
    .filter(Boolean)
    .join(' ');
  ctx.font = fontCss;
  const textMetrics = ctx.measureText(text.text || '');

  // try using the actual bounding box first because it will be more accurate
  if (textMetrics.actualBoundingBoxLeft && textMetrics.actualBoundingBoxRight) {
    return Math.round(
      Math.abs(textMetrics.actualBoundingBoxLeft) +
        Math.abs(textMetrics.actualBoundingBoxRight)
    );
  }

  return Math.round(textMetrics.width);
}

/**
 * Returns first argument that is a number. Useful for finding ARGB numbers. Does not convert strings to numbers
 * @param {...*} number - maybe a number
 **/
export function getFirstNumber(...numbers) {
  return numbers.find(Number.isFinite);
}
