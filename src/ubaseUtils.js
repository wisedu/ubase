define(function(require, exports, module) {

  var configUtils = require('configUtils');
  var router = require('router');
  var utils = require('utils');
  var log = require('log');
  var req = require;

  var ubaseUtils = {
    getModules: function() {
      var modules = utils.getConfig('MODULES');

      if (typeof modules == 'undefined') {
        modules = [];
      }

      _.each(modules, function(module) {
        var title = module.title;
        module.title = utils.bhI18n(title);
        if (module.originRoute) {
          return;
        }
        module.isOpenNewPage = module.isOpenNewPage || (module.url ? true : false);
        if (module.route || module.url) {
          module.originRoute = module.route || module.url;
          module.route = (module.route && !module.isOpenNewPage) ? (module.route.indexOf('/') > 0 ? module.route.substr(0, module.route.indexOf('/')) : module.route) : '';
        } else {
          var moduleChildren = module.children;
          module.originRoute = moduleChildren[0].route || moduleChildren[0].url;
          for (var i = 0; i < moduleChildren.length; i++) {
            moduleChildren[i].originRoute = moduleChildren[i].route;
            moduleChildren[i].route = (moduleChildren[i].route && !moduleChildren[i].isOpenNewPage) ? (moduleChildren[i].route.indexOf('/') > 0 ? moduleChildren[i].route.substr(0, moduleChildren[i].route.indexOf('/')) : moduleChildren[i].route) : '';
          }
          module.children = moduleChildren;
        }
      });

      return modules;
    },
    getSortedModules: function() {
      var modules = this.getModules();
      var urlModules = [],
        routeModules = [];
      modules.forEach(function(obj) {
        obj.url ? urlModules.push(obj) : routeModules.push(obj);
      })

      routeModules = _.sortBy(routeModules, function(obj) {
        return -obj.originRoute.length;
      });
      modules = routeModules.concat(urlModules);
      modules.forEach(function(obj) {
        if (obj.children && obj.children.length > 1) {
          obj.children = _.sortBy(obj.children, function(child) {
            if (child.route === undefined) child.route = "";
            return -child.route.length;
          });
        }
      });
      return modules;
    },

    showLoading: function() {
      $('.app-loading').addClass('app-loading-show');
    },

    hideLoading: function() {
      $('.app-loading').removeClass('app-loading-show');
    },

    cleanMainArea: function() {
      $('body>main').empty();
      $('.bh-bhdialog-container').remove()
    },

    /**
     * 生成首页html布局
     */
    genMainLayout: function() {
      var layout = '<div id="headerPlaceholder"></div>' +
        '<div class="sc-container-outerFrame">' +
        '<div class="sc-container bh-border-h" bh-container-role="container">' +
        '<div id="bodyPlaceholder"></div>' +
        '</div>' +
        '</div>' +
        '<div id="footerPlaceholder"></div>' +
        '<div id="levityPlaceholder"></div>';

      $('body').prepend(layout);
    },

    getFixedMainLayout: function() {
      var layout = '<header></header><main><div style="background:#fff;min-height:936px;box-shadow:0 1px 4px rgba(0,0,0,0.28);"><img src="' + APP_CONFIG.RESOURCE_SERVER + '/images/403.png" style="display:block;margin:0 auto;padding-top:18%;"/></div></main><footer></footer>';

      $('body').prepend(layout);
    },

    getFirstModules: function() {
      var modules = this.getModules();
      var appEntry = utils.getConfig('APP_ENTRY');
      if (_.isEmpty(modules)) {
        return '';
      }

      // 排除modules中直接配置url的module
      var firstModule = _.find(modules, function(module) {
        return !module.isOpenNewPage
      });
      return $.trim(appEntry || firstModule.originRoute);
    },

    /**
     * 渲染头部，专用于简化版框架
     * @return {[type]} [description]
     */
    renderHeader: function() {
      var headerData = utils.getConfig('HEADER') || {};
      var modules = this.getModules() || [];
      var appEntry = ubaseUtils.getFirstModules();
      var appTitle = utils.getConfig('APP_TITLE');
      var useDefaultAvatar = utils.getConfig('USE_DEFAULT_AVATAR');

      var nav = [];

      var hash = window.location.hash;
      hash = hash.replace('\#\/', '');

      if (hash.indexOf('/') != -1) {
        hash = hash.substring(0, hash.indexOf('/'))
      }

      for (var i = 0; i < modules.length; i++) {
        (function() {
          var navItem = {
            title: modules[i].title,
            route: modules[i].route || modules[i].url,
            hide: modules[i].hide,
            isOpenNewPage: modules[i].isOpenNewPage,
            href: '#/' + modules[i].originRoute,
            children: modules[i].children
          };

          if (modules[i].isOpenNewPage || modules[i].url) {
            var sysIndex = location.href.indexOf('/sys/');
            var origin = location.href.substr(0, sysIndex);
            navItem.href = modules[i].originRoute.replace(/\{context\}/, origin);
            if (_.startsWith(modules[i].originRoute, 'http://')) {
              navItem.href = modules[i].originRoute;
            }
          }

          nav.push(navItem);
        })();
      }

      for (var i = 0; i < nav.length; i++) {
        if (nav[i].route) {
          if (nav[i].route === (hash || appEntry)) {
            nav[i].active = true;
          }
        } else {
          if (nav[i] && nav[i].children) {
            for (var j = 0; j < nav[i].children.length; j++) {
              if ((nav[i].children)[j].route === (hash || appEntry)) {
                nav[i].active = true;
                break;
              }
            }
          }
        }
      }

      headerData['feedback'] = utils.getConfig('feedback');
      headerData['feedbackData'] = utils.getConfig('feedbackData');
      headerData['userInfo'] = utils.getConfig('userInfo') || headerData['userInfo'];
      headerData['nav'] = nav;
      headerData['title'] = appTitle;

      if (!headerData['logo']) {
        // headerData['logo'] = utils.getConfig('RESOURCE_SERVER') + '/images/logo.png';
        headerData['logo'] = utils.getConfig('RESOURCE_SERVER') + '/fe_components/config_local/logo.png';
      }

      if (useDefaultAvatar === true || useDefaultAvatar === undefined) {
        if (!headerData['userImage']) {
          headerData['userImage'] = utils.getConfig('RESOURCE_SERVER') + '/images/user.png';
        }

        if (headerData['userInfo'] && !headerData['userInfo']['image']) {
          headerData['userInfo']['image'] = utils.getConfig('RESOURCE_SERVER') + '/images/user.png';
        }
      }
      var navItems = headerData.nav;
      for (var i = 0; i < navItems.length; i++) {
        if (navItems[i].children && navItems[i].children.length) {
          var children = navItems[i].children;
          for (var j = 0; j < children.length; j++) {
            children[j].href = '#/' + (children[j].originRoute || children[j].url);
            if (children[j].url) {
              var sysIndex = location.href.indexOf('/sys/');
              var origin = location.href.substr(0, sysIndex);
              children[j].href = children[j].url.replace(/\{context\}/, origin);
              if (_.startsWith(children[j].url, 'http://')) {
                children[j].href = children[j].url;
              }
            }
          }
          children = _.sortBy(children, function(child) {
            return parseInt(child.range, 10);
          });
          navItems[i].children = children;
        }
      }
      headerData.nav = navItems;
      $('body').children('header').bhHeader(headerData);
    },

    initFooter: function() {
      // 应各业务线人员(孟斌、马平、刘弋等)要求，去掉默认值 修改人：wangyongjian 2019/12/20
      $('body').children('footer').bhFooter({text: utils.getConfig('FOOTER_TEXT')});
    },

    setContentMinHeight: function($setContainer) {
      if (!$setContainer) {
        return;
      }

      if ($setContainer && $setContainer.length > 0) {
        var $window = $(window);
        var windowHeight = $window.height();
        var footerHeight = $("[bh-footer-role=footer]").outerHeight();
        var headerHeight = $("[bh-header-role=bhHeader]").outerHeight();
        var minHeight = windowHeight - headerHeight - footerHeight - 1;
        $setContainer.css("min-height", minHeight + "px");
      }
    },

    getUserParams: function() {
      var params = {};
      var search = location.search && location.search.substr(1);

      if (search) {
        var paramsArr = search.split('&');
        _.each(paramsArr, function(item) {
          var kv = item.split('=');
          if (kv.length == 2) {
            params[kv[0]] = kv[1];
          }
        })
      }

      return params;
    },

    initFramework: function() {
      var miniMode = utils.getConfig('MINI_MODE');
      var hideNav = utils.getConfig('HIDE_NAV');
      var headerCount = utils.getConfig('HEADER_COUNT');
      var bodyNiceScroll = utils.getConfig('NICESCROLL');
      var userParams = this.getUserParams();
      ubaseUtils.hideLoading();
      ubaseUtils.getFixedMainLayout();
      //2017-2-16 解决加载慢的时候，头未被及时隐藏的问题
      if (miniMode || userParams['min'] == '1') {
        utils.miniMode();
      }
      ubaseUtils.renderHeader();
      ubaseUtils.initFooter();
      ubaseUtils.resetJqueryHtmlMethod();
      ubaseUtils.resetHoganRenderMethod();
      //ubaseUtils.autoRefreshAuthButton();
      utils.setHeaderCount(headerCount);
      if (hideNav) {
        $('.bh-headerBar-navigate').hide();
      }
      if (miniMode || userParams['min'] == '1') {
        //2017-2-16 解决加载慢的时候，头未被及时隐藏的问题
        // utils.miniMode();
      } else {
        //ubaseUtils.initEvaluate();
        ubaseUtils.initUseApps();
      }
      ubaseUtils.configRouter();
      if (bodyNiceScroll) {
        $('body').niceScroll({
          zindex: 99999
        });
        $('body').css('overflow-y', 'auto');
      } else {
        $('body').css('overflow-y', 'scroll');
      }
      $(".app-ajax-loading").jqxLoader({});
      ubaseUtils.setContentMinHeight($('body').children('main').children('article'));
      $(function() {
        $(window).resize(function() {
          //给外层的container添加最小高度
          ubaseUtils.setContentMinHeight($('body').children('main').children('article'));
        });
      });
    },

    // 封装hogan的render方法 加入国际化的功能， 对render方法添加TEMPLATE_AFTER_RENDER回调
    resetHoganRenderMethod: function() {
      var templateAfterRender = utils.getConfig('TEMPLATE_AFTER_RENDER');
      var originRender = Hogan.Template.prototype.render;

      Hogan.Template.prototype.render = function(model, partials, indent) {
        if (model) {
          model.WIS_LABEL = window.WIS_LABEL;
        } else {
          model = {
            WIS_LABEL: window.WIS_LABEL
          };
        }

        var html = originRender.call(this, model, partials, indent);

        if (templateAfterRender) {
          if (typeof(templateAfterRender) == 'function') {
            html = templateAfterRender(html);
          } else {
            log.error('TEMPLATE_AFTER_RENDER是hogan模板渲染后的回调，需要为函数');
          }
        }

        return html;
      }
    },

    initEvaluate: function() {
      var rootPath = utils.getConfig('APP_INFO_ROOT_PATH');
      var appId = utils.getConfig('APP_ID');
      var ampUserId = sessionStorage.getItem("ampUserId");
      var ampUserName = sessionStorage.getItem("ampUserName");

      $.bhEvaluate.init({
        appId: appId, //应用id
        userName: ampUserName, //用户名
        userId: ampUserId, //用户id
        rootPath: rootPath
      });
    },

    initUseApps: function() {
      var rootPath = utils.getConfig('APP_INFO_ROOT_PATH');
      var showUseApps = utils.getConfig('SHOW_USEAPPS');
      var useAppsType = utils.getConfig('USEAPPS_TYPE');
      var showTag = false;
      if (useAppsType === 'spread') {
        showTag = true;
      }
      if (showUseApps) {
        $.ampUseApps.init({
          show: showTag,
          rootPath: rootPath
        });
      }
    },

    configRouter: function() {
      var self = this;
      var preRoute = null;
      router.configure({
        delimiter: '/',
        after: function() {
          var currentModule = self.getCurrentModule();
          var currentRoute = currentModule && currentModule.originRoute;
          if (preRoute == currentRoute) {
            return;
          } else {
            preRoute = currentRoute;
          }

          $(".bh-paper-pile-dialog").remove();
          $('.sc-container').removeClass('bh-border-transparent bh-bg-transparent');
          var $body = $('body');
          $body.children('[bh-footer-role=footer]').removeAttr('style');
          self.setContentMinHeight($body.children('main').children('article'));
          self.reselectHeaderNav();
          setTimeout(function() {
            $body.children('main').children('article[bh-layout-role=navLeft]').children("section").css("width", "initial");
          }, 10);
          try {
            $('.jqx-window').jqxWindow('destroy');
          } catch (e) {
            //
          }
          $('.jqx-window').remove();
        }
      });
    },

    reselectHeaderNav: function() {
      var currentModule = this.getCurrentModule();
      var modules = this.getModules();

      var currentIndex = 0;

      for (var i = 0; i < modules.length; i++) {
        if (modules[i].originRoute == currentModule.originRoute) {
          currentIndex = i + 1;
          break;
        }
      }

      $('header').bhHeader("resetNavActive", {
        "activeIndex": currentIndex
      });
    },

    getCurrentModule: function() {
      var hash = window.location.hash;
      hash = hash.replace('\#\/', '');
      var modules = this.getModules();
      var currentModule = null;

      for (var i = 0; i < modules.length; i++) {
        if (modules[i].children && modules[i].children.length) {
          var children = modules[i].children;
          for (var j = 0; j < children.length; j++) {
            if (_.startsWith(hash + '/', children[j].originRoute + '/')) {
              currentModule = children[j];
              break;
            }
          }
        } else {
          if (_.startsWith(hash + '/', modules[i].originRoute + '/')) {
            currentModule = modules[i];
            break;
          }
        }
      }

      return currentModule;
    },

    resetJqueryHtmlMethod: function() {
      $.fn.oldHtmlFn = $.fn.html;
      var self = this;

      $.fn.html = function(content, resetFrameworkHeight) {
        var res = null;
        if (content !== undefined) {
          res = $(this).oldHtmlFn(content);
        } else {
          res = $(this).oldHtmlFn();
        }
        if (resetFrameworkHeight) {
          var $body = $('body');
          self.setContentMinHeight($body.children('main') && $body.children('main').children('article'));
        }
        self.setButtonAuth();
        return res;
      }
    },

    autoRefreshAuthButton: function() {
      var self = this;
      var debounced = _.debounce(function() {
        self.setButtonAuth();
      }, 50);
      $(document).bind('DOMNodeInserted', function() {
        debounced();
      });
      $(document).bind('DOMNodeRemoved', function() {
        debounced();
      });
    },

    // unuse
    resetJqueryAppendMethod: function() {
      var self = this;
      var debounced = _.debounce(function() {
        self.setButtonAuth();
      }, 500);
      _.each(['append', 'prepend', 'appendTo', 'prependTo', 'after',
        'before', 'insertAfter', 'insertBefore', 'wrap', 'wrapAll', 'wrapInner', 'replaceAll', 'replaceWith'
      ], function(method) {
        $.fn['old' + method + 'Fn'] = $.fn[method];

        $.fn[method] = function(content) {
          $(this)['old' + method + 'Fn'](content);
          self.setButtonAuth();
          return $(this);
        }
      })
    },

    setButtonAuth: function() {
      var currentModule = this.getCurrentModule();
      var authControlledButtons = $('[manageAuth="Y"]');
      var buttons = currentModule && currentModule.buttons;

      _.each(authControlledButtons, function(item) {
        if (!_.includes(buttons, $(item).attr('data-auth') || $(item).attr('id'))) {
          $(item).remove();
        }
      })
    },

    getIEVersion: function() {
      var version = null;
      if (navigator.userAgent.indexOf("MSIE") > 0) {
        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
          version = 6;
        }
        if (navigator.userAgent.indexOf("MSIE 7.0") > 0) {
          version = 7;
        }
        if (navigator.userAgent.indexOf("MSIE 9.0") > 0 && !window.innerWidth) {
          version = 8;
        }
        if (navigator.userAgent.indexOf("MSIE 9.0") > 0) {
          version = 9;
        }
        if (navigator.userAgent.indexOf("MSIE 10.0") > 0) {
          version = 10;
        }


      }

      return version;
    }

  };

  return ubaseUtils;
});