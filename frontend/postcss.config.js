const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Temporarily disable cssnano to fix parsing errors
    // ...(process.env.NODE_ENV === 'production' ? {
    //   cssnano: {
    //     preset: ['default', {
    //       discardComments: {
    //         removeAll: false,
    //       },
    //       normalizeWhitespace: false,
    //       minifySelectors: false,
    //     }],
    //   },
    // } : {}),
  },
};

export default config;
