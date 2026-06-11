import { configureStore } from "@reduxjs/toolkit";
import authReducer       from "../features/auth/auth.slice";
import coursesReducer    from "../features/courses/courses.slice";
import categoriesReducer from "../features/categories/categories.slice";

export const store = configureStore({
  reducer: {
    auth:       authReducer,
    courses:    coursesReducer,
    categories: categoriesReducer,
  },
});