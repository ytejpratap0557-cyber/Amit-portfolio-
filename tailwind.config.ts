import type { Config } from "tailwindcss";
export default { content: ["./src/**/*.{ts,tsx}"], theme: { extend: {
 colors: { ink: "#080808", panel: "#111111", card: "#171717", mute: "#A1A1AA", gold: "#D4AF37" },
 fontFamily: { display: ["var(--font-display)"], sans: ["var(--font-body)"] } } }, plugins: [] } satisfies Config;
