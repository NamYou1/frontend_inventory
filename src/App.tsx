import MainLayout from './layout/MainLayout'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CategoryPage from './pages/Category/CategoryPage'
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "category",
        element: <CategoryPage />
      }
    ]
  }
])
const App = () => {
  return (
   <RouterProvider router={router} />
  )
}

export default App