/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#00275E",
				bgPrimary: "#ffffff"
			},
			boxShadow: {
				card: "0px 0px 10px 1px rgba(0, 0, 0, 0.25)",
				cardHover: "0px 0px 16px 1px rgba(0, 0, 0, 0.5)"
			},
			screens: {
				xs: "320px",
				sm: "640px",
				md: "768px",
				lg: "1024px",
				xl: "1280px"
			}
		}
	},
	plugins: [],
	corePlugins: {
		preflight: false
	}
};
