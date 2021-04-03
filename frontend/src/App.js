import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom';


import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import Home from './components/Home';
import ProductDetail from './components/product/ProductDetail';
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import NewPassword from './components/user/NewPassword';

import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import Payment from './components/cart/Payment';
import OrderSuccess from './components/cart/OrderSuccess';
import ListOrders from './components/order/ListOrders';
import OrderDetails from './components/order/OrderDetails';
import Dashboard from './components/admin/Dashboard';
import ProductList from './components/admin/ProductList';
import NewProduct from './components/admin/NewProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import OrderList from './components/admin/OrderList';
import UpdateOrder from './components/admin/UpdateOrder';
import UserList from './components/admin/UserList';
import UpdateUser from './components/admin/UpdateUser';

import './App.css';

import ProtectedRouter from './components/route/ProtectedRouter'
import { loadUser } from './actions/userActions';
import store from './store';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


function App() {

  const [stripeApiKey, setStripeApiKey] = useState('')

  // const { loading, user } = useSelector(state => state.auth)

  useEffect(() => {
    store.dispatch(loadUser());

    async function getStripeApiKey() {
      const { data } = await axios.get('/api/v1/stripeapi');
      setStripeApiKey(data.stripeApiKey)
    }

    getStripeApiKey()

  }, [])
  return (
    <Router>
      <div className="App">
        <Header />

        <div className="container container-fluid">
          <Route path="/" component={Home} exact />
          <Route path="/search/:keyword" component={Home} exact />
          <Route path="/product/:id" component={ProductDetail} exact />
          <Route path="/login" component={Login} exact />
          <Route path="/register" component={Register} exact />
          <ProtectedRouter path="/me" component={Profile} exact />
          <ProtectedRouter path="/me/update" component={UpdateProfile} exact />
          <ProtectedRouter path="/password/update" component={UpdatePassword} exact />
          <Route path="/password/forgot" component={ForgotPassword} exact />
          <Route path="/password/reset/:token" component={NewPassword} exact />

          <Route path="/cart" component={Cart} exact />
          <ProtectedRouter path="/shipping" component={Shipping} exact />
          <ProtectedRouter path="/order/confirm" component={ConfirmOrder} exact />
          <ProtectedRouter path="/success" component={OrderSuccess} exact />
          {stripeApiKey &&
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRouter path="/payment" component={Payment} exact />
            </Elements>
          }
          <ProtectedRouter path="/orders/me" component={ListOrders} exact />
          <ProtectedRouter path="/order/:id" component={OrderDetails} exact />

        </div>
        <ProtectedRouter path="/dashboard" isAdmin={true} component={Dashboard} exact />
        <ProtectedRouter path="/admin/products" isAdmin={true} component={ProductList} exact />
        <ProtectedRouter path="/admin/newProduct" isAdmin={true} component={NewProduct} exact />
        <ProtectedRouter path="/admin/product/:id" isAdmin={true} component={UpdateProduct} exact />
        <ProtectedRouter path="/admin/orders" isAdmin={true} component={OrderList} />
        <ProtectedRouter path="/admin/order/:id" isAdmin={true} component={UpdateOrder} exact />
        <ProtectedRouter path="/admin/users" isAdmin={true} component={UserList} exact />
        <ProtectedRouter path="/admin/user/:id" isAdmin={true} component={UpdateUser} exact />

        {/* //{!loading && user.role !== 'admin' && (
          <Footer />
        )} */}
        <Footer />

      </div>

    </Router>
  );
}

export default App;
