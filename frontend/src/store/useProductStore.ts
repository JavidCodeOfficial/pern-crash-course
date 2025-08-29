import { create } from "zustand"
import axios from "axios"
import toast from "react-hot-toast"

interface ApiError {
	status: number
	message: string
}

export interface Product {
	id: string
	name: string
	price: number
	image: string
	created_at?: string
}

interface UseFormData {
	name: string
	price: string
	image: string
}

interface ProductState {
	products: Product[]
	loading: boolean
	error: null | string
	currentProduct: UseFormData | null
	formData: UseFormData
	setFormData: (formData: UseFormData) => void
	resetForm: () => void
	addProduct: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
	fetchProducts: () => Promise<void>
	deleteProduct: (id: string) => Promise<void>
	fetchProduct: (id: string) => Promise<void>
	updateProduct: (id: string) => Promise<void>
}

const BASE_URL =
	import.meta.env.MODE === "development" ? "http://localhost:3000" : ""

export const useProductStore = create<ProductState>((set, get) => ({
	products: [],
	loading: false,
	error: null,
	currentProduct: null,

	// form state
	formData: {
		name: "",
		price: "",
		image: "",
	},

	setFormData: (formData: UseFormData) => set({ formData }),
	resetForm: () => set({ formData: { name: "", price: "", image: "" } }),

	addProduct: async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		set({ loading: true })

		try {
			const { formData, fetchProducts, resetForm } = get()
			await axios.post(`${BASE_URL}/api/products`, formData)
			await fetchProducts()
			resetForm()
			toast.success("Product added successfully")
			;(document.getElementById(
				"add_product_modal"
			) as HTMLDialogElement)!.close()
		} catch (error) {
			console.log("Error in addProduct function ", error)
			toast.error("Something went wrong!")
		} finally {
			set({ loading: false })
		}
	},

	fetchProducts: async () => {
		set({ loading: true })

		try {
			const respoonse = await axios.get(`${BASE_URL}/api/products`)

			set({ products: respoonse.data.data, error: null })
		} catch (error) {
			const err = error as ApiError
			if (err.status === 429)
				set({ error: "Rate limit exceeded!", products: [] })
			else set({ error: "Something went wrong", products: [] })
		} finally {
			set({ loading: false })
		}
	},

	deleteProduct: async (id: string) => {
		set({ loading: true })
		try {
			await axios.delete(`${BASE_URL}/api/products/${id}`)

			set((prev) => ({
				products: prev.products.filter((product) => product.id !== id),
			}))
			toast.success("Product deleted successfully")
		} catch (error) {
			console.log("Error in deleteProduct function ", error)
			toast.error("Something wend wrong!")
		} finally {
			set({ loading: false })
		}
	},

	fetchProduct: async (id: string) => {
		set({ loading: true })

		try {
			const response = await axios.get(`${BASE_URL}/api/products/${id}`)
			set({
				currentProduct: response.data.data,
				formData: response.data.data,
				error: null,
			})
		} catch (error) {
			console.log("Error in fetchProduct function ", error)
			set({ error: "Something went wrong!" })
		} finally {
			set({ loading: false })
		}
	},
	updateProduct: async (id: string) => {
		set({ loading: true })
		try {
			const { formData } = get()
			const response = await axios.put(
				`${BASE_URL}/api/products/${id}`,
				formData
			)
			set({ currentProduct: response.data.data })
			toast.success("Product updated successfully")
		} catch (error) {
			toast.error("Something went wrong!")
			console.log("Error in updateProduct function ", error)
		} finally {
			set({ loading: false })
		}
	},
}))
