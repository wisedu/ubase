require([], function() {
  var req = require;
  $(function() {
      req.config({
        urlArgs: "bust=" +  (new Date()).getTime()
      });
      req(
          [
              './config'
          ],
          function(config) {
              window.APP_CONFIG = $.extend(true, {}, window.APP_CONFIG, config);
              startBoot();
          },
          function (error) {
              console && console.log(error)
              startBoot()
          }
      );
  })

  function startBoot() {
    require(['boot', 'utils', 'text'], function(boot, utils) {
      boot.start();
      var cdn = utils.getConfig('RESOURCE_SERVER');
      // STATIC_TIMESTAMP已废弃的属性 业务代码通过APP_VERSION控制版本
      var appVersion = utils.getConfig('APP_VERSION') || utils.getConfig('STATIC_TIMESTAMP') || '30000';
      var thirdPartyPlugin = utils.getConfig('THIRD_PARTY_PLUGIN');

      var paths = {
        'css': cdn + '/bower_components/requirejs-css/css',
        "echarts": cdn + "/bower_components/echarts3/dist/echarts",
        "echarts4": cdn + "/bower_components/echarts4/echarts.min"
      };

      if (thirdPartyPlugin) {
        _.each(Object.keys(thirdPartyPlugin), function(key) {
          if (_.include(['utils', 'css', 'echarts', 'echarts4', 'config', 'resourceConfig', 'baseView', 'boot', 'configUtils', 'text', 'ubaseUtils', 'log', 'router'], key)) {
            console && console.error && console.error('THIRD_PARTY_PLUGIN中配置的'+key + '名称框架内部已使用，请换成其他名称！');
            return;
          }
          paths[key] = thirdPartyPlugin[key];
        });
      }
      require.config({
        waitSeconds: 0,
        baseUrl: './',
        urlArgs: 'av=' + appVersion,
        paths: paths
      });
    });
  }
});
