module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@contexts': './src/contexts',
            '@services': './src/services',
            '@utils': './src/utils',
            '@config': './src/config',
            '@types': './src/types'
          }
        }
      ]
    ]
  };
};