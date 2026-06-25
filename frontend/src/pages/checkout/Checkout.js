import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { Input, Select, Image } from "@chakra-ui/react"
import {RiShoppingCart2Line} from "react-icons/ri"
import './checkout.css'
import { saveAddressshipping, savepaymentmethod, saveDeliveryOption } from '../../actions/cartActions'
import { useDispatch, useSelector } from 'react-redux'
import { formatCurrency } from '../../utils/formatCurrency'

const Checkout = ({history}) => {
    const cart = useSelector((state) => state.cart)
    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const { shippingAddress, cartItems } = cart



    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [country, setCountry] = useState(shippingAddress.country || 'Nigeria')
    const [Payment, setPayment] = useState(cart.paymentMethod || 'card')
    const [deliveryOption, setDeliveryOption] = useState(cart.deliveryOption || 'standard')

    const dispatch = useDispatch()
    const [carddetails, setcarddetails] = useState((cart.paymentMethod || 'card') === 'card')

    useEffect(() => {
        if (!userInfo) {
            history.push('/login?redirect=shipping')
        } else if (cartItems.length === 0) {
            history.push('/cart')
        }
    }, [cartItems.length, history, userInfo])

    const handleorder = (e)=>{
        e.preventDefault()
         dispatch(saveAddressshipping({ address, city, postalCode, country: country || 'Nigeria'}))
         dispatch(savepaymentmethod(Payment || 'card'))
         dispatch(saveDeliveryOption(deliveryOption))
         history.push('/placeorder')

    }

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)
    const shipping =
        deliveryOption === 'pickup'
            ? 0
            : deliveryOption === 'express'
                ? 20
                : (subtotal > 100 ? 0 : 10)
    const tax = subtotal * 0.1
    const total = subtotal + shipping + tax

    return (
        <div>
            <Helmet>
                <title>Checkout</title>
            </Helmet>

            <div className="checkout-container">
                <div className="checkout-wrapper">
                    {/* LEFT SIDE - BILLING FORM */}
                    <div className="checkout-left">
                        <form onSubmit={handleorder}>
                            {/* BILLING ADDRESS SECTION */}
                            <div className="checkout-section">
                                <h2 className="section-title">Billing Address</h2>
                                
                                <div className="form-group">
                                    <label htmlFor="address">Address</label>
                                    <Input 
                                        className="modern-input"
                                        type="text"
                                        id="address" 
                                        placeholder="Street address" 
                                        value={address} 
                                        onChange={(e) => setAddress(e.target.value)}
                                        required 
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Country</label>
                                    <Select 
                                        className="modern-select"
                                        value={country || 'Nigeria'} 
                                        onChange={(e) => setCountry(e.target.value)}
                                    >
                                        <option value="Nigeria">Nigeria</option>
                                        <option value="Ghana">Ghana</option>
                                        <option value="Kenya">Kenya</option>
                                        <option value="United States">United States</option>
                                    </Select>
                                </div>

                                <div className="form-group">
                                    <label>Delivery Option</label>
                                    <Select
                                        className="modern-select"
                                        value={deliveryOption}
                                        onChange={(e) => setDeliveryOption(e.target.value)}
                                    >
                                        <option value="standard">Standard (3–5 days)</option>
                                        <option value="express">Express (1–2 days)</option>
                                        <option value="pickup">Store Pickup</option>
                                    </Select>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="city">City</label>
                                        <Input 
                                            className="modern-input"
                                            type="text"
                                            id="city" 
                                            placeholder="City" 
                                            value={city} 
                                            onChange={(e) => setCity(e.target.value)}
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="zip">ZIP Code</label>
                                        <Input 
                                            className="modern-input"
                                            type="text"
                                            id="zip" 
                                            placeholder="12345" 
                                            value={postalCode} 
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* PAYMENT METHOD SECTION */}
                            <div className="checkout-section">
                                <h2 className="section-title">Payment Method</h2>
                                
                                <div className="payment-options">
                                    <div className={`payment-card ${carddetails ? 'active' : ''}`}>
                                        <input 
                                            type="radio" 
                                            id="payment-card" 
                                            name="payment"
                                            checked={carddetails}
                                            onChange={() => {setcarddetails(true); setPayment('card')}}
                                        />
                                        <label htmlFor="payment-card" className="payment-label">
                                            <span className="payment-title">Credit Card</span>
                                            <div className="card-logos">
                                                <Image src="https://i.imgur.com/AHCoUZO.png" alt="visa"/>
                                                <Image src="https://i.imgur.com/l8OAGyo.png" alt="master"/>
                                                <Image src="https://i.imgur.com/IDHC2iv.png" alt="discover"/>
                                            </div>
                                        </label>
                                    </div>

                                    <div className={`payment-card ${!carddetails ? 'active' : ''}`}>
                                        <input 
                                            type="radio" 
                                            id="payment-paypal" 
                                            name="payment"
                                            checked={!carddetails}
                                            onChange={() => {setcarddetails(false); setPayment('paypal')}}
                                        />
                                        <label htmlFor="payment-paypal" className="payment-label">
                                            <span className="payment-title">PayPal</span>
                                            <Image src='https://i.imgur.com/W5vSLzb.png' alt="paypal" />
                                        </label>
                                    </div>
                                </div>

                                {/* CARD DETAILS */}
                                <div className={`card-details ${carddetails ? 'visible' : 'hidden'}`}>
                                    <div className="form-group">
                                        <label htmlFor="name-card">Name on Card</label>
                                        <Input 
                                            className="modern-input"
                                            type="text"
                                            id="name-card" 
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="number-card">Card Number</label>
                                        <Input 
                                            className="modern-input"
                                            type="text"
                                            id="number-card"  
                                            placeholder="4532 1234 5678 9010"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="expir-mt-card">Expiry Month</label>
                                            <Input 
                                                className="modern-input"
                                                type="text"
                                                id="expir-mt-card"  
                                                placeholder="01"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exp-year">Expiry Year</label>
                                            <Input 
                                                className="modern-input"
                                                type="text"
                                                id="exp-year"  
                                                placeholder="2025"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cvv-check">CVV</label>
                                            <Input 
                                                className="modern-input"
                                                type="text"
                                                id="cvv-check"  
                                                placeholder="123"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="checkout-btn">
                                Place Order
                            </button>
                        </form>
                    </div>

                    {/* RIGHT SIDE - ORDER SUMMARY */}
                    <div className="checkout-right">
                        <div className="order-summary">
                            <h2 className="summary-title">Order Summary</h2>
                            
                            {cartItems.length === 0 ? (
                                <div className="empty-cart">
                                    <RiShoppingCart2Line size="40"/>
                                    <p>Your cart is empty</p>
                                </div>
                            ) : (
                                <>
                                    <div className="summary-items">
                                        {cartItems.map((item, index) => (
                                            <div key={index} className="summary-item">
                                                <div className="item-details">
                                                    <p className="item-name">{item.name}</p>
                                                    <p className="item-qty">Qty: {item.qty}</p>
                                                </div>
                                                <p className="item-price">{formatCurrency(item.qty * item.price)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="summary-divider"></div>

                                    <div className="summary-totals">
                                        <div className="total-row">
                                            <span>Subtotal</span>
                                            <span className="total-value">{formatCurrency(subtotal)}</span>
                                        </div>
                                        <div className="total-row">
                                            <span>Shipping</span>
                                            <span className="total-value">{formatCurrency(shipping)}</span>
                                        </div>
                                        <div className="total-row">
                                            <span>Tax (10%)</span>
                                            <span className="total-value">{formatCurrency(tax)}</span>
                                        </div>
                                        <div className="total-row total-final">
                                            <span>Total</span>
                                            <span className="total-value">{formatCurrency(total)}</span>
                                        </div>
                                    </div>

                                    <div className="security-badge">
                                        <span>🔒 Secure checkout</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Checkout
