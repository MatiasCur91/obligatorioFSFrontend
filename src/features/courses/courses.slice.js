import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
  totalPages: 1,
  error: null,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.courses    = action.payload.courses;
      state.totalPages = action.payload.totalPages;
    },
    addCourse: (state, action) => {
      state.courses.push(action.payload);
    },
    updateCourse: (state, action) => {
      const index = state.courses.findIndex(c => c._id === action.payload._id);
      if (index !== -1) state.courses[index] = action.payload;
    },
    removeCourse: (state, action) => {
      state.courses = state.courses.filter(c => c._id !== action.payload);
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setCourses, addCourse, updateCourse, removeCourse, setError } = coursesSlice.actions;
export default coursesSlice.reducer;