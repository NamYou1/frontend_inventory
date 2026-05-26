import MainLayout from './layout/MainLayout'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CategoryPage from './pages/categories/category/CategoryPage'
import SubCategoryPage from './pages/categories/subCategory/SubCategoryPage'
import StorePage from './pages/store/StorePage'
import LoginPage from './pages/login/LoginPage'
import UserPage from './pages/users/UserPage'
import RolePage from './pages/roles/RolePage'
import PermissionPage from './pages/permissions/PermissionPage'
import ProductPage from './pages/products/ProductPage'
import UnitPage from './pages/units/UnitPage'
import AdjustmentPage from './pages/adjustments/AdjustmentPage'
import PurchasePage from './pages/purchases/PurchasePage'
import TransferPage from './pages/transfers/TransferPage'
import SalePage from './pages/sales/SalePage'
import StockPage from './pages/stocks/StockPage'
import { fetchStocks } from '@/services/stockService';
import type { StockResponse } from '@/types/Stock.type';
import StockDetailPage from './pages/stocks/StockDetailPage'
import POSPage from './pages/pos/POSPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { GuestRoute } from './components/GuestRoute'

const router = createBrowserRouter([
  // Guest Routes (Public, block if authenticated)
  {
    element: <GuestRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
  // Protected Routes (Session Required)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          // Super Admin Only Pages
          {
            element: <ProtectedRoute allowedRoles={["ROLE_SUPER_ADMIN"]} />,
            children: [
              {
                path: "/category",
                element: <CategoryPage />,
              },
              {
                path: "/subcategory",
                element: <SubCategoryPage />,
              },
              {
                path: "/roles",
                element: <RolePage />,
              },
              {
                path: "/permissions",
                element: <PermissionPage />,
              },
            ],
          },
          // Shared / Role-Restricted Pages
          {
            element: <ProtectedRoute allowedRoles={["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]} />,
            children: [
              {
                path: "/store",
                element: <StorePage />
              },
              {
                path: "/stocks",
                element: <StockPage />
              },
              {
                path: "/stocks/:id",
                element: <StockDetailPage />,
              },
              {
                path: "/product",
                element: <ProductPage />,
              },
              {
                path: "/unit",
                element: <UnitPage />,
              },
              {
                path: "/adjustment",
                element: <AdjustmentPage />,
              },
              {
                path: "/purchase",
                element: <PurchasePage />,
              },
              {
                path: "/transfer",
                element: <TransferPage />,
              },
              {
                path: "/users",
                element: <UserPage />,
              },
            ],
          },
          // Sales and Cashier register Pages (Allowed for Super Admin, Admin, and Staff)
          {
            element: <ProtectedRoute allowedRoles={["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_STAFF"]} />,
            children: [
              {
                path: "/sale",
                element: <SalePage />,
              },
              {
                path: "/pos",
                element: <POSPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />
}

export default App