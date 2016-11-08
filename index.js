require([], function() {
  var req = require;
  $(function() {
    if (!window.APP_CONFIG) {
      req(
        [
          './config'
        ],
        function(config) {
          window.APP_CONFIG = config;
          startBoot();
        }
      );
    } else {
      startBoot();
    }
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
        "echarts": cdn + "/bower_components/echarts3/dist/echarts"
      };

      if (thirdPartyPlugin) {
        _.each(Object.keys(thirdPartyPlugin), function(key) {
          if (_.include(['utils', 'css', 'echarts', 'config', 'resourceConfig', 'baseView', 'boot', 'configUtils', 'text', 'ubaseUtils', 'log', 'router'], key)) {
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
