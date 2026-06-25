module.exports = {
  babel: {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: ['last 2 versions']
          },
          include: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-nullish-coalescing-operator'
          ]
        }
      ],
      '@babel/preset-react'
    ],
    plugins: [
      '@babel/plugin-transform-class-properties',
      '@babel/plugin-transform-optional-chaining',
      '@babel/plugin-transform-nullish-coalescing-operator'
    ]
  },
  webpack: {
    configure: (webpackConfig) => {
      // Add rule to process FontAwesome modules with Babel
      const babelLoaderRule = webpackConfig.module.rules.find(
        rule => rule.loader && rule.loader.includes('babel-loader')
      );
      
      if (babelLoaderRule) {
        babelLoaderRule.include = [
          babelLoaderRule.include,
          /node_modules\/@fortawesome/
        ];
      }
      
      return webpackConfig;
    }
  }
};
