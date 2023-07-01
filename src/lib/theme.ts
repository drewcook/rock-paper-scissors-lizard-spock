import { createTheme } from '@mui/material/styles'

const theme = createTheme({
	typography: {
		fontFamily: ['Kanit', 'Arial', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"'].join(
			',',
		),
	},
	palette: {
		mode: 'dark',
	},
})

export default theme
