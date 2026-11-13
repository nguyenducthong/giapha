/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          crimson: '#8B2E2E',     // Đỏ son linh thiêng
          crimsonDark: '#671D1D', // Đỏ son đậm
          crimsonLight: '#A94343',
          gold: '#C49A45',        // Vàng đồng quý phái
          goldLight: '#E2BA68',
          goldMuted: '#9D782D',
          moss: '#365847',        // Xanh rêu trường tồn
          mossLight: '#4A7560',
          mossDark: '#233A2E',
          parchment: '#F8F4E9',   // Nền giấy cổ truyền thống
          parchmentDark: '#EFE7D3',
          ink: '#252B28',         // Chữ chính mực đen truyền thống
          inkMuted: '#647069',
          canvas: '#F7F8FA',      // Nền ứng dụng hiện đại
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Be Vietnam Pro"', 'Inter', 'sans-serif'],
        display: ['"Cinzel"', 'serif'],
      },
      boxShadow: {
        'heritage-sm': '0 2px 8px -2px rgba(37, 43, 40, 0.08), 0 1px 4px -1px rgba(37, 43, 40, 0.05)',
        'heritage-md': '0 8px 24px -4px rgba(37, 43, 40, 0.10), 0 4px 12px -2px rgba(37, 43, 40, 0.06)',
        'heritage-lg': '0 16px 36px -6px rgba(139, 46, 46, 0.12), 0 8px 16px -4px rgba(37, 43, 40, 0.08)',
        'gold-glow': '0 0 20px rgba(196, 154, 69, 0.35)',
      },
      borderRadius: {
        'heritage': '14px',
      }
    },
  },
  plugins: [],
}
