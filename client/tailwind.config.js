export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        water: '#0077B6',
        sky: '#00B4D8',
        critical: '#EF233C',
        high: '#F77F00',
        medium: '#F9C74F',
        low: '#43AA8B',
        ink: '#0A1628'
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['DM Sans', 'sans-serif']
      },
      boxShadow: {
        soft: '0 20px 45px rgba(10, 22, 40, 0.08)'
      }
    }
  },
  plugins: []
};
