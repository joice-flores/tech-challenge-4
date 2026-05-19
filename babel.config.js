module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '~': './src',
            '@screens': './src/screens',
            '@services': './src/services',
            '@contexts': './src/contexts',
            '@navigation': './src/navigation',
            '@theme': './src/theme',
            '@types': './src/types',
            '@assets': './assets'
          }
        }
      ]
    ]
  };
};
