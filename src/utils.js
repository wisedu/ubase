define(function(require, exports, module) {

    var configUtils = require('configUtils');
    var router = require('router');
    var log = require('log');
    var req = require;

    var utils = {
        loadCompiledPage: function(relativePath, req) {
            var innerIndexMode = utils.getConfig('INNER_INDEX_MODE');
            var debug = utils.getConfig('DEBUG_MODE');
            var fullPath = req && this.getPageFullPath(relativePath, req);

            if (_.startsWith(relativePath, '.') || _.startsWith(relativePath, '/') || _.contains(relativePath, '/')) {
                //log.warn('"'+relativePath + '" 加载方式不符合规范，页面中loadCompiledPage建议只加载当前路径下的html文件，使用时直接写文件名即可，第二个参数传true。如：utils.loadCompiledPage("testIndexPage", true)')
            }
            if (!debug && window.__Template && req && __Template[fullPath]) {
                return new Hogan.Template(__Template[fullPath]);
            }

            var currentRoute = utils.getCurrentRoute();
            var html = '';
            var url = null;
            if (req) {
                url = fullPath + '.html';
            } else {
                url = './modules/' + currentRoute + '/' + relativePath + '.html';
            }

            if (innerIndexMode) {
                url = '.' + url;
            }

            var appVersion = utils.getConfig('APP_VERSION') || utils.getConfig('STATIC_TIMESTAMP') || '30000';

            url = url + '?av=' + appVersion;

            $.ajax({
                url: url,
                dataType: 'html',
                async: false
            }).done(function(res) {
                html = res;
            });
            // 在渲染模板之前需要先进行国际化内容处理
            if ($.i18n) {
                html = this.i18n(html);
            }
            return Hogan.compile(html);
        },

        getPageFullPath: function(relativePath, req) {
            var html = null;
            var pageFullPath = '';

            try {
                html = req('text!./' + relativePath + '.html');
            } catch (error) {
                pageFullPath = error.message.match('text!(.*).html')[1];
                pageFullPath = './' + pageFullPath;
            }

            return pageFullPath;
        },

        loadCompiledPage2: function(relativePath) {
            var html = null;
            try {
                html = req('text!./' + relativePath + '.html');
            } catch (error) {
                var modulePath = error.message.match('text!(.*).html')[1];
                modulePath = './' + modulePath + '.html';
                $.ajax({
                    url: modulePath,
                    dataType: 'html',
                    async: false,
                    cache: false
                }).done(function(res) {
                    html = res;
                });

                return Hogan.compile(html);
            }
        },

        refreshButtonAuth: function() {
            $('refreshButtonAuth').html();
        },

        getCurrentRoute: function() {
            var currentRoute = router.getRoute()[0];

            return currentRoute;
        },

        getEcharts: function() {
            var def = $.Deferred();

            req(
                [
                    'echarts'
                ],
                function(ec) {
                    def.resolve(ec);
                }
            );

            return def.promise();
        },

        setHeaderCount: function(options) {
            _.each(options, function(item) {
                var $countElem = $('.bh-header').find('a[href="#/' + item.router + '"]').find('.bh-headerBar-nav-item-tip');
                $countElem.html(item.count);
                if (!(item.hide === true) && item.count > 0) {
                    $countElem.show();
                } else {
                    $countElem.hide();
                }
            });
        },

        miniMode: function() {
            $('header').hide();
            $('footer').remove();
            $('main').css({
                'margin-top': '0',
                'max-width': 'none',
                'width': '100%',
                'padding': '0'
            });

            $(document).trigger('resize');
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

        getEcharts3: function($elem, option, isNotEmpty) {
            var def = $.Deferred();
            $elem = $($elem);

            req(
                [
                    'echarts'
                ],
                function(ec) {
                    var myChart = ec.init($elem[0]);

                    if (!isNotEmpty) {
                        //2021-9-7 国际化  王敏
                        $elem.html('<div style="display:table;width:100%;height:100%;"><div class="bh-color-primary-3" style="text-align:center;vertical-align:middle;display:table-cell;"><i class="iconfont" style="font-size:128px;">&#xe62a;</i><br><span class="h3" style="color:#999">'+$.i18n('bh-cd-noDatas')+'</span></div></div>');
                        def.reject(myChart);
                    }
                    myChart.setOption(option);
                    def.resolve(myChart);
                }
            );

            return def.promise();
        },

        getEcharts4: function($elem, option, isNotEmpty) {
            var def = $.Deferred();
            $elem = $($elem);

            req(
                [
                    'echarts4'
                ],
                function(ec) {
                    var myChart = ec.init($elem[0]);

                    if (!isNotEmpty) {
                        //2021-9-7 国际化  王敏
                        $elem.html('<div style="display:table;width:100%;height:100%;"><div class="bh-color-primary-3" style="text-align:center;vertical-align:middle;display:table-cell;"><i class="iconfont" style="font-size:128px;">&#xe62a;</i><br><span class="h3" style="color:#999">'+$.i18n('bh-cd-noDatas')+'</span></div></div>');
                        def.reject(myChart);
                    }
                    myChart.setOption(option);
                    def.resolve(myChart);
                }
            );

            return def.promise();
        },

        getConfig: function(key) {
            return configUtils[key];
        },

        switchModule: function(moduleName) {
            var baseUrl = location.href.replace(/\#.*/, "");
            location.href = baseUrl + '#/' + moduleName;
        },

        goto: function(path, blank) {
            var currentRoute = utils.getCurrentRoute();
            var baseUrl = location.href.replace(/\#.*/, "");

            if (blank) {
                window.open('#/' + path);
                return;
            }

            if (this.getPureRoute(path) === this.getPureRoute(currentRoute)) {
                location.href = baseUrl + '#/' + path;
                location.reload();
            } else {
                location.href = baseUrl + '#/' + path;
            }

        },

        go: function(path, blank) {
            utils.goto(path, blank)
        },

        getPureRoute: function(route) {
            return route.indexOf('/') > 0 ? route.substr(0, route.indexOf('/')) : route;
        },

        doAjax: function(url, params, method) {
            var deferred = $.Deferred();
            var feDebugMode = utils.getConfig('FE_DEBUG_MODE');

            if (typeof(url) === 'object') {
                return deferred.resolve(url);
            }

            if (feDebugMode) {
                method = 'GET';
            }

            if (_.endsWith(url, '.do') && feDebugMode) {
                log.error('正式开发环境需去掉config.js中的“FE_DEBUG_MODE”配置项！！！');
                return;
            }

            $(".app-ajax-loading").jqxLoader('open');

            $.ajax({
                type: method || 'POST',
                url: url,
                traditional: true,
                data: params || {},
                dataType: 'json',
                success: function(resp) {
                    try {
                        if (typeof resp == 'string') {
                            resp = JSON.parse(resp);
                        }
                        if (typeof resp.loginURL != 'undefined' && resp.loginURL != '') {
                            window.location.href = resp.loginURL;
                        }
                    } catch (e) {
                        log.error(e);
                    }
                    $(".app-ajax-loading").jqxLoader('close');
                    deferred.resolve(resp);
                },
                error: function(resp) {
                    $(".app-ajax-loading").jqxLoader('close');
                    deferred.reject(resp);
                }
            });
            return deferred.promise();
        },

        fetch: function(options) {
            var def = $.Deferred();
            if (!options.url) {
                return def.resolve(options.parser && options.parser());
            }
            utils.doAjax(options.url, options.data, options.method).done(function(res) {
                var result = options.parser(res) || res;
                def.resolve(result);
            }).fail(function(res) {
                def.reject(res);
            });

            return def.promise();
        },

        /**
         * 同步ajax方法
         * @param  {String} url    请求URL
         * @param  {Object} params 请求参数
         * @param  {String} method 请求方法
         */
        doSyncAjax: function(url, params, method) {
            var feDebugMode = utils.getConfig('FE_DEBUG_MODE');

            if (feDebugMode) {
                method = 'GET';
            }

            var resp = $.ajax({
                type: method || 'POST',
                url: url,
                traditional: true,
                data: params || {},
                dataType: 'json',
                cache: false,
                async: false,
                error: function(resp) {
                    // console.log("doSyncAjax error:----------");
                    // console.log(resp);
                    // console.log("----------:doSyncAjax error");
                    var result = JSON.parse(resp.responseText);
                    //console.log(result);
                    //如果未登录跳转至登录页面
                    if (typeof result.loginURL != 'undefined' && resp.loginURL != '') {
                        //console.log(result.loginURL);
                        window.location.href = result.loginURL;
                    }
                }
            });
            if (resp.status != 200) {
                return {};
            }
            var result = JSON.parse(resp.responseText);
            //如果未登录跳转至登录页面
            if (typeof result.loginURL != 'undefined' && resp.loginURL != '') {
                window.location.href = result.loginURL;
            }
            return result;
        },

        openModalDialog: function(options) {
            $(options.element).jqxWindow({
                width: options.width || 550,
                height: options.height || 220,
                closeButtonSize: 24,
                showCloseButton: true,
                resizable: false,
                autoOpen: false,
                draggable: false,
                isModal: true,
                title: options.title,
                content: options.content
            });
            $(options.element).addClass('global-dialog-instance');
            $(options.element).jqxWindow('open');
            $(options.element).find(options.closeElement).click(function() {
                $(options.element).jqxWindow('close');
            });
        },

        warningDialog: function(options) {
            if (!options) return;
            var buttonList = [{
                text: '确认'
                // className: 'bh-btn-warning'
            }, {
                text: '取消'
                // className: 'bh-btn-default'
            }];
            if (options.callback) {
                buttonList[0].callback = options.callback
            };

            var params = {
                iconType: 'warning',
                title: options.title,
                content: options.content,
                //qiyu 2017-11-22 按钮样式不允许外部传递，样式全控
                buttons: (options.buttons !== undefined ? options.buttons.map(function(item){
                    delete item.className;
                    return item;
                }) : buttonList)
            };
            if (options.height) {
                params["height"] = options.height;
            }
            if (options.width) {
                params["width"] = options.width;
            }
            $.bhDialog(params);
        },

        dialog: function(options) {

            var type = options.type || 'success',
                content = options.content,
                params = null,
                buttonList = [];

            var okClass = null,
                iconType = null;

            if (type == 'success' || type == 'done') {
//                 okClass = 'bh-btn-success';
                iconType = 'success';
            } else if (type == 'warn' || type == 'warning' || type == 'warning') {
//                 okClass = 'bh-btn-warning';
                iconType = 'warning';
            } else if (type == 'danger' || type == 'error') {
//                 okClass = 'bh-btn-danger';
                iconType = 'danger';
            } else if (type == 'confirm') {
//                 okClass = 'bh-btn-warning';
                iconType = 'warning';
            } else {
                return;
            }

            options.iconType = iconType;

            if (options.okCallback) {
                var okButtonInfo = {
                    text: options.okText || $.i18n('bh-edt-confirm'),//2021-9-7 国际化  王敏
//                     className: okClass,
                    callback: options.okCallback
                };
                buttonList.push(okButtonInfo);
            };

            if (options.cancelCallback) {
                var cancelButtonInfo = {
                    text: options.noText || options.cancelText || $.i18n('bh-edt-cancel')//2021-9-7 国际化  王敏
//                     className: 'bh-btn-default',
                    // callback: options.cancelCallback
                };
                buttonList.push(cancelButtonInfo);
            }

            if (options.okCallback && !options.cancelCallback && type == 'confirm') {
                buttonList.push({
                    text: options.noText || options.cancelText || $.i18n('bh-edt-cancel')//2021-9-7 国际化  王敏
//                     className: 'bh-btn-default'
                });
            }
            //qiyu 2017-11-22 按钮样式不允许外部传递，样式全控
            options.buttons = (options.buttons !== undefined ? options.buttonList.map(function(item){
                delete item.className;
                return item;
            }) : buttonList);

            //qiyu 2017-3-21 type会作为dialog的背景颜色，传递confirm导致对话框背景无颜色
            if (type == 'confirm') {
                options.type = "warning";
            }

            $.bhDialog(options);
        },

        /**
         * [window description]
         * @param  {[type]} options [content title buttons callback]
         * @return {[type]}         [description]
         */
        window: function(options) {

            var params = options.params || {};
            var title = options.title,
                content = options.content,
                btns = options.buttons || options.btns,
                callback = options.callback;
            if (options.width) {
                params.width = options.width;
            }
            if (options.height) {
                params.height = options.height;
            }
            if (options.inIframe) {
                params.inIframe = options.inIframe;
            }

            return BH_UTILS.bhWindow(content, title, btns, params, callback);
        },

        // i18n(bh_aq_search|搜索,{{aaa}},{{bbb}})
        // {
        //  bh_aq_search: 从{1}中搜索{2}
        // }
        i18n: function(html) {
            return html.replace(/i18n\([^\)]+\)/g, function(match) {
                var matchResult = match.match(/i18n\((\S+)\)/)[1]
                return BH_UTILS.i18n(matchResult)
            })
        },

        /**
         * getLangResource
         * 获取语言资源
         * @return {[type]} [description]
         */
        getLangResource: function() {
            var paths = location.pathname.split('/');
            var appName = paths[paths.indexOf('sys') + 1];
            var ctx = paths[1];
            var uri = '/' + ctx + '/i18n.do';
            var lang = utils.lang();
            return this.doAjax(uri, { appName: appName, EMAP_LANG: lang }, 'GET').done(function(resp) {
                if (resp.code === '0' && resp.datas) {
                    $.i18n().load(resp.datas, lang);
                    $.i18n({
                        locale: lang
                    });
                }
            });
        },

        /**
         * @method lang
         * @description 切换/获取语言
         * @param {String} [param] - 语言种类, 传参时为设置语言，可选值 zh en， 不传时则为获取当前语言
         */
        lang: function() {
            return BH_UTILS.lang.apply(BH_UTILS, arguments);
        },

        // bh_aq_search|搜索,{{aaa}},{{bbb}}
        // {
        //  bh_aq_search: 从{1}中搜索{2}
        // }
        bhI18n: function(str) {
            if (window.BH_UTILS && $.i18n) {
                str = str || '';
                return BH_UTILS.i18n(str);
            }
            return str;
        },
        getCurrentResUrl:function(name){
            var totalUrl = '';
            $('script').each(function(index,item){
                var tarSrc= item.src;
                if(tarSrc && tarSrc.indexOf('appcore')>-1){
                    totalUrl = tarSrc;
                    return false;
                }
            });
            //离线资源引用
            if (totalUrl && totalUrl.indexOf('appcore') > -1) {
                return totalUrl.split('/appcore')[0];
            }
        }
    };

    return utils;
});
