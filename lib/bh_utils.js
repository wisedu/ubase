/**
 * Created by Administrator on 2016/1/12.
 */
 ;
 (function(BH_UTILS, undefined) {
     var langStore = {
         zh: {
             'complete': '完成',
             'confirmSubmit': '确认并提交',
             'confirm': '确定',
             'cancel': '取消',
             'delete': '删除',
             'close': '关闭',
             'netError': '网络错误',
             'refreshPage': '您可以尝试刷新页面解决该问题',
             'dataError': '数据格式有误',
             'devTool': '具体内容请查看控制台',
             'title': '提示'
         },
         en: {
             'complete': 'Complete',
             'confirmSubmit': 'Confirm and sbumit',
             'confirm': 'Confirm',
             'cancel': 'Cancel',
             'delete': 'Delete',
             'close': 'Close',
             'netError': 'Nerwork Error',
             'refreshPage': 'You can try to refresh the page to solve the problem',
             'dataError': 'The data format is wrong',
             'devTool': 'See the console for details',
             'title': 'Prompt Message'
         }
     };
 
     var i18nLang = function(key) {
         var lang = BH_UTILS.getCurrentLang();
         if (langStore[lang]) {
             return langStore[lang][key] || key;
         }
         return key;
     };
 
     /**
      * 打开成功对话框
      * @param title 标题
      * @param content 内容
      * @param callback 回调函数
      * @param buttons 数组[{text:'完成',callback:options.callback}]
      */
     BH_UTILS.bhDialogInformation = function(options) {
         if (!options) {
             return;
         }
 
         var buttonList = [{
             text: i18nLang('confirm')
         },{
             text: i18nLang('cancel')
         }];
 
         //qiyu 2016-8-30 顺序调整，自定义列表的时候事件绑定不成功，报告人：秦天翔
         if (options.buttons&&options.buttons instanceof Array) {
             // buttonList = options.buttons;
             //qiyu 2017-11-22 按钮样式不允许外部传递，样式全控
             buttonList = options.buttons.map(function(item){
                 delete item.className;
                 return item;
             });
         }
         if (options.callback) {
             buttonList[0].callback = options.callback;
         }
 
         var params = {
             iconType: 'information',
             className: '',
             title: options.title?options.title:i18nLang('title'),
             content: options.content,
             subContent: options.subContent,
             buttons: buttonList,
             more:options.more
         };
         if (options.height) {
             params["height"] = options.height;
         }
         if (options.width) {
             params["width"] = options.width;
         }
         if (options.className) {
             params["className"] = options.className;
         }
         params["type"] = params["iconType"];
         $.bhDialog(params);
     };
     /**
      * 打开成功对话框
      * @param title 标题
      * @param content 内容
      * @param callback 回调函数
      * @param buttons 数组[{text:'完成',className:'bh-btn-success',callback:options.callback}]
      */
     BH_UTILS.bhDialogSuccess = function(options) {
         if (!options) {
             return;
         }
 
         var buttonList = [{
             text: i18nLang('confirm')
             // className: 'bh-btn-success'
         },{
             text: i18nLang('cancel')
         }];
 
         //qiyu 2016-8-30 顺序调整，自定义列表的时候事件绑定不成功，报告人：秦天翔
         if (options.buttons&&options.buttons instanceof Array) {
             // buttonList = options.buttons;
             //qiyu 2017-11-22 按钮样式不允许外部传递，样式全控
             buttonList = options.buttons.map(function(item){
                 delete item.className;
                 return item;
             });
         }
         if (options.callback) {
             buttonList[0].callback = options.callback;
         }
 
         var params = {
             iconType: 'success',
             className: '',
             title: options.title?options.title:i18nLang('title'),
             content: options.content,
             subContent: options.subContent,
             buttons: buttonList,
             more:options.more
         };
         if (options.height) {
             params["height"] = options.height;
         }
         if (options.width) {
             params["width"] = options.width;
         }
         if (options.className) {
             params["className"] = options.className;
         }
         params["type"] = params["iconType"];
         $.bhDialog(params);
     };
     /**
      * 打开警告对话框
      * @param title 标题
      * @param content 内容
      * @param callback 回调函数
      * @param buttons 数组
      */
     BH_UTILS.bhDialogWarning = function(options) {
         if (!options) {
             return;
         }
         var buttonList = [{
             text: i18nLang('confirm')
             // className: 'bh-btn-warning'
         }, {
             text: i18nLang('cancel')
             // className: 'bh-btn-default'
         }];
 
         //qiyu 2016-8-30 顺序调整，自定义列表的时候事件绑定不成功，报告人：秦天翔
         if (options.buttons&&options.buttons instanceof Array) {
             // buttonList = options.buttons
             //qiyu 2017-11-22 按钮样式不允许外部传递，样式全控
             buttonList = options.buttons.map(function(item){
                 delete item.className;
                 return item;
             });
         }
         if (options.callback) {
             buttonList[0].callback = options.callback;
         }
 
         var params = {
             iconType: 'warning',
             title: options.title?options.title:i18nLang('title'),
             content: options.content,
             subContent: options.subContent,
             buttons: buttonList,
             className: '',
             more:options.more
         };
         if (options.height) {
             params["height"] = options.height;
         }
         if (options.width) {
             params["width"] = options.width;
         }
         if (options.className) {
             params["className"] = options.className;
         }
         params["type"] = params["iconType"];
         $.bhDialog(params);
     };
 
     /**
      * 打开危险对话框
      * @param title 标题
      * @param content 内容
      * @param callback 回调函数
      * @param buttons 数组
      */
     BH_UTILS.bhDialogDanger = function(options) {
         if (!options) {
             return;
         }
         var buttonList = [{
             text: i18nLang('confirm')
             // className: 'bh-btn-danger'
         }, {
             text: i18nLang('cancel')
             // className: 'bh-btn-default'
         }];
 
         //qiyu 2016-8-30 顺序调整，自定义列表的时候事件绑定不成功，报告人：秦天翔
         if (options.buttons&&options.buttons instanceof Array) {
             // buttonList = options.buttons;
             //qiyu 2017-11-22 按钮样式不允许外部传递，样式全控
             buttonList = options.buttons.map(function(item){
                 delete item.className;
                 return item;
             });
         }
         if (options.callback) {
             buttonList[0].callback = options.callback;
         }
 
         var params = {
             iconType: 'danger',
             title: options.title?options.title:i18nLang('title'),
             content: options.content,
             subContent: options.subContent,
             buttons: buttonList,
             className: '',
             more:options.more
         };
         if (options.height) {
             params["height"] = options.height;
         }
         if (options.width) {
             params["width"] = options.width;
         }
         if (options.className) {
             params["className"] = options.className;
         }
         params["type"] = params["iconType"];
         $.bhDialog(params);
     };
 
     /**
      * @method bhWindow
      * @description 模态弹窗
      * @param {String|Object} content - 弹窗内容
      * @param {String} title - 弹窗标题
      */
     BH_UTILS.bhWindow = function(content, title, btns_def, params, callback) {
         params = params || {};
         var closeCb;
         var $dom = $('<div>' +
             '<div class="head"></div>' +
             '<div>' +
             '<div class="content"></div>' +
             //qiyu 2016-12-15 按钮距底边调整为24px，与1.2规范一致
             // '<div id="buttons" style="position: absolute;bottom:32px;width: 100%;left: 0;float: right;padding: 0 24px;">' +
             '<div id="buttons" style="position: absolute;bottom:24px;width: 100%;left: 0;float: right;padding: 0 24px;">' +
             '<hr style="border:none;border-top: 1px solid #efefef;margin-bottom: 10px;">' +
             '</div>' +
             '</div>' +
             '</div>').css({
             "padding-bottom": "72px"
         });
 
         $dom.width((parseInt(params.width) || 500) - 50);
 
         $('body').append($dom);
         $(".head", $dom).append($("<h3></h3>").append(title));
         $(".content", $dom).append(content);
 
         $dom.on("open", function() {
             //qiyu 2016-6-15 无法锁定顶级弹窗的屏幕滚动，nicescroll无法消除
 
             // try{
             //     $('body', top.window.document).getNiceScroll().remove();
             //     $('body', top.window.document).css(lockcss);
             // }catch(e){
             //     //跨域异常处理
             //     $('body').getNiceScroll().remove();
             //     $('body').css(lockcss);
             // }
 
             //qiyu 2016-9-6 页面不使用nicescroll，弹出窗重置原生滚动条
             BH_UTILS.hideScrollbar();
             //$('body').getNiceScroll().remove();
             $('body').addClass("bh-has-modal-body");
         });
 
         if (params.close) {
             closeCb = params.close;
         }
         $dom.on("close", function() {
             // 如果存在弹出的popover则先关闭popover后再继续
             if ($('#bhPopover').length > 0) {
               // 针对王星光教职工综合查询做兼容处理，改造后的条件构造器不需要关闭popover
               if (!$.fn.emapRulesConstructor2) {
                 $.bhPopOver.close()
               }
             }
 
             // 关闭弹框钱销毁弹框内的表单实例
             var formObj = $('.bh-form-horizontal', $dom);
             if (formObj.length > 0) {
                 try {
                     formObj.parent().emapForm('destroy');
                 } catch (e) {
                     console.log(e);
                 }
             }
             $dom.jqxWindow('destroy');
             //qiyu 2016-6-15 无法锁定顶级弹窗的屏幕滚动，nicescroll无法消除
             // try{
             //     $('body', top.window.document).niceScroll();
             // }catch(e){
             //     //跨域异常处理
             //     $('body').niceScroll();
             // }
 
             //qiyu 2016-9-6 页面不使用nicescroll，弹出窗重置原生滚动条
             // $('body').niceScroll();
 
             $('body').removeClass("bh-has-modal-body");
             BH_UTILS.showScrollbar();
 
 
             //$('body').css({overflow:'hidden'});
 
             //qiyu 2016-7-12 关闭回调执行，发现者：朱忠宇
             closeCb && closeCb();
         });
 
         var btns = btns_def || [{
             text: i18nLang('confirm'),
             className: 'bh-btn-primary',
             callback: callback
         }, {
             text: i18nLang('cancel'),
             className: 'bh-btn-default',
             callback: function($dom, e) {
                 closeCb && closeCb($dom, e);
                 $dom.jqxWindow('close');
             }
         }];
 
         for (var i = btns.length - 1; i >= 0; i--) {
             //qiyu 2016-8-17 ie9、ie10时，回车会误触发。需求人：张丹
             // var btn = $('<a href="javascript:void(0);" class="bh-btn ' + btns[i].className + ' bh-pull-right">' + btns[i].text + '</a>');
             var btn = $('<button type="button" class="bh-btn ' + btns[i].className + ' bh-pull-right">' + btns[i].text + '</button>');
             if (btns[i].callback) {
                 var cb = btns[i].callback;
                 btn.data("callback", cb);
                 btn.click(function(e) {
                     e.stopPropagation();
                     var cb = $(this).data("callback");
                     var needClose = cb.apply($dom, [$dom, e]);
                     if (needClose !== false) {
                         $dom.jqxWindow('close');
                     }
                 });
             }
             $("#buttons", $dom).append(btn);
         }
         if (btns.length == 0) {
             $("#buttons", $dom).hide();
             $dom.css({
                 "padding-bottom": "24px"
             });
         }
 
         if (params.height == "auto") {
             params.height = $dom.height() + 142;
         }
 
         var winParams = $.extend({
             resizable: false,
             isModal: true,
             modalOpacity: 0.3,
             height: params.height || 600,
             width: params.width || 500,
             zIndex: params.zIndex || 18001,
             maxHeight: 1000,
             maxWidth: 1000,
             autoOpen: false,
             inIframe: false
         }, params);
 
         //qiyu 2016-6-6 在window前面增加top.，用于解决在iframe中，弹窗仍然可以处于屏幕显示位置，帆软报表点击更多，需求人：汪维亮
         //winParams.position = [window.innerWidth / 2 - parseInt(winParams.width, 10) / 2, window.innerHeight / 2 + $(window).scrollTop() - parseInt(winParams.height, 10) / 2];
         var iframe_top = 0;
         if (winParams.inIframe) {
             var $iframeEle = $(window.frameElement);
             if ($iframeEle.length > 0) {
                 iframe_top = $iframeEle.offset().top;
             }
         }
         //qiyu 2016-6-15 弹窗锁定顶级的屏幕滚动
         var height = 0;
         var $outWin = null;
         try {
             //qiyu 2016-12-1 教职工查询统计中使用帆软报表，查询结果中的自定义显示列，由于iframe嵌套，但仅希望在iframe里面垂直居中。需求人：王维亮
             // height = top.window.innerHeight;
             // $outWin = $(top.window);
             if (winParams.inIframe) {
                 height = top.window.innerHeight;
                 $outWin = $(top.window);
             } else {
                 height = window.innerHeight;
                 $outWin = $(window);
             }
         } catch (e) {
             //跨域异常处理,AMP中会调用该功能
             height = window.innerHeight;
             $outWin = $(window);
         }
         delete winParams.inIframe;
 
         if (!winParams.position) {
             winParams.position = [window.innerWidth / 2 - parseInt(winParams.width, 10) / 2, height / 2 - iframe_top + $outWin.scrollTop() - parseInt(winParams.height, 10) / 2];
         }
 
         if (winParams.close) {
             delete winParams.close;
         }
         $dom.jqxWindow(winParams).jqxWindow('open');
         $(".content", $dom).parent().niceScroll();
         BH_UTILS.bhWindow.close = function() {
             $dom.jqxWindow('close');
         };
 
         return $dom;
     };
 
     /**
      * ajax请求公共方法-promise方式调用
      * @param  {String} url    请求URL
      * @param  {Object} params 请求参数
      * @param  {String} method 请求方法
      * @param  {Object} requestOption 请求配置
      * @return {Promise}
      */
     BH_UTILS.doAjax = function(url, params, method, requestOption) {
         //qiyu 2017-1-11 增加requestOption请求配置
         var deferred = $.Deferred();
         requestOption = requestOption || {};
         var ajaxOptions = $.extend({}, {
             type: method || 'POST',
             url: url,
             //traditional: true,
             data: params || {},
             dataType: 'json',
             success: function(resp) {
                 // console.log("doAjax success:----------");
                 // console.log(resp);
                 // console.log("-----------:doAjax success");
                 //如果未登录跳转至登录页面
                 try {
                     if (typeof resp == 'string') {
                         resp = JSON.parse(resp);
                     }
                     if (typeof resp.loginURL != 'undefined' && resp.loginURL != '') {
                         window.location.href = resp.loginURL;
                     }
                 } catch (e) {
                     //console.log(e);
                 }
 
                 deferred.resolve(resp);
             },
             error: function(resp) {
                 // console.log("doAjax error:----------");
                 // console.log(resp);
                 // console.log("-----------:doAjax error");
                 //如果未登录跳转至登录页面
                 //2016-04-19 qiyu 未登录则刷新页
                 if (resp.status == 401 || resp.status == 403) {
                     //qiyu 2016-10-9 XQGL-1482
                     // window.location.reload();
                     console.error("请求返回异常，请检查network：" + resp.status);
                 }
                 //qiyu 2016-5-26 长时间不操作出现异常，给予提示
                 if (resp.statusText.indexOf("NetworkError") > -1) {
                     BH_UTILS.bhDialogDanger({
                         title: i18nLang('netError'),
                         content: i18nLang('refreshPage'),
                         buttons: [{
                             text: i18nLang('close'),
                             className: 'bh-btn-default'
                         }]
                     });
                 }
 
                 // qiyu 2016-5-9 出现异常，不是JSON格式，反馈者：韩冠兰
                 // var result = JSON.parse(resp.responseText);
                 // if(typeof result.loginURL != 'undefined' && resp.loginURL != ''){
                 //     window.location.href = result.loginURL;
                 // }
                 deferred.reject(resp);
             }
         }, requestOption);
 
         $.ajax(ajaxOptions);
         return deferred.promise();
     };
 
     /**
      * 同步ajax方法
      * @param  {String} url    请求URL
      * @param  {Object} params 请求参数
      * @param  {String} method 请求方法
      * @param  {Object} requestOption 请求配置
      */
     BH_UTILS.doSyncAjax = function(url, params, method, requestOption) {
         requestOption = requestOption || {};
         var ajaxOptions = $.extend({}, {
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
 
                 // qiyu 2016-5-9 出现异常，不是JSON格式，反馈者：韩冠兰
                 /*
                  var result = JSON.parse(resp.responseText);
                  //console.log(result);
                  //如果未登录跳转至登录页面
                  if(typeof result.loginURL != 'undefined' && resp.loginURL != ''){
                  //console.log(result.loginURL);
                  window.location.href = result.loginURL;
                  }*/
 
                 //qiyu 2016-5-26 长时间不操作出现异常，给予提示
                 if (resp.statusText.indexOf("NetworkError") > -1) {
                     BH_UTILS.bhDialogDanger({
                         title: i18nLang('netError'),
                         content: i18nLang('refreshPage'),
                         buttons: [{
                             text: i18nLang('close'),
                             className: 'bh-btn-default'
                         }]
                     });
                 }
             }
         }, requestOption);
         var resp = $.ajax(ajaxOptions);
         //2016-04-19 qiyu 未登录则刷新页
         if (resp.status == 401 || resp.status == 403) {
             //qiyu 2016-10-9 XQGL-1482
             // window.location.reload();
             console.error("请求返回异常，请检查network：" + resp.status);
         }
         if (resp.status != 200) {
             return {};
         }
 
 
         var result;
         try {
             result = JSON.parse(resp.responseText);
         } catch (e) {
             //qiyu 2016-12-26 转换异常，终止程序
             BH_UTILS.bhDialogDanger({
                 title: i18nLang('dataError'),
                 content: i18nLang('devTool'),
                 buttons: [{
                     text: i18nLang('close'),
                     className: 'bh-btn-default'
                 }]
             });
             console && console.error("数据格式有误，后台返回的数据无法转换为JSON格式：“" + resp.responseText + "”");
             throw e;
         }
         //如果未登录跳转至登录页面
         if (typeof result.loginURL != 'undefined' && resp.loginURL != '') {
             window.location.href = result.loginURL;
         }
         return result;
     };
 
     /**
      * 异步jsonp方式ajax调用
      * @param  {String} url    请求URL
      * @param  {Object} params 请求参数
      */
     BH_UTILS.doAjaxP = function(url, params) {
         var deferred = $.Deferred();
         $.ajax({
             type: 'GET',
             url: url,
             traditional: true,
             data: params || {},
             dataType: 'jsonp',
             jsonp: 'jsonpcallback',
             success: function(resp) {
                 //如果未登录跳转至登录页面
                 try {
                     if (typeof resp == 'string') {
                         resp = JSON.parse(resp);
                     }
                     if (typeof resp.loginURL != 'undefined' && resp.loginURL != '') {
                         window.location.href = resp.loginURL;
                     }
                 } catch (e) {
                     //console.log(e);
                 }
                 deferred.resolve(resp);
             },
             error: function(resp) {
                 //如果未登录跳转至登录页面
                 //2016-04-19 qiyu 未登录则刷新页
                 if (resp.status == 401 || resp.status == 403) {
                     //qiyu 2016-10-9 XQGL-1482
                     // window.location.reload();
                     console.error("请求返回异常，请检查network：" + resp.status);
                 }
                 //qiyu 2016-5-26 长时间不操作出现异常，给予提示
                 if (resp.statusText.indexOf("NetworkError") > -1) {
                     BH_UTILS.bhDialogDanger({
                         title: i18nLang('netError'),
                         content: i18nLang('refreshPage'),
                         buttons: [{
                             text: i18nLang('close'),
                             className: 'bh-btn-default'
                         }]
                     });
                 }
 
                 // qiyu 2016-5-9 出现异常，不是JSON格式，反馈者：韩冠兰
                 // var result = JSON.parse(resp.responseText);
                 // if(typeof result.loginURL != 'undefined' && resp.loginURL != ''){
                 //     window.location.href = result.loginURL;
                 // }
                 deferred.reject(resp);
             }
         });
         return deferred.promise();
     };
 
     /**
      * 同步jsonp方式ajax调用
      * @param  {String} url    请求URL
      * @param  {Object} params 请求参数
      */
     BH_UTILS.doSyncAjaxP = function(url, params, method) {
         var resp = $.ajax({
             type: 'GET',
             url: url,
             traditional: true,
             data: params || {},
             dataType: 'jsonp',
             cache: false,
             jsonp: 'jsonpcallback',
             async: false,
             error: function(resp) {
                 //如果未登录跳转至登录页面
                 //2016-04-19 qiyu 未登录则刷新页
                 if (resp.status == 401 || resp.status == 403) {
                     //qiyu 2016-10-9 XQGL-1482
                     // window.location.reload();
                     console.error("请求返回异常，请检查network：" + resp.status);
                 }
                 //qiyu 2016-5-26 长时间不操作出现异常，给予提示
                 if (resp.statusText.indexOf("NetworkError") > -1) {
                     BH_UTILS.bhDialogDanger({
                         title: i18nLang('netError'),
                         content: i18nLang('refreshPage'),
                         buttons: [{
                             text: i18nLang('close'),
                             className: 'bh-btn-default'
                         }]
                     });
                 }
 
                 // qiyu 2016-5-9 出现异常，不是JSON格式，反馈者：韩冠兰
                 // var result = JSON.parse(resp.responseText);
                 // if(typeof result.loginURL != 'undefined' && resp.loginURL != ''){
                 //     window.location.href = result.loginURL;
                 // }
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
     };
 
     /**
      * 同步方式获取html片段
      * @return {String} 
      */
     BH_UTILS.getHTML = function(url, params) {
         var resp = $.ajax({
             type: 'GET',
             url: url,
             //traditional: true,
             cache: false,
             data: params || {},
             //accepts: 'text/html;charset=utf-8',
             //dataType: 'html',
             //contentType: 'text/html;charset=utf-8',
             async: false,
             error: function(resp) {
 
             } //,
             // beforeSend: function( xhr ) {
             //     xhr.overrideMimeType("Content-type:text/html; charset=utf-8" );
             // }
         });
         //console.log("-------BH_UTILS.getHTML:---------\n" + resp.responseText);
         if (resp.status != 200) {
             return 404;
         }
         return resp.responseText;
     };
 
 
     /* -----------------------业务相关公共方法------------------------ */
 
     /**
      * 设置表格列宽
      * @param $tablePlaceholder 表格初始化的div
      * @param specifyColumnWidthList 要设置的列宽数组["34px", 1, 1, 1, 1, 1, 2, 2, 1], 只能是固定列宽和各列的占比，或只有占比,不能使用百分比
      * @param getType 获取返回数据类型， 默认返回百分比与像素混合的数据，“px”是返回像素数据，"percent"返回百分比数据
      * @returns {*} 返回计算后的各列宽数组["34px", "155px", "155px", "155px", "155px", "155px", "310px", "310px", "155px"]
      */
     BH_UTILS.getTableColWidth = function($tablePlaceholder, specifyColumnWidthList, getType) {
         var tableWidth = getTableWidth($tablePlaceholder);
         var specifyColumnLen = specifyColumnWidthList.length;
         var computeColumnCount = 0; //统计按占比分配的列数
         var fixedWidthCount = 0; //统计用户设置列宽的总和
         for (var i = 0; i < specifyColumnLen; i++) {
             var item = specifyColumnWidthList[i];
             if (typeof(item) !== "string") {
                 computeColumnCount += item;
             } else {
                 fixedWidthCount += parseInt(item, 10);
             }
         }
 
         var computeTableWidth = tableWidth - fixedWidthCount; //去掉用户设置列宽的剩余宽度
         var oneColWidth = computeTableWidth / computeColumnCount; //单个占比的宽度
         //换算各个占比的数据
         for (var i = 0; i < specifyColumnLen; i++) {
             var item = specifyColumnWidthList[i];
             if (!getType) {
                 //返回混合数据的处理
                 if (typeof(item) !== "string") {
                     //将占比类型的换算成百分比
                     specifyColumnWidthList[i] = parseFloat((parseFloat(item * oneColWidth) / tableWidth) * 100) + "%";
                 }
             } else if (getType === "px") {
                 //返回像素数据的处理
                 if (typeof(item) !== "string") {
                     //将占比类型的换算成像素
                     specifyColumnWidthList[i] = parseFloat(item * oneColWidth) + "px";
                 }
             } else {
                 //返回百分比数据的处理
                 if (typeof(item) !== "string") {
                     //将占比类型的换算成百分比
                     specifyColumnWidthList[i] = parseFloat((parseFloat(item * oneColWidth) / tableWidth) * 100) + "%";
                 } else {
                     //将像素类型的换算成百分比
                     specifyColumnWidthList[i] = parseFloat((parseInt(item, 10) / tableWidth) * 100) + "%";
                 }
             }
         }
 
         return specifyColumnWidthList;
     };
 
     /**
      * 当前container没有宽度则获取其父层的宽度
      * @param $container
      * @returns {*}
      */
     function getTableWidth($container) {
         var _width = $container.width();
         if (!_width) {
             return getTableWidth($container.parent());
         } else {
             return _width;
         }
     }
 
     /**
      * 根据行数设定table高度
      * @param rowCount 行数
      * @param hasHScroll 是否出现了横向滚动条
      * @param rowHeight 每行的高度，默认27px
      * @returns {number}
      */
     BH_UTILS.getTableHeight = function(rowCount, hasHScroll, rowHeight) {
         var oneRowHeight = rowHeight ? parseInt(rowHeight, 10) : 27; //内容行高
         var headerRowHeight = 29; //头部行高
         var footerHeight = 39; //39是翻页的固定高度
         if (hasHScroll) {
             footerHeight += 20; //20是table横向滚动条的高度
         }
         var tableHeight = oneRowHeight * rowCount + headerRowHeight + footerHeight;
         return tableHeight;
     };
 
 
     /**
      * 给节点设置数据
      * 要求要设置数据的节点必须给dom节点设置属性 sc-data-field 其值要与设置数据的key保持一致
      * 默认使用属性 sc-data-field ，亦可自定义
      * 如给input设置time值 data={"time":"2016"} <input type="text" sc-data-field="time" />
      * container 要设置数据的容器
      * data 要设置的数据
      * @param data
      */
     BH_UTILS.setHtmlData = function(data) {
         var $container = data.container;
         var datas = data.data;
         var fieldKey = data.key ? data.key : "sc-data-field";
         var $toSetDataItems = $container.find("[" + fieldKey + "]");
         $toSetDataItems.each(function() {
             var $item = $(this);
             var tagName = $item[0].tagName.toLocaleLowerCase();
             var fieldName = $item.attr(fieldKey);
             var fieldValue = datas[fieldName] ? datas[fieldName] : "";
             if (tagName === "input" || tagName === "textarea" || tagName === "select") {
                 $item.val(fieldValue);
             } else {
                 $item.text(fieldValue);
             }
         });
     };
 
     /**
      * 获取节点数据
      * container 要获取数据的容器
      * @param data
      */
     BH_UTILS.getHtmlData = function(data) {
         var $container = data.container;
         var fieldKey = data.key ? data.key : "sc-data-field";
         var $toGetDataItems = $container.find("[" + fieldKey + "]");
         var datas = {};
         $toGetDataItems.each(function() {
             var $item = $(this);
             var tagName = $item[0].tagName.toLocaleLowerCase();
             var fieldName = $item.attr(fieldKey);
             if (tagName === "input" || tagName === "textarea" || tagName === "select") {
                 datas[fieldName] = $item.val();
             } else {
                 datas[fieldName] = $item.text();
             }
         });
         return datas;
     };
 
     /**
      * 清除节点数据
      * container 要设置数据的容器
      * @param data
      */
     BH_UTILS.clearHtmlData = function(data) {
         var $container = data.container;
         var fieldKey = data.key ? data.key : "sc-data-field";
         var $toSetDataItems = $container.find("[" + fieldKey + "]");
         $toSetDataItems.each(function() {
             var $item = $(this);
             var tagName = $item[0].tagName.toLocaleLowerCase();
             if (tagName === "input" || tagName === "textarea" || tagName === "select") {
                 $item.val("");
             } else {
                 $item.text("");
             }
         });
     };
 
     /**
      * 创建guid
      * @returns {string}
      * @constructor
      */
     BH_UTILS.NewGuid = function() {
         return (G4() + G4() + "-" + G4() + "-" + G4() + "-" + G4() + "-" + G4() + G4() + G4());
     };
 
 
     function G4() {
         return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
     }
 
     BH_UTILS.getUUID = function() {
         return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
     };
 
     function S4() {
         return (((1 + Math.random()) * 0x10000) | 0).toString(32);
     }
 
     /**
      * {
      *   "logo":"public/images/demo/logo.png",
      *   "title": "校内调动",
      *   "icons": ["icon-apps"], 
      *   "userImage": "public/images/demo/user1.png",
      *   "nav":[
      *       {"title":"校内调动", "className": "sc-transfer", "active":true}, 
      *       {"title":"调动历史", "className": "his-transfer"}
      *   ]
      * };
      */
     BH_UTILS.initHeader = function(headData, currHash, oldHash) {
 
         headData.nav = [];
         var keep = false;
         for (var i = 0; i < headData.navGroup.length; i++) {
             var filtered = headData.navGroup[i].filter(function(item) {
                 if (item.href == currHash) {
                     item.active = true;
                     return true;
                 } else {
                     item.active = false;
                 }
             });
             var oldItem = headData.navGroup[i].filter(function(item) {
                 if (item.href == oldHash) {
                     keep = true;
                 }
             });
             if (filtered.length > 0) {
                 headData.nav = headData.navGroup[i];
             }
         }
         if (!keep) {
             $('#headerPlaceholder').empty();
             $('#headerPlaceholder').bhHeader(headData);
         }
     };
 
     /**
      * 渲染头部，专用于简化版框架
      * @return {[type]} [description]
      */
     BH_UTILS.renderHeader = function() {
         var headerData;
         if (typeof WIS_CONFIG.HEADER_URL != 'undefined' && WIS_CONFIG.HEADER_URL != '') {
             headerData = BH_UTILS.doSyncAjax(WIS_CONFIG.HEADER_URL);
             headerData = $.extend(WIS_CONFIG.HEADER, headerData);
         } else {
             headerData = WIS_CONFIG.HEADER;
         }
         var hash = window.location.hash;
         if (hash.indexOf('?') != -1) {
             hash = hash.substring(0, hash.indexOf('?'));
         }
         if (hash != '#/' && hash != '' && hash.indexOf('_target_') == -1) {
             for (var i = 0; i < headerData.nav.length; i++) {
                 headerData.nav[i].active = false;
                 if (hash == headerData.nav[i].href) {
                     headerData.nav[i].active = true;
                 }
             }
         }
         $('#headerPlaceholder').bhHeader(headerData);
     };
 
     BH_UTILS.initFooter = function(text) {
         $("#footerPlaceholder").bhFooter({
             text: text || "版权信息：© 2015 江苏金智教育信息股份有限公司 苏ICP备10204514号"
         });
     };
 
     //给容器设定最小高度
     BH_UTILS.setContentMinHeight = function($setContainer, type, diff) {
         if ($setContainer && $setContainer.length > 0) {
             diff = diff ? diff : 0;
             var $window = $(window);
             var windowHeight = $window.height();
             var footerHeight = $("[bh-footer-role=footer]").outerHeight()||0;
             var headerHeight = $("[bh-header-role=bhHeader]").outerHeight()||0;
             var minHeight = 0;
             if (type === "noHeader") {
                 minHeight = windowHeight - footerHeight - diff - 1;
             } else {
                 minHeight = windowHeight - headerHeight - footerHeight - diff - 1;
             }
 
             $setContainer.css("min-height", minHeight + "px");
         }
     };
 
     //获取浏览器最小高度
     BH_UTILS.getWindowMinHeight = function(type) {
         var $window = $(window);
         var windowHeight = $window.height();
         var footerHeight = $("[bh-footer-role=footer]").outerHeight()||0;
         var headerHeight = $("[bh-header-role=bhHeader]").outerHeight()||0;
         var minHeight = windowHeight - headerHeight - footerHeight - diff - 1;
         return minHeight;
     };
 
     BH_UTILS.namespace = function(ns) {
         window.BH_NS = window.BH_NS || {};
         var parts = ns.split('.'),
             object = window.BH_NS,
             i, len;
 
         for (i = 0, len = parts.length; i < len; i++) {
             if (!object[parts[i]]) {
                 object[parts[i]] = {};
             }
             object = object[parts[i]];
         }
         return object;
     };
 
     //处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
     BH_UTILS.banBackSpace = function(e) {
         var ev = e || window.event; //获取event对象
         var obj = ev.target || ev.srcElement; //获取事件源
         var t = obj.type || obj.getAttribute('type'); //获取事件源类型
 
         if (ev.keyCode == 8 && $(obj).hasClass('note-editable')) return;
 
         //获取作为判断条件的事件类型
         var vReadOnly = obj.getAttribute('readonly');
         var vEnabled = obj.getAttribute('enabled');
         //处理null值情况
         vReadOnly = (vReadOnly == null) ? false : vReadOnly;
         vEnabled = (vEnabled == null) ? true : vEnabled;
 
         //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
         //并且readonly属性为true或enabled属性为false的，则退格键失效
         var flag1 = (ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea" || t == "email" || t == "search" || t == "url" || t == "tel" || t == "number") && (vReadOnly == true || vEnabled != true)) ? true : false;
 
         //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
         var flag2 = (ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea" && t != "email" && t != "search" && t != "url" && t != "tel" && t != "number") ? true : false;
 
         //判断
         if (flag2) {
             return false;
         }
         if (flag1) {
             return false;
         }
     };
 
     //全局变量 用于组件或模块之间传值
     var _GLOBAL_OBJ_KEY = '_WISEDU_GLOBAL_OBJ_2016';
     window[_GLOBAL_OBJ_KEY] = {};
 
     /**
      * 预编译模版
      * @param  {String} tplUrl 请求模版地址[必选]
      * @return {Function} 编译后生成的函数
      */
     BH_UTILS.compileTpl = function(tplUrl) {
         var tplSource = _getTpl(tplUrl);
         //预编译模板
         var tpl = Handlebars.compile(tplSource);
         return tpl;
     };
 
     /**
      * 预编译模版,为兼容老版本，保留上述compileTpl函数
      * @param  {String} tplUrl 请求模版地址[必选]
      * @return {String} 编译后生成的html
      */
     BH_UTILS.compileTemplate = function(tplUrl, obj) {
         var tplSource = _getTpl(tplUrl);
         //预编译模板
         var tpl = Handlebars.compile(tplSource);
         obj = (typeof obj == 'undefined' || obj == null || obj == '') ? {} : obj;
         return tpl(obj);
     };
 
     /**
      * 组件或模块之间传值时使用，设置数据
      * @param {String} key 键
      * @param {任意类型} obj 值
      */
     BH_UTILS.setData = function(key, obj) {
         window[_GLOBAL_OBJ_KEY][key] = obj;
     };
 
     /**
      * 组件或模块之间传值时使用，根据key获取数据
      * 注意在使用的地方保存获取的值，考虑内存优化，默认全局对象中的值只能被获取一次，随即删除
      * flag默认不需要传值，如果传true，则不自动删除该全局对象值，在用完该全局对象后必须手动调用clearData方法手动清除全局变量
      * @param {String} key 键
      * @return key对应的值
      */
     BH_UTILS.getData = function(key, flag) {
         var obj = _.cloneDeep(window[_GLOBAL_OBJ_KEY][key]);
         if (flag !== true) {
             delete window[_GLOBAL_OBJ_KEY][key];
         }
         return obj;
     };
 
     /**
      * 手动清除全局变量
      */
     BH_UTILS.clearData = function(key) {
         delete window[_GLOBAL_OBJ_KEY][key];
     };
 
     /**
      * 生成首页html布局
      */
     BH_UTILS.genMainLayout = function() {
         var layout = '<div id="headerPlaceholder"></div>' +
             '<div class="sc-container-outerFrame">' +
             '<div class="sc-container" bh-container-role="container">' +
             '<div id="bodyPlaceholder"></div>' +
             '</div>' +
             '</div>' +
             '<div id="footerPlaceholder"></div>' +
             '<div id="levityPlaceholder"></div>';
 
         $('body').prepend(layout);
     };
 
     /**
      * 添加水波纹效果
      */
     BH_UTILS.wavesInit = function() {
         if (typeof(Waves) !== "undefined") {
             Waves.attach('.bh-btn:not(.bh-disabled):not([disabled])');
             Waves.init();
         }
     };
 
     /*------------------------------ 私有函数 -------------------------------*/
     /**
      * 获取html模版片段
      * @param  {String} url    请求模版地址[必选]
      * @return {String}        模版片段String
      */
     function _getTpl(url) {
         var resp = $.ajax({
             type: 'GET',
             url: url,
             //traditional: true,
             cache: false,
             data: {},
             contentType: 'text/html; charset=utf-8;',
             dataType: 'html',
             async: false,
             error: function(resp) {}
         });
 
         return resp.responseText;
     }
 
     /**
      * 检查图片加载是否完成
      * @param $dom 图片所在的img标签对象
      * @returns {*}
      */
     BH_UTILS.checkImageLoadComplete = function($dom) {
         var dfd = $.Deferred();
         $dom.bind('load', function(e) {
             dfd.resolve($dom);
         }).bind('error', function(e) {
             //图片加载错误，加入错误处理
             dfd.reject(e, $dom);
         });
         return dfd.promise();
     };
 
     /**
      * 获取节点的上下左右宽高值
      * @param $item
      * @returns {{left: *, top: number, right: *, bottom: *, height: *, width: *}}
      */
     BH_UTILS.getElementPosition = function($item) {
         var offset = $item.offset();
         var left = offset.left;
         var top = offset.top;
         var width = $item.outerWidth();
         var height = $item.outerHeight()||0;
         var right = left + width;
         var bottom = top + height;
         return {
             "left": left,
             "top": top,
             "right": right,
             "bottom": bottom,
             "height": height,
             "width": width
         };
     };
 
     //参数可参照bhStar组件
     BH_UTILS.getStarHtml = function(data) {
         var score = parseInt(data.score, 10);
         var starItemStyle = '';
         if (data.size) {
             starItemStyle = 'font-size: ' + data.size + 'px';
         }
         var html = '';
         for (var i = 0; i < 5; i++) {
             if (i + 1 <= score) {
                 html += '<i class="iconfont icon-star" style="' + starItemStyle + '"></i>';
             } else {
                 html += '<i class="iconfont icon-staroutline" style="' + starItemStyle + '"></i>';
             }
         }
         var starClass = data.starClass ? data.starClass : "";
         html = '<div class="bh-star-list ' + starClass + '">' + html + '</div>';
 
         var scoreNumHtml = '';
         if (data.isShowNum) {
             scoreNumHtml = '<span class="' + data.textClass + '">' + score + data.text + '</span>';
         }
         return '<div class="bh-star">' + html + scoreNumHtml + '</div>';
     };
 
     BH_UTILS.placeholder = function() {
         if (document.mode == 9) {
 
         }
     };
 
     BH_UTILS.clearTextSelect = function() {
         if ("getSelection" in window) {
             window.getSelection().removeAllRanges();
         } else {
             document.selection.empty();
         }
     };
 
     //qiyu 2016-12-1 增加判断浏览器滚动条隐藏时，自动留白的功能
     // var _originalBodyPad = 0;
     BH_UTILS.hideScrollbar = function() {
         function _measureScrollbar() { // thx walsh
             var scrollDiv = document.createElement('div');
             scrollDiv.className = 'bh-modal-scrollbar-measure';
             $("body").append(scrollDiv);
             var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
             $("body")[0].removeChild(scrollDiv);
             return scrollbarWidth;
         }
 
         var fullWindowWidth = window.innerWidth;
         if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
             var documentElementRect = document.documentElement.getBoundingClientRect();
             fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
         }
         var bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
         var scrollbarWidth = _measureScrollbar();
         //qiyu 2017-3-1 解决在弹窗后，再异步调用dailog，会出现padding-right不断增大的问题
         var wpr = $("body").attr('wpr');
         var bodyPad = parseInt(($("body").css('padding-right') || 0), 10);
         // _originalBodyPad = document.body.style.paddingRight || '';
         $("body").attr('wpr', (wpr !== undefined ? wpr : document.body.style.paddingRight || ''));
 
         if (bodyIsOverflowing) {
             $("body").css('padding-right', bodyPad + scrollbarWidth);
             //qiyu 2016-12-21 隐藏滚动条时头部也需要留白，避免移动
             $('[bh-header-role="bhHeaderMini"]').css('padding-right', bodyPad + scrollbarWidth);
             $('[bh-header-role="bhHeader"]').css('padding-right', bodyPad + scrollbarWidth);
         }
     }
 
     BH_UTILS.showScrollbar = function() {
         // $("body").css('padding-right', _originalBodyPad);
         var wpr = $("body").attr('wpr');
         $("body").css('padding-right', wpr);
 
         //qiyu 2016-12-21 隐藏滚动条时头部也需要留白，避免移动
         $('[bh-header-role="bhHeaderMini"]').css('padding-right', wpr);
         $('[bh-header-role="bhHeader"]').css('padding-right', wpr);
     }
 
     BH_UTILS.uxss = function(value) {
         // wangyongjian 优化emapdatatable渲染慢的问题 2019/11/28 
         var str = '' + value
         var matchHtmlRegExp = /["'&<>]/
         var match = matchHtmlRegExp.exec(str)
 
         if (!match) {
             return str
         }
 
         var escaped
         var html = ''
         var index = 0
         var lastIndex = 0
 
         for (index = match.index; index < str.length; index++) {
             switch (str.charCodeAt(index)) {
                 case 34: // "
                     escaped = '&quot;'
                     break
                 case 38: // &
                     escaped = '&amp;'
                     break
                 case 39: // '
                     escaped = '&#39;'
                     break
                 case 60: // <
                     escaped = '&lt;'
                     break
                 case 62: // >
                     escaped = '&gt;'
                     break
                 default:
                     continue
             }
 
             if (lastIndex !== index) {
                 html += str.substring(lastIndex, index)
             }
 
             lastIndex = index + 1
             html += escaped
         }
 
         return lastIndex !== index ?
             html + str.substring(lastIndex, index) :
             html
 
     }
 
     BH_UTILS.fxss = BH_UTILS.uxss;
 
     /**
      * @method getCookie
      * @description 获取cookie
      * @param  {String} c_name key of cookie
      * @return {String}        value of cookie
      */
     BH_UTILS.getCookie = function(c_name) {
         var c_start, c_end;　　　
         if (document.cookie.length > 0) {　　　　　　　　
             c_start = document.cookie.indexOf(c_name + "=");　　　　　　　　
             if (c_start != -1) {　　　　　　　　
                 c_start = c_start + c_name.length + 1;　　　　　　　　　　
                 c_end = document.cookie.indexOf(";", c_start);　　　　　　　　　　
                 if (c_end == -1) c_end = document.cookie.length;　　　　　　　　　　
                 return decodeURI(document.cookie.substring(c_start, c_end));　　　　　　　　
             }　　　　
         }　　　　
         return "";　　
     }
 
     /**
      * @method setCookie
      * @description 设置cookie
      * @param  {String} c_name key of cookie
      * @param  {String} value value of cookie
      * @param  {Int} durantion of cookie (minite)
      */
     BH_UTILS.setCookie = function(c_name, value, expireMinutes) {
         var exdate = new Date();　　　　
         exdate.setTime(exdate.getTime() + expireMinutes * 60 * 1000);
         var paths = location.pathname.split('/');
         var ctx = paths[1];
         document.cookie = (c_name + "=" + encodeURI(value) + ((expireMinutes == null) ? "" : ";expires=" + exdate.toGMTString()) + ';path=/' + ctx + '/');
     };
 
     /**
      * @method i18n
      * @description i18n国际化翻译
      * @param {String} - 待翻译的内容格式为  {key}[|{defaultText},[...{params1},[...{params2}]]] || my name is {0},jack，BH_UTILS.i18n('my name is {0},jack')=>my name is jack
      * @example BH_UTILS.i18n('bh_aq_search|搜索,{{aaa}},{{bbb}}')
      */
     BH_UTILS.i18n = function(content) {
         var matchResult = content;
         var defaultText = ''; // i18n 字典中无匹配结果时，显示的默认值
         var key = '';
         var result = ''; // 匹配结果
         var params = [];
         var placeReg = /(\{\d+\}?)/g;
         // 判断是否带key
         if (matchResult.indexOf('|') > -1) {
             if (matchResult.indexOf(',') > -1) {
                 params = matchResult.split(',');
                 matchResult = params.splice(0, 1)[0];
             }
             key = matchResult.split('|')[0];
             defaultText = matchResult.split('|')[1];
         } else {
             //判断key中是否有占位符
             var mats = matchResult.match(placeReg);
             if (mats) {
                 mats = mats.map(function(item) {
                     return item.match(/\d+/)[0];
                 });
                 mats.sort(function(a, b) {
                     if (a && b) {
                         return a - b;
                     }
                 });
                 var words = matchResult.split(',');
                 params = words.slice(-mats.length);
                 key = words.slice(0, -mats.length).join(',');
             } else {
                 key = matchResult;
             }
             defaultText = key;
         }
         if ($.i18n) {
             result = $.i18n(key);
         } else {
             result = key;
         }
         //判断匹配到的值是否含有{}
         var checkTemp = result.match(placeReg);
         if (checkTemp !== null) {
             var temp = result;
             checkTemp.forEach(function(item) {
                 var i = item.match(/\d+/)[0];
                 temp = temp.replace(new RegExp('\\{' + i + '\\}', 'g'), params[i] || '');
             });
             result = temp;
         }
         if (result === key && defaultText !== '') {
             result = defaultText;
         }
         return result;
     };
 
     /**
      * @method lang
      * @description 切换/获取语言
      * @param {String} [param] - 语言种类, 传参时为设置语言，可选值 zh en， 不传时则为获取当前语言
      */
     BH_UTILS.lang = function(lang) {
         if (lang === undefined) {
             var curLang = BH_UTILS.getCookie('EMAP_LANG');
             //判断是否是emap
             if (window.APP_CONFIG) {
                 if (!window.APP_CONFIG.USE_LANG) {
                     return 'zh';
                 }
             }
             return curLang === '' ? 'zh' : curLang;
         }
         BH_UTILS.setCookie('EMAP_LANG', lang.toLowerCase());
     };
     
     // 2021/1/27 添加加载国际化资源的方法给外部调用，提出人：魏振
     BH_UTILS.loadI18n = function(source,lang){
         langStore[lang] = source;
     }
 
     /**
      * @method getLangResource
      * @description 获取语言资源
      */
     BH_UTILS.getLangResource = function() {
         var paths = location.pathname.split('/');
         var appName = paths[paths.indexOf('sys') + 1];
         var ctx = paths[1];
         var uri = '/' + ctx + '/i18n.do';
         return BH_UTILS.doAjax(uri, { appName: appName });
     };
     //获取res所在文件夹路径
     BH_UTILS.getResPath = function() {
         var path=''
         if(!window.APP_CONFIG||!window.APP_CONFIG.RESOURCE_SERVER){
             $('script').each(function (i, script) {
                 // look for the theme script
                 var reg = new RegExp('fe_components');
                 if (reg.test(script.src)&&!path) {
                     // we have a match
                     var srcStr=script.src;
                     srcStr=srcStr.substring(0,srcStr.lastIndexOf('fe_components'))
                     path= srcStr;
                 }
             });
         }else
         {
             path= window.APP_CONFIG.RESOURCE_SERVER;
         }
         if(path.indexOf('http')!=0){
             path=window.location.protocol+path
         }
         return path
     };
     /**
      * 翻译数据字段
      * 数据格式{key:value}或者[{key:value}]
      * @param  {[type]} obj [description]
      * @return {[type]}     [description]
      */
     var i18nKeys = ['placeholder', 'form.placeholder', 'groupName'];
     BH_UTILS.i18nObject = function(obj) {
         var i18n = function(o) {
             i18nKeys.forEach(function(key) {
                 if (o.hasOwnProperty(key)) {
                     var val = o[key];
                     if ($.type(val) === 'string') {
                         o[key] = BH_UTILS.i18n(val);
                     }
                 }
             });
         };
         if ($.isArray(obj)) {
             obj.forEach(function(o) {
                 if ($.isPlainObject(o)) {
                     i18n(o);
                 }
             });
         } else {
             if ($.isPlainObject(obj)) {
                 i18n(obj);
             }
         }
 
         return obj;
     };
 
     BH_UTILS.getCurrentLang = function() {
         var lang = 'zh';
         lang = BH_UTILS.lang();
         BH_UTILS.getCurrentLang = function() {
             return lang;
         };
         return lang;
     };
 
 })(window.BH_UTILS = window.BH_UTILS || {});
 
 //禁止后退键 作用于Firefox、Opera
 document.onkeypress = BH_UTILS.banBackSpace;
 //禁止后退键  作用于IE、Chrome
 document.onkeydown = BH_UTILS.banBackSpace;
 
 
 
 //临时
 (function($) {
     /**
      * 左侧Tab组件
      */
     $.fn.bhMenuTab = function(i) {
         var that = this;
 
         $(that).children('[role="menutab"]').each(function(index) {
             if (typeof i != 'undefined') {
                 $(that).children('[role="menutab"]').eq(i)
                     .addClass('bh-active')
                     .siblings().removeClass('bh-active');
 
                 $(that).children('[role="menupanel"]').eq(i)
                     .addClass('bh-show')
                     .siblings().removeClass('bh-show');
             } else if ($(this).hasClass('bh-active')) {
                 $(that).children('[role="menupanel"]').eq(index)
                     .addClass('bh-show')
                     .siblings().removeClass('bh-show');
             }
             $(this).click(function() {
                 $(this).addClass('bh-active').siblings().removeClass('bh-active');
                 $(that).children('[role="menupanel"]').eq(index)
                     .addClass('bh-show')
                     .siblings().removeClass('bh-show');
             });
         });
     };
 
 
     $(window).resize(function() {
         var $dialog = $("div.bh-property-dialog");
 
         if ($dialog.length == 0) {
             return;
         }
         // var windowHeight = $(window).height();
         // var dialogHeight = windowHeight - $dialog.offset().top;
         // $dialog.css({height: dialogHeight});
 
         function getInsertContainerTop($dom) {
             var height = $dom.outerHeight()||0;
             if (height) {
                 return {
                     top: $dom.offset().top,
                     height: height
                 };
             } else {
                 return getInsertContainerTop($dom.parent());
             }
         }
 
         var insertContainer = $dialog.closest("aside").parent();
         var $window = $(window);
         var windowHeight = $window.height();
         var scrollTop = $window.scrollTop();
         var insertContData = getInsertContainerTop(insertContainer);
         var $normalHeader = $('header[bh-header-role="bhHeader"]');
         var normalHeaderHeight = $normalHeader.outerHeight()||0;
         var $miniHeader = $('header[bh-header-role="bhHeaderMini"]');
         var miniHeaderHeight = $miniHeader.outerHeight()||0;
         var isMiniHeaderShow = $normalHeader.hasClass("bh-normalHeader-hide") ? true : false;
         var headerHeight = isMiniHeaderShow ? miniHeaderHeight : normalHeaderHeight;
         var bodyHeight = $('body').get(0).scrollHeight;
         var $footer = $('[bh-footer-role="footer"]');
         var footerTop = $footer.offset().top;
         var footerHeight = $footer.outerHeight()||0;
         var dialogTop = 0;
         var topDiff = 4; //高度偏移量
         var headerDiff = normalHeaderHeight - miniHeaderHeight; //大小头部高度差
         if (scrollTop > insertContData.top) {
             dialogTop = scrollTop - headerHeight + topDiff;
         }
         var dialogHeight = insertContData.height;
         //出现小头部的处理
         if (isMiniHeaderShow) {
             //滚动条滚到页脚的处理
             if (windowHeight + scrollTop + footerHeight >= bodyHeight) {
                 dialogHeight = bodyHeight - scrollTop - footerHeight - topDiff - headerDiff;
             } else {
                 //滚动条没有滚到页脚的处理
                 dialogHeight = windowHeight - miniHeaderHeight;
             }
         } else {
             //当页面内容大于屏幕高度的处理
             if (footerTop > windowHeight) {
                 dialogHeight = windowHeight - insertContData.top;
             }
         }
 
         $dialog.css({
             top: dialogTop,
             height: dialogHeight
         });
     });
 })(jQuery);
 
 //ie9 增加console对象兼容
 if (navigator.userAgent.indexOf("MSIE 9.0") > 0) {
     window.console = (function() {
         var c = {};
         c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function() {};
         return c;
     })();
 }