define(function(require, exports, module) {

  var config = window.APP_CONFIG;
  var serverConfig = {};

  if (config.SERVER_CONFIG_API) {
    var serverConfig = null;

    ajax({
      url: config.SERVER_CONFIG_API,
      async: false,
      success: function(response) {
        serverConfig = JSON.parse(response)
      },
      fail: function(status) {
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

    //创建 - 非IE6 - 第一步
    if (window.XMLHttpRequest) {
      var xhr = new XMLHttpRequest();
    } else { //IE6及其以下版本浏览器
      var xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    //接收 - 第三步
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var status = xhr.status;
        if (status >= 200 && status < 300) {
          options.success && options.success(xhr.responseText, xhr.responseXML);
        } else {
          options.fail && options.fail(status);
        }
      }
    }

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
  //格式化参数
  function formatParams(url, data) {
    var arr = [];
    if (url.indexOf('?') >= 0) {
      var arr = url.substr(url.indexOf('?') + 1).split('&');
    }

    for (var name in data) {
      arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    arr.push(("v=" + Math.random()).replace(".", ""));
    return arr.join("&");
  }

  var platformConfig = localStorage.getItem("schoolConfig");
  var newSkin = localStorage.getItem("skinName");
  if (platformConfig) {
    if (typeof(platformConfig) == 'string') {
      platformConfig = JSON.parse(platformConfig);
    }
    if (platformConfig.footer && platformConfig.footer.normal) {
      config['FOOTER_TEXT'] = platformConfig.footer.normal;
    }

    if (platformConfig.skin) {
      config['THEME'] = platformConfig.skin;
    }

    if (platformConfig.rootPath) {
      config['APP_INFO_ROOT_PATH'] = platformConfig.rootPath;
    }
  }

  if(newSkin){
    config['THEME'] = newSkin;
  }
  if(config.CONFIG_READY){
    config.CONFIG_READY(config);
  }

  // 尝试读取平台的logo做为默认logo图片
  if (platformConfig && platformConfig.logoRootUrl) {
    config['HEADER'].logo = platformConfig.rootPath + platformConfig.logoRootUrl + platformConfig.logo.normal;
  }
  return config;
});
