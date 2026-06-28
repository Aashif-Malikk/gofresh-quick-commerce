import React, { useEffect } from 'react'
import Nav from './Component/Nav'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Home from './Component/Home'
import { useStore } from './Component/utils/Zustand';
import Login from './Component/Authentication/Login'
import AdminRoute from './Component/Admin/Admin Route/AdminRoute';
import AdminDashboard from './Component/Admin/AdminDashboard';
import AdminCustomers from './Component/Admin/Admin Users/AdminCustomers';
import AdminVendors from './Component/Admin/Admin Users/AdminVendors';
import AdminDeliveryPartner from './Component/Admin/Admin Users/AdminDeliveryPartner';
import AdminAllProducts from './Component/Admin/Products/AdminAllProducts';
import AdminCategories from './Component/Admin/Products/AdminCategories';
import VendorRoute from './Component/Vendor/Vendor Route/VendorRoute';
import VendorDashboard from './Component/Vendor/VendorDashboard';
import VendorOrders from './Component/Vendor/VendorOrders';
import VendorAddProducts from './Component/Vendor/VendorAddProducts';
import DeliveryRoute from './Component/Delivery Partner/Delivery Route/DeliveryRoute';
import DeliveryDashboard from './Component/Delivery Partner/DeliveryDashboard';
import DeliveryAvailableOrders from './Component/Delivery Partner/DeliveryAvailableOrders';
import DeliveryEarnings from './Component/Delivery Partner/DeliveryEarnings';
import DeliveryHistory from './Component/Delivery Partner/DeliveryHistory';
import Cart from './Component/Cart';
import VendorProducts from './Component/Vendor/VendorProducts';

function Layout() {
  const showAuthModal = useStore(
    (state) => state.showAuthModal
  );

  useEffect(() => {
    if (showAuthModal) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [showAuthModal])

  return (
    <div className='relative'>
      <Nav />
      {showAuthModal ? (
        <div style={{ backdropFilter: 'blur(10px)' }} className='absolute top-0 z-50 w-full h-185 flex place-content-center place-items-center'>
          <Login />
        </div>
      ) : null}
      <Outlet />
    </div>
  )
}

function App() {
  return (
    <div className=''>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='cart' element={<Cart />} />
        </Route>

        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="vendors" element={<AdminVendors />} />
          <Route path="delivery-partners" element={<AdminDeliveryPartner />} />
          <Route path="products" element={<AdminAllProducts />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>

        <Route path="/vendor" element={<VendorRoute />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="orders" element={<VendorOrders />} />
          <Route path="add-products" element={<VendorAddProducts />} />
          <Route path="products" element={<VendorProducts />} />
        </Route>

        <Route path="/delivery-partner" element={<DeliveryRoute />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DeliveryDashboard />} />
          <Route path="orders" element={<DeliveryAvailableOrders />} />
          <Route path="earnings" element={<DeliveryEarnings />} />
          <Route path="history" element={<DeliveryHistory />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
