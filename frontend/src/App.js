import Nav from './components/Nav'
import Home from './pages/Home'
import About from './pages/About/About'
import Shop from './pages/Shop'
import Contactus from './pages/Contactus/Contactus'
import Productpage from './pages/Product/Productpage'
import Cartpage from './pages/Cart/Cartpage'
import Footer from './pages/Footer/Footer'
import LoginScreen from './pages/Login/LoginScreen'
import React, {useState,useEffect} from 'react'
import {BrowserRouter as Router , Switch ,Route, useLocation } from 'react-router-dom'
// import { ChakraProvider, CSSReset } from "@chakra-ui/react"
import ScrollIntoView from "./components/Scrollintoview";
import LoadingScreen from './components/LoadingScreen';
import RegisterScreen from './components/RegisterScreen'
import ProfileScreen from './components/ProfileScreen'
import Checkout from "./pages/checkout/Checkout";
import Placeorder from './pages/placeorder/Placeorder'
import Order from './pages/Order/Order'
import FoodDeliveryPage from './pages/FoodDelivery/FoodDeliveryPage'
import Users from './pages/Userslist/Users'
import NotFoundPage from './components/Notfoundpage'
import Edituser from './pages/Useredit/Edituser'
import Products from './pages/products/products'
import Editproduct from './pages/Editproduct/Editproduct'
import Orders from './pages/Orders/Orders'
	import Dashboard from './pages/Admin/Dashboard'
	import Analytics from './pages/Admin/Analytics'
	import Settings from './pages/Admin/Settings'




const AppContent = ({ loading, showLoader }) => {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <>
      {showLoader && <LoadingScreen visible={loading} />}
      {!isAdminPage && <Nav/>}
      <Switch>              
        <Route path="/" exact component={Home}/>
        <Route path="/about" component={About}/>
        <Route path="/shop" component={Shop}/>
        <Route path="/contact-us" component={Contactus}/>
        <Route path="/product/:id" component={Productpage}/>
        <Route path="/cart/:id?" component={Cartpage}/>
        <Route path="/login" component={LoginScreen}/>
        <Route path="/register" component={RegisterScreen}/>
        <Route path="/profile" component={ProfileScreen}/>
        <Route path="/shipping" component={Checkout}/>
        <Route path="/placeorder" component={Placeorder}/>
        <Route path="/order/:id" component={Order}/>
        <Route path="/food-drinks" component={FoodDeliveryPage}/>
        

        <Route path="/search/:keyword" component={Shop}/>

        {/* Admin Routes */}
        <Route path="/admin" exact component={Dashboard}/>
        <Route path="/admin/users" component={Users}/>
        <Route path="/admin/user/:id/edit" component={Edituser}/>
        <Route path="/admin/products" component={Products}/>
        <Route path="/admin/product/:id/edit" component={Editproduct}/>
	        <Route path="/admin/orders" component={Orders}/>
	        <Route path="/admin/analytics" component={Analytics}/>
	        <Route path="/admin/settings" component={Settings}/>

	        <Route component={NotFoundPage} />
	      </Switch>
	      {!isAdminPage && <Footer/>}
    </>
  )
}

const App = () => { 
  const LOADING_MIN_MS = 5000
  const LOADER_FADE_MS = 1200

  const [loading,setLoading] = useState(true)
  const [showLoader, setShowLoader] = useState(true)
	   
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false)
    }, LOADING_MIN_MS)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (loading) {
      setShowLoader(true)
      return
    }

    const t = setTimeout(() => {
      setShowLoader(false)
    }, LOADER_FADE_MS)

    return () => clearTimeout(t)
  }, [loading])

  return (
    <div className='main'>
      <Router>
        <ScrollIntoView>
          <AppContent loading={loading} showLoader={showLoader} />
        </ScrollIntoView>
      </Router>
    </div>
  )
}
export default App;
