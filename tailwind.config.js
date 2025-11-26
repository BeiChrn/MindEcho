

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7a47fc',
        secondary: '#4545fc', 
        accent: '#456dfc',
        'text-primary': '#1f2937',
        'text-secondary': '#6b7280',
        'bg-primary': '#ffffff',
        'bg-secondary': '#f9fafb',
        'border-primary': '#e5e7eb',
        'border-secondary': '#d1d5db'
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'nav': '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }
    }
  },
  plugins: [],
}

