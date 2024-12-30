/** @type { import('@storybook/react').Preview } */
// import '../src/assets/style/tailwind.css';

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  tags: ['autodocs', 'autodocs', 'autodocs']
};

export default preview;
