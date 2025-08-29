import { create } from "zustand"

interface ThemeState {
	theme: string
	setTheme: (theme: string) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
	theme: localStorage.getItem("preferred-theme") || "forest",
	setTheme: (theme: string) => {
		localStorage.setItem("preferred-theme", theme)
		set({ theme })
	},
}))
