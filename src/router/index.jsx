import {
  createBrowserRouter,
} from "react-router-dom";
import Home from "../pages/Home";
import MenuDetails from "../pages/MenuDetails";
import CartPage from "../pages/CartPage";
import Layout from "../pages/layouts/Layout";
import TableVerifyPage from "../pages/TableVerifyPage";
import NotFoundPage from "../pages/NotFoundPage";
import History from "../pages/OrderHistory";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'menus/:id', element: <MenuDetails /> },
      { path: 'table/:slug/:token', element: <TableVerifyPage /> },
      { path: '404', element: <NotFoundPage /> },
      { path: 'carts', element: <CartPage /> },
      { path: 'history', element: <History/>}
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />
  }

]);


export default router;