const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(glsl|vs|fs|vert|frag)$/,
          exclude: /node_modules/,
          use: [
            'raw-loader',
            'glslify-loader',
          ],
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({ THREE: 'three' }),
    ],
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/assets/styles/main.scss";
        `,
      },
    },
  },
};
