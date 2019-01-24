module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? '/serverless-example/'
  : '/',

  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: "public/service-worker.js"
    }
  }
}