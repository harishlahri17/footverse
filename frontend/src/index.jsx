import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Register } from './user/screen/Register'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './store/auth';
import Login from './user/screen/Login';
import ForgotPassword from './user/screen/ForgotPassword';
import ResetPassword from './user/screen/ResetPassword';
import VerifyEmail from './user/screen/VerifyEmail';
import Home from './user/screen/Home';
import { ToastContainer } from 'react-toastify';
import { CompareProvider } from './store/CompareContext';
import Compare from './user/screen/Compare';

// user------------------------- 
import AdminProtectedRoutes from './user/components/AdminProtectedRoutes';
import Checkout from './user/screen/Checkout';
import Shop from './user/screen/Shop';
import ShopCart from './user/screen/ShopCart';
import ProductDetails from './user/screen/ProductDetails';
import Blog from './user/screen/Blog';
import BlogDetails from './user/screen/BlogDetails';
import Contact from './user/screen/Contact';
import UserLayout from './user/layout/UserLayout';
import Notifications from './user/screen/Notifications';
import HelpCenter from './user/screen/HelpCenter';

// Additional Ecommerce Pages
import SearchResults from './user/screen/SearchResults';
import CategoryProducts from './user/screen/CategoryProducts';
import BrandProducts from './user/screen/BrandProducts';
import Deals from './user/screen/Deals';
import NewArrivals from './user/screen/NewArrivals';
import BestSellers from './user/screen/BestSellers';
import OrderSuccess from './user/screen/OrderSuccess';
import OrderDetails from './user/screen/OrderDetails';
import Wishlist from './user/screen/Wishlist';
import AccountDashboard from './user/screen/AccountDashboard';
import Categories from './user/screen/Categories';

// admin -------------------------
import UserProtectedRoutes from './user/components/UserProtectedRoutes';
import Dashboard from './admin/screen/Dashboard';
import AddProduct from './admin/screen/AddProduct';
import ProductsTable from './admin/screen/ProductsTable';
import { CartProvider } from './store/cartContext';
import EditProduct from './admin/screen/EditProduct';
import FeaturedProduct from './admin/screen/FeaturedProduct';
import AddDiscount from './admin/screen/AddDiscount';
import Orders from './admin/screen/Orders';
import MyOrders from './user/components/MyOrders';
import DeliveryMan from './admin/screen/DeliveryMan';
import AddDeliveryMan from './admin/screen/AddDeliveryMan';
import EditDeliveryMan from './admin/screen/EditDeliveryMan';

// delivery ---------------------------------
import DeliveryProtectedRouted from './delivery/component/DeliveryProtectedRouted';
import DeliveryDashboard from './delivery/screen/DeliveryDashboard';
import DeliveryMyOrders from './delivery/screen/DeliveryMyOrders';
import DeliveryLiveTracking from './delivery/screen/DeliveryLiveTracking';
import DeliveryEarnings from './delivery/screen/DeliveryEarnings';
import DeliveryProfile from './delivery/screen/DeliveryProfile';
import DeliveryNotifications from './delivery/screen/DeliveryNotifications';
import DeliverySupport from './delivery/screen/DeliverySupport';
import DeliverySettings from './delivery/screen/DeliverySettings';



const root = ReactDOM.createRoot(document.getElementById('root'));

