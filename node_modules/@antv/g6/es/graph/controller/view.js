import { __assign } from "tslib";
import isNumber from '@antv/util/lib/is-number';
import isString from '@antv/util/lib/is-string';
import { formatPadding } from '../../util/base';
import { applyMatrix, invertMatrix } from '../../util/math';
import modifyCSS from '@antv/dom-util/lib/modify-css';

var ViewController =
/** @class */
function () {
  function ViewController(graph) {
    this.destroyed = false;
    this.graph = graph;
    this.destroyed = false;
  } // get view center coordinate


  ViewController.prototype.getViewCenter = function () {
    var padding = this.getFormatPadding();
    var graph = this.graph;
    var width = this.graph.get('width');
    var height = graph.get('height');
    return {
      x: (width - padding[1] - padding[3]) / 2 + padding[3],
      y: (height - padding[0] - padding[2]) / 2 + padding[0]
    };
  };

  ViewController.prototype.fitCenter = function () {
    var graph = this.graph;
    var group = graph.get('group');
    group.resetMatrix();
    var bbox = group.getCanvasBBox();
    if (bbox.width === 0 || bbox.height === 0) return;
    var viewCenter = this.getViewCenter();
    var groupCenter = {
      x: bbox.x + bbox.width / 2,
      y: bbox.y + bbox.height / 2
    };
    graph.translate(viewCenter.x - groupCenter.x, viewCenter.y - groupCenter.y);
  }; // fit view graph


  ViewController.prototype.fitView = function () {
    var graph = this.graph;
    var padding = this.getFormatPadding();
    var width = graph.get('width');
    var height = graph.get('height');
    var group = graph.get('group');
    group.resetMatrix();
    var bbox = group.getCanvasBBox();
    if (bbox.width === 0 || bbox.height === 0) return;
    var viewCenter = this.getViewCenter();
    var groupCenter = {
      x: bbox.x + bbox.width / 2,
      y: bbox.y + bbox.height / 2
    };
    graph.translate(viewCenter.x - groupCenter.x, viewCenter.y - groupCenter.y);
    var w = (width - padding[1] - padding[3]) / bbox.width;
    var h = (height - padding[0] - padding[2]) / bbox.height;
    var ratio = w;

    if (w > h) {
      ratio = h;
    }

    graph.zoom(ratio, viewCenter);
  };

  ViewController.prototype.getFormatPadding = function () {
    var padding = this.graph.get('fitViewPadding');
    return formatPadding(padding);
  };

  ViewController.prototype.focusPoint = function (point, animate, animateCfg) {
    var _this = this;

    var viewCenter = this.getViewCenter();
    var modelCenter = this.getPointByCanvas(viewCenter.x, viewCenter.y);
    var viewportMatrix = this.graph.get('group').getMatrix();
    if (!viewportMatrix) viewportMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];

    if (animate) {
      var dx_1 = (modelCenter.x - point.x) * viewportMatrix[0];
      var dy_1 = (modelCenter.y - point.y) * viewportMatrix[4];
      var lastX_1 = 0;
      var lastY_1 = 0;
      var newX_1 = 0;
      var newY_1 = 0; // 动画每次平移一点，直到目标位置

      this.graph.get('canvas').animate(function (ratio) {
        newX_1 = dx_1 * ratio;
        newY_1 = dy_1 * ratio;

        _this.graph.translate(newX_1 - lastX_1, newY_1 - lastY_1);

        lastX_1 = newX_1;
        lastY_1 = newY_1;
      }, __assign({}, animateCfg));
    } else {
      this.graph.translate((modelCenter.x - point.x) * viewportMatrix[0], (modelCenter.y - point.y) * viewportMatrix[4]);
    }
  };
  /**
   * 将 Canvas 坐标转成视口坐标
   * @param canvasX canvas x 坐标
   * @param canvasY canvas y 坐标
   */


  ViewController.prototype.getPointByCanvas = function (canvasX, canvasY) {
    var viewportMatrix = this.graph.get('group').getMatrix();

    if (!viewportMatrix) {
      viewportMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    }

    var point = invertMatrix({
      x: canvasX,
      y: canvasY
    }, viewportMatrix);
    return point;
  };
  /**
   * 将页面坐标转成视口坐标
   * @param clientX 页面 x 坐标
   * @param clientY 页面 y 坐标
   */


  ViewController.prototype.getPointByClient = function (clientX, clientY) {
    var canvas = this.graph.get('canvas');
    var canvasPoint = canvas.getPointByClient(clientX, clientY);
    return this.getPointByCanvas(canvasPoint.x, canvasPoint.y);
  };
  /**
   * 将视口坐标转成页面坐标
   * @param x 视口 x 坐标
   * @param y 视口 y 坐标
   */


  ViewController.prototype.getClientByPoint = function (x, y) {
    var canvas = this.graph.get('canvas');
    var canvasPoint = this.getCanvasByPoint(x, y);
    var point = canvas.getClientByPoint(canvasPoint.x, canvasPoint.y); // return { x: point.clientX, y: point.clientY };

    return {
      x: point.x,
      y: point.y
    };
  };
  /**
   * 将视口坐标转成 Canvas 坐标
   * @param x 视口 x 坐标
   * @param y 视口 y 坐标
   */


  ViewController.prototype.getCanvasByPoint = function (x, y) {
    var viewportMatrix = this.graph.get('group').getMatrix();

    if (!viewportMatrix) {
      viewportMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    }

    return applyMatrix({
      x: x,
      y: y
    }, viewportMatrix);
  };
  /**
   * 将元素移动到画布中心
   * @param item Item 实例或 id
   * @param {boolean} animate 是否带有动画地移动
   * @param {GraphAnimateConfig} animateCfg 若带有动画，动画的配置项
   */


  ViewController.prototype.focus = function (item, animate, animateCfg) {
    if (isString(item)) {
      item = this.graph.findById(item);
    }

    var group = item.get('group');
    var matrix = group.getMatrix();
    if (!matrix) matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];

    if (item) {
      // 用实际位置而不是model中的x,y,防止由于拖拽等的交互导致model的x,y并不是当前的x,y
      this.focusPoint({
        x: matrix[6],
        y: matrix[7]
      }, animate, animateCfg);
    }
  };
  /**
   * 改变 canvas 画布的宽度和高度
   * @param width canvas 宽度
   * @param height canvas 高度
   */


  ViewController.prototype.changeSize = function (width, height) {
    var graph = this.graph;

    if (!isNumber(width) || !isNumber(height)) {
      throw Error('invalid canvas width & height, please make sure width & height type is number');
    }

    graph.set({
      width: width,
      height: height
    });
    var canvas = graph.get('canvas');
    canvas.changeSize(width, height); // change the size of grid plugin if it exists on graph

    var plugins = graph.get('plugins');
    plugins.forEach(function (plugin) {
      if (plugin.get('gridContainer')) {
        var minZoom = graph.get('minZoom');
        modifyCSS(plugin.get('container'), {
          width: width + "px",
          height: height + "px"
        });
        modifyCSS(plugin.get('gridContainer'), {
          width: width / minZoom + "px",
          height: height / minZoom + "px",
          left: 0,
          top: 0
        });
      }
    });
  };

  ViewController.prototype.destroy = function () {
    this.graph = null;
    this.destroyed = false;
  };

  return ViewController;
}();

export default ViewController;