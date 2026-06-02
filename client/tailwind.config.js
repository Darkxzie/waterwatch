export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        water: '#36bffa',
        sky: '#7dd3fc',
        critical: '#EF233C',
        high: '#F77F00',
        medium: '#F9C74F',
        low: '#43AA8B',
        ink: '#08111f',
        night: '#020814',
        panel: '#0b1728',
        panelSoft: '#0f2138',
        line: '#1f3350',
        mist: '#8ea7c2',
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 60px rgba(2, 8, 20, 0.42)',
        glow: '0 0 0 1px rgba(125, 211, 252, 0.12), 0 24px 70px rgba(54, 191, 250, 0.12)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(22px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(54, 191, 250, 0.38)' },
          '100%': { boxShadow: '0 0 0 18px rgba(54, 191, 250, 0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out both',
        'pulse-ring': 'pulseRing 2.4s ease-out infinite',
      },
    },
  },
  plugins: [],
};