let allRoutes = createBrowserRouter(
  [
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '/',
      element: <Login />
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />
    },
    {
      path: '/reset-password',
      element: <ResetPassword />
    },
    {
      path: '/verify-email',
      element: <VerifyEmail />
    },
    {
      element: <UserLayout />,
      children: [
        {
          path: '/home',
          element: (
            <UserProtectedRoutes>
              <Home />
            </UserProtectedRoutes>
          )
        },
        {
          path: '/checkout',
          element: (
            <UserProtectedRoutes>
              <Checkout />
            </UserProtectedRoutes>
          )
        },
        {
          path: '/shop',
          element: (
            <UserProtectedRoutes>
              <Shop />
            </UserProtectedRoutes>
          )
        },
        {
          path: '/shop-cart',
          element: (
            <UserProtectedRoutes>
              <ShopCart />
            </UserProtectedRoutes>
          )
        },
        {
          path: '/cart',
          element: (
            <UserProtectedRoutes>
              <ShopCart />
            </UserProtectedRoutes>
          )
        },
        {
          path: '/product-details/:id',
          element: (
            <UserProtectedRoutes>
              <ProductDetails />
            </UserProtectedRoutes>
          )
        },
        {
          path: '/my-orders',
          element: (
            <UserProtectedRoutes>
              <MyOrders />
            </UserProtectedRoutes>
          )
        },
        {
          path: '/account/*',
          element: (
            <UserProtectedRoutes>
              <AccountDashboard />
            </UserProtectedRoutes>
          )
        },
        {
          path: '/profile',
          element: (
            <UserProtectedRoutes>
              <AccountDashboard />
            </UserProtectedRoutes>
          )
        },
        {
          path: '/wishlist',
          element: (
            <UserProtectedRoutes>
              <Wishlist />
            </UserProtectedRoutes>
          )
        },
        {
          path: '/compare',
          element: (
            <UserProtectedRoutes>
              <Compare />
            </UserProtectedRoutes>
          )
        },
        {
          path: 'blog',
          element: <Blog />
        },
        {
          path: 'blog-details',
          element: <BlogDetails />
        },
        {
          path: 'contact',
          element: <Contact />
        },
        {
          path: 'notifications',
          element: (
            <UserProtectedRoutes>
              <Notifications />
            </UserProtectedRoutes>
          )
        },
        {
          path: 'help-center',
          element: <HelpCenter />
        },
        {
          path: '/search',
          element: <SearchResults />
        },
        {
          path: '/category/:categoryName',
          element: <CategoryProducts />
        },
        {
          path: '/brand/:brandName',
          element: <BrandProducts />
        },
        {
          path: '/deals',
          element: <Deals />
        },
        {
          path: '/categories',
          element: <Categories />
        },
        {
          path: '/brands',
          element: <Shop />
        },
        {
          path: '/track-order',
          element: (
            <UserProtectedRoutes>
              <MyOrders />
            </UserProtectedRoutes>
          )
        },
        {
          path: '/new-arrivals',
          element: <NewArrivals />
        },
        {
          path: '/best-sellers',
          element: <BestSellers />
        },
        {
          path: '/order-success/:orderId',
          element: (
            <UserProtectedRoutes>
              <OrderSuccess />
            </UserProtectedRoutes>
          )
        },
      ]
    },

    // admin Dashboard 

    {
      path: 'dashboard',
      element: (
        <AdminProtectedRoutes>
          <Dashboard />
        </AdminProtectedRoutes>
      )
    },
    {
      path: 'orders',
      element: (
        <AdminProtectedRoutes>
          <Orders />
        </AdminProtectedRoutes>
      )
    },
    {
      path: '/admin/orders',
      element: (
        <AdminProtectedRoutes>
          <Orders />
        </AdminProtectedRoutes>
      )
    },
    {
      path: 'add-product',
      element: (
        <AdminProtectedRoutes>
          <AddProduct />
        </AdminProtectedRoutes>
      )
    },
    {
      path: 'products-table',
      element: (
        <AdminProtectedRoutes>
          <ProductsTable />
        </AdminProtectedRoutes>
      )
    },
    {
      path: '/edit-product/:id',
      element: (
        <AdminProtectedRoutes>
          <EditProduct />
        </AdminProtectedRoutes>
      )
    },
    {
      path: 'featured-product',
      element: (
        <AdminProtectedRoutes>
          <FeaturedProduct />
        </AdminProtectedRoutes>
      )
    },
    {
      path: 'add-discount',
      element: (
        <AdminProtectedRoutes>
          <AddDiscount />
        </AdminProtectedRoutes>
      )
    },
    {
      path: 'delivery-man',
      element: (
        <AdminProtectedRoutes>
          <DeliveryMan />
        </AdminProtectedRoutes>
      )
    },
    {
      path: 'add-delivery-man',
      element: (
        <AdminProtectedRoutes>
          <AddDeliveryMan />
        </AdminProtectedRoutes>
      )
    },
    {
      path: 'edit-delivery-man/:id',
      element: (
        <AdminProtectedRoutes>
          <EditDeliveryMan />
        </AdminProtectedRoutes>
      )
    },


    // delivery man Dashboard 
    {
      path: 'delivery-dashboard',
      element: (
        <DeliveryProtectedRouted>
          <DeliveryDashboard />
        </DeliveryProtectedRouted>
      )
    },
    {
      path: 'delivery-orders',
      element: (
        <DeliveryProtectedRouted>
          <DeliveryMyOrders />
        </DeliveryProtectedRouted>
      )
    },
    {
      path: 'delivery-tracking',
      element: (
        <DeliveryProtectedRouted>
          <DeliveryLiveTracking />
        </DeliveryProtectedRouted>
      )
    },
    {
      path: 'delivery-earnings',
      element: (
        <DeliveryProtectedRouted>
          <DeliveryEarnings />
        </DeliveryProtectedRouted>
      )
    },
    {
      path: 'delivery-profile',
      element: (
        <DeliveryProtectedRouted>
          <DeliveryProfile />
        </DeliveryProtectedRouted>
      )
    },
    {
      path: 'delivery-notifications',
      element: (
        <DeliveryProtectedRouted>
          <DeliveryNotifications />
        </DeliveryProtectedRouted>
      )
    },
    {
      path: 'delivery-support',
      element: (
        <DeliveryProtectedRouted>
          <DeliverySupport />
        </DeliveryProtectedRouted>
      )
    },
    {
      path: 'delivery-settings',
      element: (
        <DeliveryProtectedRouted>
          <DeliverySettings />
        </DeliveryProtectedRouted>
      )
    },

  ]
)
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CompareProvider>
        <CartProvider > {/* cart Context */}
          <RouterProvider router={allRoutes} />
          <ToastContainer
            position="top-center"
            hideProgressBar="true"
            theme="colored"
          />
        </CartProvider>
      </CompareProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
