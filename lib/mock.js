/* -----------------------系统配置/系统常量定义------------------------ */

;
(function(MOCK_CONFIG, undefined) {

    MOCK_CONFIG.ROOT = "http://res.wisedu.com/fe_components/mock";
    MOCK_CONFIG.PAGE_MODEL = "http://res.wisedu.com/fe_components/mock/page_model.json";
    MOCK_CONFIG.TABLE = "http://res.wisedu.com/fe_components/mock/table.json";
    MOCK_CONFIG.ACTION_ID_TABLE = "TABLE";

    MOCK_CONFIG.FORM_1 = "http://res.wisedu.com/fe_components/mock/form_1.json";
    MOCK_CONFIG.ACTION_ID_FORM_1 = "FORM_1";

    MOCK_CONFIG.FORM_X = "http://res.wisedu.com/fe_components/mock/form_x.json";
    MOCK_CONFIG.ACTION_ID_FORM_X = "FORM_X";

    MOCK_CONFIG.FORM_GROUP = "http://res.wisedu.com/fe_components/mock/form_group.json";
    MOCK_CONFIG.ACTION_ID_FORM_GROUP = "FORM_GROUP";

    MOCK_CONFIG.CODE_TREE = "http://res.wisedu.com/fe_components/mock/tree.json";

    MOCK_CONFIG.USERINFO = "http://res.wisedu.com/fe_components/mock/userInfo.json";
    MOCK_CONFIG.USERBASICINFO = "http://res.wisedu.com/fe_components/mock/userBasicInfo.json";
    MOCK_CONFIG.HEADER = "http://res.wisedu.com/fe_components/mock/header.json";

    MOCK_CONFIG.ADVANCED_SEARCH = "http://res.wisedu.com/fe_components/mock/advencedQueryModel.json";
    MOCK_CONFIG.ACTION_ID_SEARCH = "SEARCH";

})(window.MOCK_CONFIG = window.MOCK_CONFIG || {});
window.WIS_EMAP_SERV = window.WIS_EMAP_SERV || {};
window.BH_UTILS = window.BH_UTILS || {};
WIS_EMAP_SERV.getAbsPath = function(page_path) {
    if (page_path.substring(0, 7) == "http://" || page_path.substring(0, 8) == "https://") {
        return page_path;
    }
    if (page_path.substring(0, 1) == '/') {
        page_path = page_path.substring(1, page_path.length);
    }
    if (page_path.substring(0, 8) != 'modules/') {
        page_path = 'modules/' + page_path;
    }

    return window.location.href.substring(0, window.location.href.indexOf('/index/')) + '/' + page_path;
};

/**
 * ajax请求公共方法-promise方式调用
 * @param  {String} url    请求URL
 * @param  {Object} params 请求参数
 * @param  {String} method 请求方法
 * @return {Promise}
 */
BH_UTILS.doAjax = function(url, params, method) {
    var deferred = $.Deferred();
    $.ajax({
        type: method || 'GET',
        url: url,
        traditional: true,
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
            var result = JSON.parse(resp.responseText);
            if (typeof result.loginURL != 'undefined' && resp.loginURL != '') {
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
BH_UTILS.doSyncAjax = function(url, params, method) {
    var resp = $.ajax({
        type: method || 'GET',
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
}

WIS_EMAP_SERV.getData = function(pagePath, actionID, queryKey) {
    window._EMAP_PageMeta = window._EMAP_PageMeta || {};
    var pageMeta = window._EMAP_PageMeta[pagePath];
    if (pageMeta === undefined)
        pageMeta = this.getPageMeta(pagePath);

    var model = pageMeta.models.filter(function(val) {
        return val.name == actionID
    });


    var modelPath = model[0].url;
    var getData = BH_UTILS.doSyncAjax(WIS_EMAP_SERV.getAbsPath(modelPath), queryKey);
    if (getData === undefined || getData == null) {
        getData = {
            code: 0,
            msg: "没有数据",
            datas: {}
        };
        return {
            rows: []
        };
    } else {
        if (getData.result !== undefined && getData.result.datas !== undefined)
            getData = getData.result;
        return getData.datas[actionID];
    }
}

WIS_EMAP_SERV.getModel = function(pagePath, actionID, type) {
    // window.sessionStorage.setItem();
    window._EMAP_PageMeta = window._EMAP_PageMeta || {};

    var pageMeta = window._EMAP_PageMeta[pagePath];
    if (pageMeta === undefined) {
        pageMeta = this.getPageMeta(pagePath);
    }
    if (type == "search") {
        pageMeta.map(function(item) {
            item.get = function(field) {
                if (item[type + "." + field] !== undefined)
                    return item[type + "." + field];
                else
                    return item[field];
            }
        });
        return pageMeta;
    } else {
        var getData = pageMeta.models.filter(function(val) {
            return val.name == actionID
        });

        if (getData === undefined || getData == null) {
            //getData = {code: 0,msg: "没有数据",models:[],datas:{}};
            return undefined;
        } else {
            var model = getData[0];
            if (type === undefined)
                return model.controls;
            else {
                model.controls.map(function(item) {
                    item.get = function(field) {
                        if (item[type + "." + field] !== undefined)
                            return item[type + "." + field];
                        else
                            return item[field];
                    }
                });
                return model.controls;
            }
        }
    }



};