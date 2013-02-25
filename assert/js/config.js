seajs.config({
  // 配置别名
  alias: {
    'jquery': 'libs/jquery-1.8.0.js'
  },

  // 加载 shim 插件
  plugins: ['shim'],

  // 配置 shim 信息，这样我们就可以通过 require('jquery') 来获取 jQuery
  shim: {
    'jquery': {
      exports: 'jQuery'
    }
  }
});