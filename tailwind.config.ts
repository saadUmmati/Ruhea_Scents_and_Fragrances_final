import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "hsl(231, 38%, 16%)", // Rich Navy
                    navy: "hsl(231, 38%, 16%)",
                },
                accent: {
                    gold: "hsl(46, 65%, 52%)",
                    "rose-gold": "hsl(356, 48%, 81%)",
                },
                background: {
                    cream: "hsl(60, 10%, 96%)",
                    white: "#ffffff",
                },
                secondary: {
                    sage: "hsl(93, 14%, 55%)",
                    terracotta: "hsl(8, 49%, 57%)",
                },
                destructive: "hsl(0, 84%, 60%)",
                muted: "hsl(60, 5%, 90%)",
                card: "hsl(0, 0%, 100%)",
                popover: "hsl(0, 0%, 100%)",
                border: "hsl(231, 20%, 85%)",
                input: "hsl(231, 20%, 85%)",
                ring: "hsl(231, 38%, 16%)",
            },
            borderRadius: {
                sm: "calc(var(--radius) - 4px)",
                md: "calc(var(--radius) - 2px)",
                lg: "var(--radius)",
                xl: "calc(var(--radius) + 4px)",
            },
            fontFamily: {
                sans: ["var(--font-montserrat)", ...defaultTheme.fontFamily.sans],
                serif: ["var(--font-playfair)", ...defaultTheme.fontFamily.serif],
                urdu: ["var(--font-noto-urdu)", ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [tailwindcssAnimate],
} satisfies Config;
