import { dirname, join } from "path";
import autoImport from 'unplugin-auto-import/vite';

/** @type { import('@storybook/react').StorybookConfig } */
const config = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(ts|tsx)'
  ],

  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@storybook/addon-coverage"),
    getAbsolutePath("@storybook/addon-themes"),
    {
      name: '@storybook/addon-docs',
      options: {
        csfPluginOptions: null,
        jsxOptions: {},
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [],
          },
        },
      },
    },
    getAbsolutePath("@chromatic-com/storybook")
  ],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },

  docs: {},

  features: {
    interactionsDebugger: true,
  },

  viteFinal: async (config) => {
    return {
      ...config,
      plugins: [
        ...config.plugins,
        autoImport({
          imports: ['react'],
          dts: '.storybook/auto-imports.d.ts',
        })
      ],
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@': dirname(join(__dirname, '../src')),
        }
      },
      define: {
        ...config.define,
        global: 'window',
      },
      build: {
        ...config.build,
        sourcemap: false,
        minify: false
      },
    };
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript'
  }
};

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}

export default config;
