/**
 * Created by Administrator on 2016/1/12.
 */
;(function (BH_UTILS, undefined) {
    /**
     * 打开成功对话框
     * @param title 标题
     * @param content 内容
     * @param callback 回调函数
     * @param buttons 数组[{text:'完成',className:'bh-btn-success',callback:options.callback}]
     */
    BH_UTILS.bhDialogSuccess = function(options){
        if(!options) return;
        var buttonList = [{text:'完成',className:'bh-btn-success'}];
        if (options.callback) buttonList[0].callback = options.callback;
        if(options.buttons){
            buttonList = options.buttons;
        }
        var params = {
            iconType:'success',
            title:options.title,
            content:options.content,
            buttons:buttonList
        };
        if(options.height){
            params["height"] = options.height;
        }
        if(options.width){
            params["width"] = options.width;
        }
        $.bhDialog(params);
    }
    /**
     * 打开警告对话框
     * @param title 标题
     * @param content 内容
     * @param callback 回调函数
     * @param buttons 数组
     */
    BH_UTILS.bhDialogWarning = function(options){
        if(!options) return;
        var buttonList = [{text:'确认并提交',className:'bh-btn-warning'},{text:'取消',className:'bh-btn-default'}];
        if (options.callback) buttonList[0].callback = options.callback;
        if(options.buttons){
            buttonList = options.buttons;
        }
        var params = {
            iconType:'warning',
            title:options.title,
            content:options.content,
            buttons:buttonList
        };
        if(options.height){
            params["height"] = options.height;
        }
        if(options.width){
            params["width"] = options.width;
        }
        $.bhDialog(params);
    }

    /**
     * 打开危险对话框
     * @param title 标题
     * @param content 内容
     * @param callback 回调函数
     * @param buttons 数组
     */
    BH_UTILS.bhDialogDanger = function(options){
        if(!options) return;
        var buttonList = [{text:'删除',className:'bh-btn-danger'},{text:'取消',className:'bh-btn-default'}];
        if (options.callback) buttonList[0].callback = options.callback;
        if(options.buttons){
            buttonList = options.buttons;
        }
        var params = {
            iconType:'danger',
            title:options.title,
            content:options.content,
            buttons:buttonList
        };
        if(options.height){
            params["height"] = options.height;
        }
        if(options.width){
            params["width"] = options.width;
        }
        $.bhDialog(params);
    }

    BH_UTILS.bhWindow = function(content, title, btns, params, callback){

        params = params || {};
        
        var $dom = $('<div style="padding-bottom:72px;">' + 
            '<div class="head"></div>' + 
            '<div>' +
                '<div class="content"></div>' + 
                '<div id="buttons" style="position: absolute;bottom:32px;width: 100%;left: 0;float: right;padding: 0 24px;">' +
                    '<hr style="border:none;border-top: 1px solid #efefef;margin-bottom: 10px;">' + 
                '</div>' + 
            '</div>' + 
        '</div>');
        $('body').append($dom);
        $(".head", $dom).append($("<h2></h2>").append(title));
        $(".content", $dom).append(content);

        $dom.on("close", function(){
            $dom.jqxWindow('destroy');
        });

        var btns = btns || [
            {
                text:'确定',
                className:'bh-btn-primary',
                callback: callback
            },
            {
                text:'取消',className:'bh-btn-default', 
                callback:function(){
                    $dom.jqxWindow('close');
                }
            }
        ];

        for (var i = btns.length - 1; i >= 0; i--) {
            var btn = $('<button class="bh-btn ' + btns[i].className + ' bh-pull-right">' + btns[i].text + '</button>');
            if (btns[i].callback){
                var cb = btns[i].callback;
                btn.data("callback", cb);
                btn.click(function(){
                    var cb = $(this).data("callback");
                    var needClose = cb.apply($dom, [$dom]);
                    if(needClose !== false)
                        $dom.jqxWindow('close');
                });
            }
            $("#buttons", $dom).append(btn);
        }

        $dom.jqxWindow($.extend({
            resizable: false, 
            isModal: true,
            modalOpacity: 0.3,
            height: params.height || "100%", 
            width: params.width || 500, 
            autoOpen:false
        }, params)).jqxWindow('open');

        $(".content", $dom).niceScroll();

        BH_UTILS.bhWindow.close = function(){
            $dom.jqxWindow('close');
        }
    }

    /**
     * ajax请求公共方法-promise方式调用
     * @param  {String} url    请求URL
     * @param  {Object} params 请求参数
     * @param  {String} method 请求方法
     * @return {Promise}
     */
    BH_UTILS.doAjax = function(url, params, method){
        var deferred = $.Deferred();
        $.ajax({
            type: method || 'POST',
            url: url,
            traditional: true,
            data: params || {},
            dataType: 'json',
            success: function (resp) {
                // console.log("doAjax success:----------");
                // console.log(resp);
                // console.log("-----------:doAjax success");
                //如果未登录跳转至登录页面
                try{
                    if(typeof resp == 'string'){
                        resp = JSON.parse(resp);
                    }
                    if(typeof resp.loginURL != 'undefined' && resp.loginURL != ''){
                        window.location.href = resp.loginURL;
                    }
                }catch(e){
                    //console.log(e);
                }
                
                deferred.resolve(resp);
            },
            error: function (resp) {
                // console.log("doAjax error:----------");
                // console.log(resp);
                // console.log("-----------:doAjax error");
                //如果未登录跳转至登录页面
                var result = JSON.parse(resp.responseText);
                if(typeof result.loginURL != 'undefined' && resp.loginURL != ''){
                    window.location.href = result.loginURL;
                }
                deferred.reject(resp);
            }
        });
        return deferred.promise();
    }

    /**
     * 同步ajax方法
     * @param  {String} url    请求URL
     * @param  {Object} params 请求参数
     * @param  {String} method 请求方法
     */
    BH_UTILS.doSyncAjax = function(url, params, method){
        var resp = $.ajax({
            type: method || 'POST',
            url: url,
            traditional: true,
            data: params || {},
            dataType: 'json',
            cache: false,
            async: false,
            error: function (resp) {
                // console.log("doSyncAjax error:----------");
                // console.log(resp);
                // console.log("----------:doSyncAjax error");
                var result = JSON.parse(resp.responseText);
                //console.log(result);
                //如果未登录跳转至登录页面
                if(typeof result.loginURL != 'undefined' && resp.loginURL != ''){
                    //console.log(result.loginURL);
                    window.location.href = result.loginURL;
                }
            }
        });
        if(resp.status != 200){
            return {};   
        }
        var result = JSON.parse(resp.responseText);
        //如果未登录跳转至登录页面
        if(typeof result.loginURL != 'undefined' && resp.loginURL != ''){
            window.location.href = result.loginURL;
        }
        return result;
    }

    /**
     * 异步jsonp方式ajax调用
     * @param  {String} url    请求URL
     * @param  {Object} params 请求参数
     */
    BH_UTILS.doAjaxP = function(url, params){
        var deferred = $.Deferred();
        $.ajax({
            type: 'GET',
            url: url,
            traditional: true,
            data: params || {},
            dataType: 'jsonp',
            jsonp: 'jsonpcallback',
            success: function (resp) {
                //如果未登录跳转至登录页面
                try{
                    if(typeof resp == 'string'){
                        resp = JSON.parse(resp);
                    }
                    if(typeof resp.loginURL != 'undefined' && resp.loginURL != ''){
                        window.location.href = resp.loginURL;
                    }
                }catch(e){
                    //console.log(e);
                }
                deferred.resolve(resp);
            },
            error: function (resp) {
                //如果未登录跳转至登录页面
                var result = JSON.parse(resp.responseText);
                if(typeof result.loginURL != 'undefined' && resp.loginURL != ''){
                    window.location.href = result.loginURL;
                }
                deferred.reject(resp);
            }
        });
        return deferred.promise();
    }

    /**
     * 同步jsonp方式ajax调用
     * @param  {String} url    请求URL
     * @param  {Object} params 请求参数
     */
    BH_UTILS.doSyncAjaxP = function(url, params, method){
        var resp = $.ajax({
            type: 'GET',
            url: url,
            traditional: true,
            data: params || {},
            dataType: 'jsonp',
            cache: false,
            jsonp: 'jsonpcallback',
            async: false,
            error: function (resp) {
                var result = JSON.parse(resp.responseText);
                //如果未登录跳转至登录页面
                if(typeof result.loginURL != 'undefined' && resp.loginURL != ''){
                    window.location.href = result.loginURL;
                }
            }
        });
        if(resp.status != 200){
            return {};   
        }
        var result = JSON.parse(resp.responseText);
        //如果未登录跳转至登录页面
        if(typeof result.loginURL != 'undefined' && resp.loginURL != ''){
            window.location.href = result.loginURL;
        }
        return result;
    };

    /**
     * 同步方式获取html片段
     * @return {String} 
     */
    BH_UTILS.getHTML = function(url, params){
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
            error: function (resp) {

            }//,
            // beforeSend: function( xhr ) {
            //     xhr.overrideMimeType("Content-type:text/html; charset=utf-8" );
            // }
        });
        //console.log("-------BH_UTILS.getHTML:---------\n" + resp.responseText);
        if(resp.status != 200){
            return 404;   
        }
        return resp.responseText;
    }


    /* -----------------------业务相关公共方法------------------------ */

    /**
     * 设置表格列宽
     * @param $tablePlaceholder 表格初始化的div
     * @param specifyColumnWidthList 要设置的列宽数组["34px", 1, 1, 1, 1, 1, 2, 2, 1], 只能是固定列宽和各列的占比，或只有占比,不能使用百分比
     * @param getType 获取返回数据类型， 默认返回百分比与像素混合的数据，“px”是返回像素数据，"percent"返回百分比数据
     * @returns {*} 返回计算后的各列宽数组["34px", "155px", "155px", "155px", "155px", "155px", "310px", "310px", "155px"]
     */
    BH_UTILS.getTableColWidth = function($tablePlaceholder, specifyColumnWidthList, getType){
        var tableWidth = getTableWidth($tablePlaceholder);
        var specifyColumnLen = specifyColumnWidthList.length;
        var computeColumnCount = 0; //统计按占比分配的列数
        var fixedWidthCount = 0; //统计用户设置列宽的总和
        for(var i= 0; i<specifyColumnLen; i++){
            var item = specifyColumnWidthList[i];
            if(typeof(item) !== "string"){
                computeColumnCount += item;
            }else{
                fixedWidthCount += parseInt(item, 10);
            }
        }

        var computeTableWidth = tableWidth - fixedWidthCount; //去掉用户设置列宽的剩余宽度
        var oneColWidth = computeTableWidth / computeColumnCount; //单个占比的宽度
        //换算各个占比的数据
        for(var i= 0; i<specifyColumnLen; i++){
            var item = specifyColumnWidthList[i];
            if(!getType){
                //返回混合数据的处理
                if(typeof(item) !== "string"){
                    //将占比类型的换算成百分比
                    specifyColumnWidthList[i] = parseFloat((parseFloat(item * oneColWidth) / tableWidth) * 100) + "%";
                }
            }else if(getType === "px"){
                //返回像素数据的处理
                if(typeof(item) !== "string"){
                    //将占比类型的换算成像素
                    specifyColumnWidthList[i] = parseFloat(item * oneColWidth) + "px";
                }
            }else{
                //返回百分比数据的处理
                if(typeof(item) !== "string"){
                    //将占比类型的换算成百分比
                    specifyColumnWidthList[i] = parseFloat((parseFloat(item * oneColWidth) / tableWidth) * 100) + "%";
                }else{
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
    function getTableWidth($container){
        var _width = $container.width();
        if(!_width){
            return getTableWidth($container.parent());
        }else{
            return _width;
        }
    }

    /**
     * 根据行数设定table高度
     * @param rowCount
     * @returns {number}
     */
    BH_UTILS.getTableHeight = function(rowCount,hasHScroll){
        var rowHeight = 27; //内容行高
        var headerRowHeight = 29; //头部行高
        var footerHeight = 39; //39是翻页的固定高度
        if(hasHScroll){
            footerHeight+=15; //15是table横向滚动条的高度
        }
        var tableHeight = rowHeight * rowCount + headerRowHeight + footerHeight;
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
    BH_UTILS.setHtmlData = function(data){
        var $container = data.container;
        var datas = data.data;
        var fieldKey = data.key ? data.key : "sc-data-field";
        var $toSetDataItems = $container.find("["+fieldKey+"]");
        $toSetDataItems.each(function(){
            var $item = $(this);
            var tagName = $item[0].tagName.toLocaleLowerCase();
            var fieldName = $item.attr(fieldKey);
            var fieldValue = datas[fieldName] ? datas[fieldName] : "";
            if(tagName === "input" || tagName === "textarea" || tagName === "select"){
                $item.val(fieldValue);
            }else{
                $item.text(fieldValue);
            }
        });
    };

    /**
     * 获取节点数据
     * container 要获取数据的容器
     * @param data
     */
    BH_UTILS.getHtmlData = function(data){
        var $container = data.container;
        var fieldKey = data.key ? data.key : "sc-data-field";
        var $toGetDataItems = $container.find("["+fieldKey+"]");
        var datas = {};
        $toGetDataItems.each(function(){
            var $item = $(this);
            var tagName = $item[0].tagName.toLocaleLowerCase();
            var fieldName = $item.attr(fieldKey);
            if(tagName === "input" || tagName === "textarea" || tagName === "select"){
                datas[fieldName] = $item.val();
            }else{
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
    BH_UTILS.clearHtmlData = function(data){
        var $container = data.container;
        var fieldKey = data.key ? data.key : "sc-data-field";
        var $toSetDataItems = $container.find("["+fieldKey+"]");
        $toSetDataItems.each(function(){
            var $item = $(this);
            var tagName = $item[0].tagName.toLocaleLowerCase();
            if(tagName === "input" || tagName === "textarea" || tagName === "select"){
                $item.val("");
            }else{
                $item.text("");
            }
        });
    };

    /**
     * 创建guid
     * @returns {string}
     * @constructor
     */
    BH_UTILS.NewGuid = function(){
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    };
    function S4(){
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
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
    BH_UTILS.initHeader = function(headData, currHash, oldHash){

        headData.nav = [];
        var keep = false;
        for(var i = 0; i < headData.navGroup.length; i++){
            var filtered = headData.navGroup[i].filter(function(item){
                if(item.href == currHash){
                    item.active = true;
                    return true;
                }else{
                    item.active = false;
                }
            });
            var oldItem = headData.navGroup[i].filter(function(item){
                if(item.href == oldHash) keep = true;
            });
            if(filtered.length > 0){
                headData.nav = headData.navGroup[i];
            }
        }
        if(!keep){
            $('#headerPlaceholder').empty();
            $('#headerPlaceholder').bhHeader(headData);
        }
    };

    /**
     * 渲染头部，专用于简化版框架
     * @return {[type]} [description]
     */
    BH_UTILS.renderHeader = function(){
        var headerData;
        if(typeof WIS_CONFIG.HEADER_URL != 'undefined' && WIS_CONFIG.HEADER_URL != ''){
            headerData = BH_UTILS.doSyncAjax(WIS_CONFIG.HEADER_URL);
            headerData = $.extend(WIS_CONFIG.HEADER, headerData);
        }else{
            headerData = WIS_CONFIG.HEADER;
        }
        var hash = window.location.hash;
        if(hash.indexOf('?') != -1){
            hash = hash.substring(0, hash.indexOf('?'))
        }
        if(hash != '#/' && hash != '' && hash.indexOf('_target_') == -1){
            for(var i = 0; i < headerData.nav.length; i++){
                headerData.nav[i].active = false;
                if(hash == headerData.nav[i].href){
                    headerData.nav[i].active = true;
                }
            }
        }
        $('#headerPlaceholder').bhHeader(headerData);
    }

    BH_UTILS.initFooter = function(text){
        $("#footerPlaceholder").bhFooter({
            text: text || "版权信息：© 2015 江苏金智教育信息股份有限公司 苏ICP备10204514号"
        });
    };

    //给容器设定最小高度
    BH_UTILS.setContentMinHeight = function($setContainer, type, diff){
        if($setContainer && $setContainer.length > 0){
            diff = diff ? diff : 0;
            var $window = $(window);
            var windowHeight = $window.height();
            var footerHeight = $("[bh-footer-role=footer]").outerHeight();
            var headerHeight = $("[bh-header-role=bhHeader]").outerHeight();
            var minHeight = 0;
            if(type === "noHeader"){
                minHeight = windowHeight - footerHeight - diff - 1;
            }else{
                minHeight = windowHeight - headerHeight - footerHeight - diff - 1;
            }

            $setContainer.css("min-height", minHeight+"px");
        }
    };

    //获取浏览器最小高度
    BH_UTILS.getWindowMinHeight = function(type){
        var $window = $(window);
        var windowHeight = $window.height();
        var footerHeight = $("[bh-footer-role=footer]").outerHeight();
        var headerHeight = $("[bh-header-role=bhHeader]").outerHeight();
        var minHeight = windowHeight - headerHeight - footerHeight - diff - 1;
        return minHeight;
    };

    BH_UTILS.namespace = function(ns){
        window.BH_NS = window.BH_NS || {};
        var parts = ns.split('.'),
            object = window.BH_NS,
            i, len;

         for(i = 0, len = parts.length; i < len; i++) {
            if(!object[parts[i]]) {
                object[parts[i]] = {};
            }
            object = object[parts[i]];
         }
         return object;
    };

    //处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
    BH_UTILS.banBackSpace = function(e){
        var ev = e || window.event;//获取event对象   
        var obj = ev.target || ev.srcElement;//获取事件源   
        
        var t = obj.type || obj.getAttribute('type');//获取事件源类型  
        
        //获取作为判断条件的事件类型
        var vReadOnly = obj.getAttribute('readonly');
        var vEnabled = obj.getAttribute('enabled');
        //处理null值情况
        vReadOnly = (vReadOnly == null) ? false : vReadOnly;
        vEnabled = (vEnabled == null) ? true : vEnabled;
        
        //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
        //并且readonly属性为true或enabled属性为false的，则退格键失效
        var flag1=(ev.keyCode == 8 && (t=="password" || t=="text" || t=="textarea") 
                    && (vReadOnly==true || vEnabled!=true))?true:false;
       
        //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
        var flag2=(ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea")
                    ?true:false;        
        
        //判断
        if(flag2){
            return false;
        }
        if(flag1){   
            return false;   
        }   
    }

    //全局变量 用于组件或模块之间传值
    var _GLOBAL_OBJ_KEY = '_WISEDU_GLOBAL_OBJ_2016';
    window[_GLOBAL_OBJ_KEY] = {};

    /**
     * 预编译模版
     * @param  {String} tplUrl 请求模版地址[必选]
     * @return {Function} 编译后生成的函数
     */
    BH_UTILS.compileTpl = function(tplUrl){
        var tplSource = _getTpl(tplUrl);
        //预编译模板
        var tpl = Handlebars.compile(tplSource);
        return tpl;
    }

    /**
     * 预编译模版,为兼容老版本，保留上述compileTpl函数
     * @param  {String} tplUrl 请求模版地址[必选]
     * @return {String} 编译后生成的html
     */
    BH_UTILS.compileTemplate = function(tplUrl, obj){
        var tplSource = _getTpl(tplUrl);
        //预编译模板
        var tpl = Handlebars.compile(tplSource);
        obj = (typeof obj == 'undefined' || obj == null || obj == '') ? {} : obj;
        return tpl(obj);
    }

    /**
     * 组件或模块之间传值时使用，设置数据
     * @param {String} key 键
     * @param {任意类型} obj 值
     */
    BH_UTILS.setData = function(key, obj){
        window[_GLOBAL_OBJ_KEY][key] = obj;
    }

    /**
     * 组件或模块之间传值时使用，根据key获取数据
     * 注意在使用的地方保存获取的值，考虑内存优化，默认全局对象中的值只能被获取一次，随即删除
     * flag默认不需要传值，如果传true，则不自动删除该全局对象值，在用完该全局对象后必须手动调用clearData方法手动清除全局变量
     * @param {String} key 键
     * @return key对应的值
     */
    BH_UTILS.getData = function(key, flag){
        var obj = _.cloneDeep(window[_GLOBAL_OBJ_KEY][key]);
        if(flag !== true){
            delete window[_GLOBAL_OBJ_KEY][key];
        }
        return obj;
    }

    /**
     * 手动清除全局变量
     */
    BH_UTILS.clearData = function(key){
        delete window[_GLOBAL_OBJ_KEY][key];
    }

    /**
     * 生成首页html布局
     */
    BH_UTILS.genMainLayout = function(){
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
    BH_UTILS.wavesInit = function(){
        if(typeof (Waves) !== "undefined"){
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
    function _getTpl(url){
        var resp = $.ajax({
            type: 'GET',
            url: url,
            //traditional: true,
            cache: false,
            data: {},
            contentType:'text/html; charset=utf-8;',
            dataType: 'html',
            async: false,
            error: function (resp) {}
        });

        return resp.responseText;
    }


})(window.BH_UTILS = window.BH_UTILS || {});

//禁止后退键 作用于Firefox、Opera
document.onkeypress = BH_UTILS.banBackSpace;
//禁止后退键  作用于IE、Chrome
document.onkeydown = BH_UTILS.banBackSpace;



//临时
(function ($) {
    /**
     * 左侧Tab组件
     */
    $.fn.bhMenuTab = function(i){
        var that = this;

        $(that).children('[role="menutab"]').each(function(index){
            if(typeof i != 'undefined'){
                $(that).children('[role="menutab"]').eq(i)
                    .addClass('bh-active')
                    .siblings().removeClass('bh-active');

                $(that).children('[role="menupanel"]').eq(i)
                    .addClass('bh-show')
                    .siblings().removeClass('bh-show');
            }else if($(this).hasClass('bh-active')){
                $(that).children('[role="menupanel"]').eq(index)
                    .addClass('bh-show')
                    .siblings().removeClass('bh-show');
            }
            $(this).click(function(){
                $(this).addClass('bh-active').siblings().removeClass('bh-active');
                $(that).children('[role="menupanel"]').eq(index)
                    .addClass('bh-show')
                    .siblings().removeClass('bh-show');
            })
        });
        
    }
})(jQuery);
