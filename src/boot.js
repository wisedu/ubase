define(function (require, exports, module) {

  var utils = require('utils');
  var config = require('resourceConfig');
  var router = require('router');
  var baseView = require('baseView');
  var req = require;
  var ubaseUtils = require('ubaseUtils');
  var log = require('log');

  var boot = {
    start: function (options) {
      var self = this;
      var cdn = utils.getConfig('RESOURCE_SERVER');
      var demoMode = utils.getConfig('DEMO_MODE');
      var modules = ubaseUtils.getSortedModules();
      var appEntry = ubaseUtils.getFirstModules();
      var ieVersion = ubaseUtils.getIEVersion()

      if (!cdn) {
        log.error('config中RESOURCE_SERVER配置不能为空！');
        return;
      }

      this.setLoadingStyle();
      this.setTitle();
      this.loadPublicCss();
      this.loadPrivateCss();

      var publicBaseJs = this.getPublicBaseJs();
      var publicNormalJs = this.getPublicNormalJs();
      var mockJs = this.getMockJs();
      var currentAppViews = this.getCurrentAppViews();

      req(publicBaseJs, function () {
        // 添加国际化需要，bh 和 emap 按顺序加载
        req([publicNormalJs[0]], function () {
          publicNormalJs.splice(0, 1);
          req(publicNormalJs, function () {
            req(mockJs, function () {
              req(['utils', 'router'].concat(demoMode ? currentAppViews : []),
                function (utils, router) {
                  var args = arguments;
                  var currentRoute = null;
                  var bindedRoutes = [];
                  for (var i = 0; i < modules.length; i++) {
                    (function () {
                      var index = i;
                      var route = modules[i].route && modules[i].route.trim();

                      if (route.isOpenNewPage) {
                        return;
                      }

                      if (_.includes(bindedRoutes, route)) {
                        return;
                      }
                      bindedRoutes.push(route);

                      //绑定路由，访问路由时才加载相应的文件
                      router.on('/' + route + '/?((\w|.)*)', function (path) {
                        var currentModule = ubaseUtils.getCurrentModule();
                        if (currentModule && currentRoute === currentModule.originRoute) {
                          return;
                        }

                        ubaseUtils.cleanMainArea();
                        ubaseUtils.showLoading();

                        var path = path ? path.split('/') : [];
                        try {
                          req([currentAppViews[index]], function (viewConfig) {
                            baseView(viewConfig, path);
                            ubaseUtils.hideLoading();
                          });
                        } catch (error) {
                          log.error(error)
                        }
                        locationHash = location.hash;
                        currentRoute = currentModule.originRoute;
                      });
                    })();
                  }
                  ubaseUtils.initFramework();
                  if (ieVersion === 9) {
                    $('.app-loading').remove()
                  }
                  self.afterFrameworkInit();
                  router.init('/' + appEntry);
                });
            });
          })
        })

      });
    },

    afterFrameworkInit: function () {
      var afterInit = utils.getConfig('CALLBACK') || utils.getConfig('AFTER_FRAMEWORK_INIT');
      if (afterInit) {
        afterInit();
      }
    },

    getResourceConfig: function (type) {
      var staticConfig = store.session('staticConfig') || config;
      return staticConfig[type];
    },

    loadPublicCss: function () {
      var cdn = utils.getConfig('RESOURCE_SERVER');
      var bhVersion = utils.getConfig('BH_VERSION');
      var ieShivCss = this.getResourceConfig('IE_SHIV_CSS');
      var publicCss = this.getResourceConfig('PUBLIC_CSS');
      var publicCssNew
      var theme = utils.getConfig('THEME') || 'blue';
      var version = bhVersion ? ('-' + bhVersion) : '';
      var regEx = /fe_components|bower_components/;
      var currentBrowserVersion = ubaseUtils.getIEVersion();

      if (currentBrowserVersion && currentBrowserVersion == 9) {
        publicCss = publicCss.concat(ieShivCss);
      }

      for (var i = 0; i < publicCss.length; i++) {
        var url = this.addTimestamp(publicCss[i]);
        if (regEx.test(publicCss[i])) {
          loadCss(cdn + url.replace(/\{\{theme\}\}/, theme).replace(/\{\{version\}\}/, version));
        } else {
          loadCss(url);
        }
      }

    },

    addTimestamp: function (url) {
      var resourceVersion = this.getResourceConfig('RESOURCE_VERSION') || (+new Date());

      return url + '?rv=' + resourceVersion;
    },

    loadPrivateCss: function () {
      var debug = utils.getConfig('DEBUG_MODE');
      var fedebug = utils.getConfig('FE_DEBUG_MODE');
      var demoMode = utils.getConfig('DEMO_MODE');
      var innerIndexMode = utils.getConfig('INNER_INDEX_MODE');

      var consoleDebug = store.session("debug");
      var releaseMode = utils.getConfig('RELEASE_MODE');
      // STATIC_TIMESTAMP已废弃的属性 业务代码通过APP_VERSION控制版本
      var appVersion = utils.getConfig('APP_VERSION') || utils.getConfig('STATIC_TIMESTAMP') || '30000';
      if (!debug && !fedebug && window.__Template) {
        //loadCss('./dest/all.css');
        return;
      }

      var currentRoute = router.getRoute();
      var modules = ubaseUtils.getModules();
      if (!modules) {
        return;
      }

      if (releaseMode && !consoleDebug) {
        loadCss((innerIndexMode ? '.' : '') + './public/build/all.css?av' + appVersion);
        return;
      }

      /**demo模式时 加载每个模块下面的css文件*/
      if (demoMode) {
        for (var i = 0; i < modules.length; i++) {
          loadCss((innerIndexMode ? '.' : '') + './modules/' + modules[i].route + '/' + modules[i].route + '.css');
        }
      } else {
        loadCss((innerIndexMode ? '.' : '') + './public/css/base.css?av' + appVersion);
      }

      loadCss((innerIndexMode ? '.' : '') + './public/css/style.css?av' + appVersion);
    },

    getPublicBaseJs: function () {
      var cdn = utils.getConfig('RESOURCE_SERVER');
      var publicBaseJs = this.getResourceConfig('PUBLIC_BASE_JS');
      var ieShivJs = this.getResourceConfig('IE_SHIV_JS');
      var bhVersion = utils.getConfig('BH_VERSION');
      var version = bhVersion ? ('-' + bhVersion) : '';

      var currentBrowserVersion = ubaseUtils.getIEVersion();
      var deps = [];
      var regEx = /fe_components|bower_components/;

      if (currentBrowserVersion && currentBrowserVersion == 9) {
        publicBaseJs = publicBaseJs.concat(ieShivJs);
      }

      for (var i = 0; i < publicBaseJs.length; i++) {
        var url = this.addTimestamp(publicBaseJs[i]);
        if (regEx.test(publicBaseJs[i])) {
          deps.push(cdn + url.replace(/\{\{version\}\}/, version));
        } else {
          deps.push(url);
        }
      }

      return deps;
    },

    getPublicNormalJs: function () {
      var cdn = utils.getConfig('RESOURCE_SERVER');
      var bhVersion = utils.getConfig('BH_VERSION');
      var publicNormalJs = this.getResourceConfig('PUBLIC_NORMAL_JS');
      var version = bhVersion ? ('-' + bhVersion) : '';
      var deps = [];

      var consoleDebug = store.session("debug");
      var releaseMode = utils.getConfig('RELEASE_MODE');

      var regEx = /fe_components|bower_components/;
      for (var i = 0; i < publicNormalJs.length; i++) {
        var url = this.addTimestamp(publicNormalJs[i]);
        if (regEx.test(publicNormalJs[i])) {
          deps.push(cdn + url.replace(/\{\{version\}\}/, version));
        } else {
          deps.push(url);
        }
      }

      if (releaseMode && !consoleDebug) {
        deps.push('./public/build/package.js');
      }

      return deps;
    },

    getMockJs: function () {
      var cdn = utils.getConfig('RESOURCE_SERVER');
      var debugMode = utils.getConfig('FE_DEBUG_MODE');
      var bhVersion = utils.getConfig('BH_VERSION');
      var version = bhVersion ? ('-' + bhVersion) : '';
      var mockJs = []
      var debugJs = this.getResourceConfig('DEBUG_JS');
      var deps = [];

      var consoleDebug = store.session("debug");

      if (debugMode) {
        mockJs = mockJs.concat(debugJs);
      }
      var regEx = /fe_components|bower_components/;
      for (var i = 0; i < mockJs.length; i++) {
        var url = this.addTimestamp(mockJs[i]);
        if (regEx.test(mockJs[i])) {
          deps.push(cdn + url.replace(/\{\{version\}\}/, version));
        } else {
          deps.push(url);
        }
      }

      return deps;
    },

    getCurrentAppViews: function () {

      var modules = ubaseUtils.getSortedModules();
      var innerIndexMode = utils.getConfig('INNER_INDEX_MODE');

      var deps = [];
      if (!modules) {
        return;
      }

      for (var i = 0; i < modules.length; i++) {
        if (modules[i].isOpenNewPage) {
          deps.push('');
        } else {
          deps.push((innerIndexMode ? '../' : '') + 'modules/' + modules[i].route + '/' + modules[i].route);
        }
      }

      return deps;
    },

    setTitle: function () {
      var title = utils.getConfig('APP_TITLE');
      var titleElem = document.createElement("title");
      titleElem.innerText = title;
      document.getElementsByTagName("head")[0].appendChild(titleElem);
    },

    setLoadingStyle: function () {
      var style = document.createElement("style");
      style.innerText = loadingCss;
      document.getElementsByTagName("head")[0].appendChild(style);
      $('body').append('  <div class="app-ajax-loading" style="position:fixed;z-index:30000;background-color:rgba(0,0,0,0);"></div><div class="app-loading"><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></div>');
      ubaseUtils.showLoading();
    }

  };

  function loadCss(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
  }

  var loadingCss = '.app-ajax-loading .bh-loader-icon-line-border{border: 0px solid #ddd;box-shadow:none;}.app-ajax-loading{position:fixed;z-index:30000;}.app-loading{position:absolute;opacity:0;top:150px;left:-75px;margin-left:50%;z-index:-1;text-align:center}.app-loading-show{z-index:9999;animation:fade-in;animation-duration:0.5s;-webkit-animation:fade-in 0.5s;opacity:1;}@keyframes fade-in{0%{opacity:0}50%{opacity:.4}100%{opacity:1}}@-webkit-keyframes fade-in{0%{opacity:0}50%{opacity:.4}100%{opacity:1}}.spinner>div{width:30px;height:30px;background-color:#4DAAF5;border-radius:100%;display:inline-block;-webkit-animation:bouncedelay 1.4s infinite ease-in-out;animation:bouncedelay 1.4s infinite ease-in-out;-webkit-animation-fill-mode:both;animation-fill-mode:both}.spinner .bounce1{-webkit-animation-delay:-.32s;animation-delay:-.32s}.spinner .bounce2{-webkit-animation-delay:-.16s;animation-delay:-.16s}@-webkit-keyframes bouncedelay{0%,100%,80%{-webkit-transform:scale(0)}40%{-webkit-transform:scale(1)}}@keyframes bouncedelay{0%,100%,80%{transform:scale(0);-webkit-transform:scale(0)}40%{transform:scale(1);-webkit-transform:scale(1)}}'

  return boot;


});
