module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(110,231,249,0.2), 0 25px 50px rgba(10, 18, 30, 0.6)',
      },
      colors: {
        panel: '#0f172a',
        accent: '#6ee7f9',
        accent2: '#7c3aed',
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at center, rgba(255,255,255,0.08) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
