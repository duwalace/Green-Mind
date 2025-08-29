const { override, addBabelPlugin, adjustStyleLoaders, addWebpackPlugin } = require('customize-cra');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = override(
  // Adiciona plugin para minificar CSS
  addBabelPlugin([
    'babel-plugin-transform-react-remove-prop-types',
    {
      removeImport: true,
      ignoreFilenames: ['node_modules']
    }
  ]),
  
  // Otimiza carregamento de CSS
  adjustStyleLoaders(({ use }) => {
    if (!Array.isArray(use)) return;
    use.forEach((loader) => {
      if (
        loader &&
        typeof loader === 'object' &&
        loader.loader &&
        loader.loader.includes('css-loader') &&
        loader.options &&
        loader.options.modules
      ) {
        loader.options.modules.localIdentName = '[hash:base64:8]';
      }
    });
  }),
  
  // Configuração do webpack
  (config) => {
    // Otimiza o bundle de produção
    if (process.env.NODE_ENV === 'production') {
      // Configura o Terser para minificação avançada
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
              drop_console: true,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          parallel: true,
          cache: true,
          sourceMap: false,
        }),
      ];
      
      // Adiciona plugins para produção
      config.plugins.push(
        // Extrai CSS em arquivos separados
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        }),
        
        // Comprime arquivos estáticos
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 10240,
          minRatio: 0.8,
        })
      );
      
      // Otimiza chunks
      config.optimization.splitChunks = {
        chunks: 'all',
        name: false,
        cacheGroups: {
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'async',
            priority: 5,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
      
      // Otimiza carregamento de módulos
      config.optimization.runtimeChunk = 'single';
    }
    
    return config;
  }
);