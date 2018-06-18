const path = require("path");

const TSDocgenPlugin = require("react-docgen-typescript-webpack-plugin");

module.exports = (baseConfig, env, config) => {
  // we need to use custom postcss config in postcss-loader
  const rules = config.module.rules.map(rule => {
    if (/\.css$/.toString() === rule.test.toString()) {
      return {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, '../lib'),
          path.resolve(__dirname, '../stories')
        ],
        use: [
          require.resolve('style-loader'),
          require.resolve('postcss-loader')
        ]
      };
    } else {
      return rule;
    }
  });

  config.module.rules = [
    ...rules,
    {
      test: /\.(ts|tsx)$/,
      loader: require.resolve("ts-loader")
    }
  ]

  config.plugins.push(new TSDocgenPlugin());
  config.resolve.extensions.push(".ts", ".tsx");

  return config;
};
