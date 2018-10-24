define(function (require, exports, module) {

  var config = window.APP_CONFIG;
  var serverConfig = {};

  if (config.SERVER_CONFIG_API) {
    ajax({
      url: config.SERVER_CONFIG_API,
      async: false,
      success: function (response) {
        serverConfig = JSON.parse(response)
      },
      fail: function (status) {
        console.error('AJAX SERVER_CONFIG_API ERROR');
      }
    });
  }

  config = $.extend(true, {}, config, serverConfig);

  function ajax(options) {
    options = options || {};
    options.type = (options.type || "GET").toUpperCase();
    options.dataType = options.dataType || "json";
    var params = formatParams(options.url, options.data);

    var isCrossorigin = (function() {
      if (/^(http:\/\/|https:\/\/)/.test(options.url)) {
        var match = options.url.match(/^((http:\/\/|https:\/\/)[^/|^:]+)\/*/);
        if (match[1]) {
          return match[1] != location.protocol + '//' + location.host;
        }
      }
      return false;
    })();

    //创建 - 非IE6 - 第一步
    var xhr = {};
    if (window.XMLHttpRequest && document.documentMode != 9) {
      xhr = new XMLHttpRequest();
    } else { //IE6及其以下版本浏览器
      if (isCrossorigin) {
        xhr = new XDomainRequest();
      } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
      }
    }

    //接收 - 第三步
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        var status = xhr.status;
        if (status >= 200 && status < 300) {
          options.success && options.success(xhr.responseText, xhr.responseXML);
        } else {
          options.fail && options.fail(status);
        }
      }
    };

    if (options.url.indexOf('?') >= 0) {
      options.url = options.url.substring(0, options.url.indexOf('?'));
    }

    //连接 和 发送 - 第二步
    if (options.type == "GET") {
      xhr.open("GET", options.url + "?" + params, options.async);
      xhr.send(null);
    } else if (options.type == "POST") {
      xhr.open("POST", options.url, options.async);
      //设置表单提交时的内容类型
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(params);
    }
  }

  function getCookie(c_name) {
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

  //格式化参数
  function formatParams(url, data) {
    var arr = [];
    if (url.indexOf('?') >= 0) {
      arr = url.substr(url.indexOf('?') + 1).split('&');
    }

    for (var name in data) {
      arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    arr.push(("v=" + Math.random()).replace(".", ""));
    return arr.join("&");
  }

  var platformConfig = localStorage.getItem("schoolConfig");
  // 个人配色方案改为从cookie中获取
  // var newSkin = localStorage.getItem("skinName");
  var newSkin = getCookie("THEME");
  if (platformConfig) {
    if (typeof (platformConfig) == 'string') {
      platformConfig = JSON.parse(platformConfig);
    }
    config['SHOW_USEAPPS'] = platformConfig['SHOW_USEAPPS'];
    config['USEAPPS_TYPE'] = platformConfig['USEAPPS_TYPE'];
    if (platformConfig.footer) {
      var lang = getCookie('EMAP_LANG');
      if (lang === 'en' && config.USE_LANG) {
        config['FOOTER_TEXT'] = platformConfig.footer.enFooter || platformConfig.footer.normal;
      } else {
        config['FOOTER_TEXT'] = platformConfig.footer.normal;
      }
    }

    if (platformConfig.skin) {
      config['THEME'] = platformConfig.skin;
    }

    if (platformConfig.rootPath) {
      config['APP_INFO_ROOT_PATH'] = platformConfig.rootPath;
    }
  } else if (!config['FOOTER_TEXT']) {
    try {
      // 门户和应用分域名部署时，取不到配置的cookie，则请求res上的静态配置文件
      ajax({
        url: config.RESOURCE_SERVER + '/fe_components/config_local/config.json',
        async: false,
        success: function (response) {
          try {
            serverConfig = JSON.parse(response)
          } catch (e) {
            console && console.error('无效的res config')
            console && console.log(response)
          }
          serverConfig = serverConfig || {}
          config['FOOTER_TEXT'] = serverConfig['FOOTER_TEXT']
          config['THEME'] = serverConfig['THEME']
          config['APP_INFO_ROOT_PATH'] = serverConfig['APP_INFO_ROOT_PATH'];
          config['SHOW_USEAPPS'] = config['SHOW_USEAPPS']?config['SHOW_USEAPPS']:serverConfig['SHOW_USEAPPS'];
          config['USEAPPS_TYPE'] = config['USEAPPS_TYPE']?config['USEAPPS_TYPE']:serverConfig['USEAPPS_TYPE'];
        },
        fail: function (status) {
          console && console.error('AJAX 获取 RES 配置信息失败');
        }
      });
    } catch(e) {
      console && console.error('AJAX 获取 RES 配置信息失败');
    }
  }

  if (newSkin) {
    config['THEME'] = newSkin;
  }
  if (config.CONFIG_READY) {
    config.CONFIG_READY(config);
  }

  // 尝试读取平台的logo做为默认logo图片
  if (platformConfig && platformConfig.logoRootUrl && config['HEADER']) {
    config['HEADER'].logo = platformConfig.rootPath + platformConfig.logoRootUrl + platformConfig.logo.normal;
  }
  //elvis 2017-06-30 公有云部署时，logo地址特别指定。
  if (config["schoolID"] !== undefined && config["LOGO_PATH"] !== undefined && config['HEADER']){
    config['HEADER'].logo = config["LOGO_PATH"].replace("{schoolID}", config["schoolID"]);
  }
  // if (["127.0.0.1","localhost","0.0.0.0"].indexOf(window.location.hostname) == -1 ) {
  //   setTimeout(function(){
  //     $.get(config.RESOURCE_SERVER + '/fe_components/package.json').always(function(resp){
  //       if (resp.statusText === 'error') {
  //         $.ajax({
  //             url:window.location.protocol + '//cdnres.campusphere.cn/statistics/ubase',
  //             dataTypeString:'jsonp'
  //         });
  //       } else {
  //         $.ajax({
  //             url:window.location.protocol + '//cdnres.campusphere.cn/statistics/ubase?v=' + resp.version,
  //             dataTypeString:'jsonp'
  //         });
  //       }
  //     });
  //   }, 1000);
  // }
  return config;
});