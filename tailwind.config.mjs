/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			gridTemplateColumns: {
				'26': 'repeat(26, minmax(0, 1fr))',
			},
		},
		fontFamily: {
			'sans': ['"Oxygen", sans-serif'],
		},
	},
	plugins: [],
}
