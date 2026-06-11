import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  categories: [],
  totalPages:  1,
}

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories  = action.payload.categories
      state.totalPages  = action.payload.totalPages
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload)
    },
    updateCategory: (state, action) => {
      const index = state.categories.findIndex(c => c._id === action.payload._id)
      if (index !== -1) state.categories[index] = action.payload
    },
    removeCategory: (state, action) => {
      state.categories = state.categories.filter(c => c._id !== action.payload)
    },
  },
})

export const { setCategories, addCategory, updateCategory, removeCategory } = categoriesSlice.actions
export default categoriesSlice.reducer