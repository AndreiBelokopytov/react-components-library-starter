const path = require("path");

const TSDocgenPlugin = require("react-docgen-typescript-webpack-plugin");

module.exports = (baseConfig, env, config) => {
  // we need to use custom postcss config in postcss-loader
  config.module.rules.map(rule => {
    if (/\.css$/.test(rule.test)) {
      return {
        test: /\.css$/,
        include: path.resolve(__dirname, "../lib"),
        use: [
          require.resolve('style-loader'),
          require.resolve('postcss-loader')
        ]
      };
    }
  });

  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve("ts-loader")
  });
  config.plugins.push(new TSDocgenPlugin());
  config.resolve.extensions.push(".ts", ".tsx");

  return config;
};
