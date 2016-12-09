define(function(require, exports, module) {

    var config = {
        "RESOURCE_VERSION": '100003',
        "PUBLIC_CSS": [
            '/fe_components/iconfont/iconfont.css',
            '/fe_components/iconfont_2.0/iconfont.css',
            '/fe_components/jqwidget/{{theme}}/bh{{version}}.min.css',
            '/fe_components/jqwidget/{{theme}}/bh-scenes{{version}}.min.css',
            '/bower_components/animate.css/animate.min.css',
            '/bower_components/sentsinLayer/skin/layer.css'
        ],

        "PUBLIC_BASE_JS": [
            '/fe_components/bh_utils.js',
            '/fe_components/amp/ampPlugins.min.js',
            '/fe_components/jqwidget/jqxwidget.min.js',
            '/fe_components/bhtc/moment/min/moment-with-locales.min.js'
        ],

        "PUBLIC_NORMAL_JS": [
            '/fe_components/bh{{version}}.min.js',
            '/fe_components/emap{{version}}.js',
            '/fe_components/sentry/sentry.min.js'
        ],

        "DEBUG_JS": [
            '/fe_components/mock/mock.js'
        ],

        "IE_SHIV_JS": [
            '/bower_components/html5shiv/dist/html5shiv.min.js',
            '/bower_components/jquery-placeholder/jquery.placeholder.js'
        ],

        "IE_SHIV_CSS": [
            '/fe_components/jqwidget/{{theme}}/bh-ie.css'
        ]

    };

    return config;
});
