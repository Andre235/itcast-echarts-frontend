module.exports = {
	devServer: {
		port: 8081,
		open: true
	},
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'cpn': '@/components',
        'network': '@/network',
        'views': '@/views',
      }
    }
  }
}
