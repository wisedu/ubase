define(function(require, exports, module) {

  var utils = require('utils');
  var ubaseUtils = require('ubaseUtils');
  var log = require('log');

  var viewCore = function() {
    this.$rootElement = $('body>main');
    this._subView = [];
    this.subView = {};
    this._bindedEventElement = [];
  };

  var availableElement = $('body');

  viewCore.prototype = {
    initialize: function() {},

    getRouterParams: function() {

      var res = {};
      _.each(this._routerParams, function(param, index) {
        res[index] = param;
      });

      return res;
    },

    _coreBindEvent: function() {
      var self = this;
      if (_.isEmpty(this.eventMap)) {
        return;
      }

      _.each(_.keys(this.eventMap), function(elem) {
        var realElem = null,
          event = null;
        if (!self.eventMap[elem]) {
          log.error('eventMap中选择器“' + elem + '”的事件处理函数未定义！！！' + (self._eventMapFunction ? ', 错误上下文：' + self._eventMapFunction.toString() : ''));
          return;
        }
        self.__checkEventConflict(elem);
        if (elem.indexOf('@') > 0) {
          realElem = elem.substr(0, elem.indexOf('@'));
          event = elem.substr(elem.indexOf('@') + 1);
          availableElement.on(event, realElem, self.eventMap[elem].bind(self));
        } else {
          availableElement.on('click', elem, self.eventMap[elem].bind(self));
        }
      });
    },

    __checkEventConflict: function(elem) {
      if (_.contains(this._bindedEventElement, elem)) {
        log.warn('选择器:' + elem + '在eventMap中出现重复绑定[注：模块中所有eventMap的选择器须保证唯一]');
      } else {
        this._bindedEventElement.push(elem);
      }
    },

    setHtml: function(content) {
      this.$rootElement.html(content);
      ubaseUtils.setContentMinHeight($('body').children('main').children('article'));
    },

    setRootHtml: function(content) {
      this.$rootElement.html(content);
      ubaseUtils.setContentMinHeight($('body').children('main').children('article'));
    },

    setRootElement: function(elem) {
      this.$rootElement = elem;
    },

    _coreBindEventForSubView: function(subViewConfig) {
      var self = this;
      if (_.isEmpty(subViewConfig)) {
        return;
      }
      subViewConfig.realInit = subViewConfig.realInit || subViewConfig.initialize.bind(subViewConfig);

      //子页面中可以直接使用pushSubView方法继续添加子页面，原则上可以实现子页面无限级嵌套
      subViewConfig.pushSubView = function(subViewConfig) {
        self.pushSubView(subViewConfig);
      }

      subViewConfig.$rootElement = self.$rootElement;
      subViewConfig.initialize = function(params) {
        subViewConfig.realInit(params);
        if (subViewConfig.__eventBinded) {
          return;
        } else {
          subViewConfig.__eventBinded = true;
        }

        _.each(_.keys(subViewConfig.eventMap), function(elem) {
          var realElem = null;
          var event = null;
          if (!subViewConfig.eventMap[elem]) {
            log.error('eventMap中选择器“' + elem + '”的事件处理函数未定义！！！' + (self._eventMapFunction ? ', 错误上下文：' + subViewConfig._eventMapFunction.toString() : ''));
            return;
          }
          self.__checkEventConflict(elem);
          if (elem.indexOf('@') > 0) {
            realElem = elem.substr(0, elem.indexOf('@'));
            event = elem.substr(elem.indexOf('@') + 1);
            availableElement.on(event, realElem, subViewConfig.eventMap[elem].bind(subViewConfig));
          } else {
            availableElement.on('click', elem, subViewConfig.eventMap[elem].bind(subViewConfig));
          }
        });
      };
    },

    pushSubView: function(subViewConfig) {
      var self = this;
      if (subViewConfig.constructor === Array) {
        _.each(subViewConfig, function(subView) {
          self._pushSubView(subView);
        });
      } else {
        this._pushSubView(subViewConfig);
      }
    },

    _pushSubView: function(subViewConfig) {
      if (_.contains(this._subView, subViewConfig)) {
        return;
      }
      subViewConfig.__eventBinded = false;
      this._subView.push(subViewConfig);
      initEventMap(subViewConfig);
      if (subViewConfig.viewName && typeof(subViewConfig.viewName) === 'string') {
        this.subView[subViewConfig.viewName] = subViewConfig;
      }

      subViewConfig.parent = this;
      this._coreBindEventForSubView(subViewConfig);
    }
  };

  function initEventMap(app) {
    if (app.eventMap && 　typeof(app.eventMap) === 'function') {
      app._eventMapFunction = app.eventMap;
      app.eventMap = app.eventMap();
    }
  }

  function baseView(config, path) {
    var app = new viewCore();
    app._routerParams = path;
    $.extend(app, config);
    app._originUserConfig = config;
    availableElement.off();
    initEventMap(app);
    app.initialize();
    app._coreBindEvent();
  }

  return baseView;
});
