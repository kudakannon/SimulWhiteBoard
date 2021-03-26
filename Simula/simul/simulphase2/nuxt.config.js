module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'SIMUL',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      // { rel:"stylesheet", href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" },
      { rel:"stylesheet", href:"https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css", integrity:"sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh", crossorigin:"anonymous" },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { src:"//unpkg.com/vue@latest/dist/vue.min.js" },
      { src:"//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.min.js"},
      { src:"//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue-icons.min.js"},
      
    ],
    script: [
      { src:"https://static.sekandocdn.net/static/feednami/feednami-client-v1.1.js"}
  
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#de4442' },
  /*
  ** Build configuration
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    'bootstrap-vue/nuxt',
  ],
  axios: {
    baseURL: 'http://localhost:8080',
    //baseURL: 'http://ec2-54-66-239-61.ap-southeast-2.compute.amazonaws.com:3000/'
  },
  plugins: [{ src: '@/plugins/button-group' }, '~/plugins/tel-input'],
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/login', method: 'post', propertyName: 'token' },
          user: { url: '/users/me', method: 'get', propertyName: 'user' },
          logout: false
        }
      }
    }
  },
  bootstrapVue: {
    icons: true  
  },
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}

