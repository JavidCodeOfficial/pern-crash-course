import Navbar from "./components/Navbar"
import { Routes, Route, BrowserRouter } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ProductPage from "./pages/ProductPage"
import { useThemeStore } from "./store/useThemeStore"
import { Toaster } from "react-hot-toast"

export default function App() {
	const { theme } = useThemeStore()

	return (
		<BrowserRouter>
			<div
				className="min-h-screen bg-base-200 transition-colors duration-300"
				data-theme={theme}
			>
				<Navbar />

				<Routes>
					<Route
						path="/"
						element={<HomePage />}
					/>
					<Route
						path="/products/:id"
						element={<ProductPage />}
					/>
				</Routes>

				<Toaster />
			</div>
		</BrowserRouter>
	)
}
