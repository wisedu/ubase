define(function(require, exports, module) {

    var config = {
        "RESOURCE_VERSION": '100003',
        "PUBLIC_CSS": [
            '/iconfont/iconfont.css',
            '/iconfont_2.0/iconfont.css',
            '/jqwidget/{{theme}}/bh{{version}}.min.css',
            '/jqwidget/{{theme}}/bh-scenes{{version}}.min.css',
            '/bower_components/animate.css/animate.min.css',
            '/bower_components/sentsinLayer/skin/layer.css'
        ],

        "PUBLIC_BASE_JS": [
            '/bh_utils.js',
            '/amp/ampPlugins.min.js',
            '/jqwidget/jqxwidget.min.js',
            '/bhtc/moment/min/moment-with-locales.min.js',
            '/bhtc/sortable/Sortable.js'
        ],

        "PUBLIC_NORMAL_JS": [
            '/bh{{version}}.min.js',
            '/emap{{version}}.js',
            '/sentry/sentry.min.js'
        ],

        "DEBUG_JS": [
            '/mock/mock.js'
        ],

        "IE_SHIV_JS": [
            '/bower_components/html5shiv/dist/html5shiv.min.js',
            '/bower_components/jquery-placeholder/jquery.placeholder.js'
        ],

        "IE_SHIV_CSS": [
            '/jqwidget/{{theme}}/bh-ie.css'
        ]

    };

    return config;
});
