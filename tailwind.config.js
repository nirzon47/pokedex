/** @type {import('tailwindcss').Config} */
export default {
	content: ['*html'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Geist', 'sans-serif'],
				chelsea: ['Chelsea', 'sans-serif'],
			},
		},
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['emerald', 'dracula'],
	},
}
