import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./store/store"
import { ToastContainer } from "react-toastify"
import { TooltipProvider } from "@/components/ui/tooltip"
import "react-toastify/dist/ReactToastify.css"
import ProfilePage    from "./pages/profile/ProfilePage"
import ContainerPage  from "./pages/ContainerPage"
import LoginPage      from "./pages/login/LoginPage"
import RegisterPage   from "./pages/register/RegisterPage"
import DashboardPage  from "./pages/dashboard/DashboardPage"
import NotFoundPage   from "./pages/NotFoundPage"
import ProtectedRoute from "./app/guards/ProtectedRoute"
import DashboardLayout from "./pages/dashboard/DashboardLayaout"

const App = () => {
  return (
    <Provider store={store}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ContainerPage />}>
              <Route index            element={<LoginPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register"  element={<RegisterPage />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="profile"   element={<ProfilePage />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          theme="colored"
        />
      </TooltipProvider>
    </Provider>
  )
}

export default App