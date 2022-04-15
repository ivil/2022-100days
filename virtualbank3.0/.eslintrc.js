// const { resolve } = require('eslint-import-resolver-webpack')

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:import/recommended',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended',
    'airbnb-base', // 引入阿里的规范
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prettier/prettier': 'error',
    'import/extensions': ['error', 'ignorePackages', { 'web.js': 'never', 'json': 'never', 'ts': 'never' }],
    // 'import/no-extraneous-dependencies': [2, { devDependencies: true }],
    // 'import/no-unresolved': [2, { ignore: ['antd-mobile'] }],
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'e', // for e.returnvalue
          'ctx', // for Koa routing
          'req', // for Express requests
          'request', // for Express requests
          'res', // for Express responses
          'response', // for Express responses
          'state', // for vuex state
        ],
      },
    ],
  },
  settings: {
    'import/resolver': {
      webpack: {
        // 此处config对应webpack.config.js的路径，我这个路径是vue-cli3默认的路径
        config: 'node_modules/@vue/cli-service/webpack.config.js',
      },
    },
  },
}
