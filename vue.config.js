module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? '/serverless-example/'
  : '/',

  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: "src/service-worker.js"
    }
  }
}