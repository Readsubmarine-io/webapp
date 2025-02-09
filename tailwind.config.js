/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "rounded-lg",
    "rounded-full",
    {
      pattern: /^(bg|text|border)-(power-pump|outline-button|category-button)-/,
    },
    {
      pattern: /^(w|h)-/,
      variants: ["sm", "md", "lg"],
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      maxWidth: {
        container: "1128px",
      },
      width: {
        card: "300px",
      },
      height: {
        card: "300px",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "power-pump": {
          blue: "hsl(var(--power-pump-blue))",
          text: "#62759d",
          button: "#0077b6",
          heading: "#152c5b",
          subtext: "#6c757d",
          "button-inverse": "#ffffff",
        },
        "slider-button": "rgba(21, 44, 91, 0.5)",
        "slider-button-hover": "rgba(21, 44, 91, 1)",
        "category-button": {
          text: "#62759d",
          border: "#cccccc",
          bg: "#0077b6",
        },
        "outline-button": {
          text: "#152c5b",
          border: "#0077b6",
          "hover-bg": "#0077b6",
          "hover-text": "#ffffff",
        },
        "container-border": "#eaecf3",
        "gradient-start": "#ffffff",
        "gradient-end": "#f0f4f8",
        "currency-code": "#4a5568",
        "table-header": "rgb(44, 82, 130)",
        "table-border": "rgb(226, 232, 240)",
        "table-row-hover": "rgb(219, 233, 245)",
        dialog: {
          DEFAULT: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
        },
        drawer: {
          DEFAULT: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
        },
        menu: {
          DEFAULT: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
        },
        contextMenu: {
          DEFAULT: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
        },
        headerMenu: {
          DEFAULT: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
        },
        tooltip: {
          DEFAULT: "hsl(var(--tooltip-background))",
          foreground: "hsl(var(--tooltip-foreground))",
        },
      },
      fontSize: {
        "heading-xl": "36px",
        menu: "18px",
        "currency-code": "12px",
        "base-custom": "1rem",
      },
      lineHeight: {
        custom: "1.7",
      },
      backgroundImage: {
        "content-gradient": "linear-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        "content-container": "0 0 1.25rem rgba(31, 45, 61, 0.05)",
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        card: "var(--radius-card)",
        full: "9999px",
        custom: "8px",
      },
      spacing: {
        18: "4.5rem",
      },
      transitionDuration: {
        200: "200ms",
        150: "150ms",
      },
      padding: {
        "table-cell": "16px",
      },
      fontWeight: {
        "table-header": "600",
      },
      letterSpacing: {
        "table-header": "0.05em",
      },
      borderWidth: {
        "table-header": "1px",
        2: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

