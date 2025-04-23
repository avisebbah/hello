// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['he'],
    defaultLocale: 'he',
  },
};
module.exports = nextConfig;

// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Assistant', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
};

// package.json
{
  "name": "prescription-digital-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "axios": "^1.4.0",
    "react-signature-canvas": "^1.0.6"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.21",
    "tailwindcss": "^3.3.2"
  }
}

// styles/globals.css
@import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  direction: rtl;
  font-family: 'Assistant', sans-serif;
}

/* סגנון עבור חתימה דיגיטלית */
.signature-canvas {
  touch-action: none;
}
