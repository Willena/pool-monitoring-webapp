module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '//willena.github.io/pool-monitoring-webapp/' : '/',
    css: {
        extract: {
            filename: 'css/[name].css',
            chunkFilename: 'css/[name].css',
        },
    },
    configureWebpack: {
        output: {
            filename: "js/pool-monitor.js",
            chunkFilename : 'js/[name].js'
        },

    },
}

