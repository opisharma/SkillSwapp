export default {
  content: [
    './resources/**/*.blade.php',
    './resources/**/*.js',
    './resources/**/*.jsx',
    './app/**/*.php',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f8ff',
          100: '#d8ebff',
          500: '#2563eb',
          700: '#1d4ed8',
        },
      },
      boxShadow: {
        soft: '0 10px 25px -10px rgba(15, 23, 42, 0.25)',
      },
    },
  },
  plugins: [],
};
