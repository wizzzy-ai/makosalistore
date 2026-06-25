import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { CreateOrder } from '../../actions/orderActions'
import { clearCartItems } from '../../actions/cartActions'
import LottiePlayer from '../../components/LottiePlayer'
import { formatCurrency } from '../../utils/formatCurrency'

import './Placeorder.css'

const Placeorder = ({ history }) => {
  const dispatch = useDispatch()
  const [showOrderConfirmed, setShowOrderConfirmed] = useState(false)
  const [dismissRequested, setDismissRequested] = useState(false)

  const cart = useSelector((state) => state.cart)
  const { userInfo } = useSelector((state) => state.userLogin)
  const { order, success, error, loading } = useSelector((state) => state.orderCreate)

  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2)

  const deliveryOption = cart.deliveryOption || 'standard'
  const paymentMethod = cart.paymentMethod || 'card'

  const normalizedShippingAddress = useMemo(() => {
    const shippingAddress = cart.shippingAddress || {}
    const country =
      typeof shippingAddress.country === 'string' && shippingAddress.country.trim()
        ? shippingAddress.country.trim()
        : 'Nigeria'
    return {
      ...shippingAddress,
      country,
    }
  }, [cart.shippingAddress])

  cart.itemsPrice = addDecimals(
    (cart.cartItems || []).reduce((acc, item) => acc + item.price * item.qty, 0),
  )

  const computedShipping =
    deliveryOption === 'pickup'
      ? 0
      : deliveryOption === 'express'
        ? 20
        : Number(cart.itemsPrice) > 100
          ? 0
          : 10

  cart.shippingPrice = addDecimals(computedShipping)
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)))
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2)

  const Placeorderhanlder = () => {
    dispatch(
      CreateOrder({
        orderItems: cart.cartItems,
        shippingAddress: normalizedShippingAddress,
        paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        deliveryOption,
      }),
    )
  }

  useEffect(() => {
    if (!userInfo) {
      history.push('/login?redirect=shipping')
      return
    }
    // Don't kick the user out while the confirmation overlay is showing.
    if ((cart.cartItems || []).length === 0 && !showOverlay) {
      history.push('/cart')
      return
    }
    if (!cart.shippingAddress?.address) {
      history.push('/shipping')
      return
    }
    if (success && order && order._id) {
      dispatch(clearCartItems())
      setShowOrderConfirmed(true)
      if (dismissRequested) {
        history.push('/cart')
      }
    }
  }, [
    cart.cartItems,
    cart.paymentMethod,
    cart.shippingAddress,
    dismissRequested,
    dispatch,
    history,
    order,
    success,
    userInfo,
  ])

  const showOverlay = showOrderConfirmed || loading
  const canDismissOverlay = showOrderConfirmed && !loading

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return
      if (!canDismissOverlay) return
      history.push('/cart')
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [canDismissOverlay, history])

  const onOverlayClick = () => {
    if (loading) {
      setDismissRequested(true)
      return
    }
    if (!canDismissOverlay) return
    history.push('/cart')
  }

  return (
    <div className="placeorder-page">
      {showOverlay && (
        <div
          className={`order-confirmed ${canDismissOverlay ? 'order-confirmed--dismissable' : ''}`}
          role="status"
          aria-live="polite"
          onClick={onOverlayClick}
          aria-label={
            canDismissOverlay
              ? 'Order placed. Click anywhere to go back to cart.'
              : 'Processing payment'
          }
        >
          <div className="order-confirmed__panel">
            <LottiePlayer
              src={
                process.env.REACT_APP_ORDER_CONFIRMED_LOTTIE_SRC ||
                '/lottie/payment-success.json'
              }
              loop={false}
            />
            <div className="order-confirmed__title">
              {loading ? 'Processing payment…' : 'Order placed successfully'}
            </div>
            <div className="order-confirmed__sub">
              {loading
                ? 'Please wait a moment. (You can click now and it will go back when ready.)'
                : 'Click anywhere to go back to cart.'}
            </div>
          </div>
        </div>
      )}

      <Helmet>
        <title>Place Order</title>
      </Helmet>

      <div className="placeorder__layout">
        <div className="placeorder__main">
          <section className="placeorder__card" aria-label="Shipping details">
            <h2 className="placeorder__title">Shipping</h2>
            <div className="placeorder__rows">
              <div className="placeorder__row">
                <span className="placeorder__label">Address</span>
                <span className="placeorder__value">
                  {normalizedShippingAddress.address}, {normalizedShippingAddress.city},{' '}
                  {normalizedShippingAddress.postalCode},{' '}
                  {normalizedShippingAddress.country}
                </span>
              </div>
              <div className="placeorder__row">
                <span className="placeorder__label">Delivery</span>
                <span className="placeorder__value placeorder__pill">{deliveryOption}</span>
              </div>
            </div>
          </section>

          <section className="placeorder__card" aria-label="Payment method">
            <h2 className="placeorder__title">Payment</h2>
            <div className="placeorder__rows">
              <div className="placeorder__row">
                <span className="placeorder__label">Method</span>
                <span className="placeorder__value placeorder__pill">{paymentMethod}</span>
              </div>
            </div>
          </section>

          <section className="placeorder__card" aria-label="Order items">
            <div className="placeorder__cardhead">
              <h2 className="placeorder__title">Order Items</h2>
              <span className="placeorder__muted">{cart.cartItems.length} item(s)</span>
            </div>

            {cart.cartItems.length === 0 ? (
              <div className="placeorder__empty">Your cart is empty</div>
            ) : (
              <div className="orders-placeorder">
                {cart.cartItems.map((item, index) => (
                  <div className="placeorder__item" key={item.product || index}>
                    <div className="placeorder__itemname">
                      <Link className="placeorder__link" to={`/product/${item.product}`}>
                        {item.name}
                      </Link>
                    </div>
	                    <div className="placeorder__itemcalc">
	                      {item.qty} x {formatCurrency(item.price)}
	                    </div>
	                    <div className="placeorder__itemtotal">{formatCurrency(addDecimals(item.qty * item.price))}</div>
	                  </div>
	                ))}
	              </div>
            )}
          </section>
        </div>

        <aside className="placeorder__summary" aria-label="Order summary">
          <div className="cart-summ">
            <h1 className="placeorder__summarytitle">Order Summary</h1>

            <div className="calculs-placeorder" role="list">
	              <div className="placeorder__sumrow" role="listitem">
	                <span>Items</span>
	                <span>{formatCurrency(cart.itemsPrice)}</span>
	              </div>
	              <div className="placeorder__sumrow" role="listitem">
	                <span>Shipping</span>
	                <span>{formatCurrency(cart.shippingPrice)}</span>
	              </div>
	              <div className="placeorder__sumrow" role="listitem">
	                <span>Tax</span>
	                <span>{formatCurrency(cart.taxPrice)}</span>
	              </div>
              <div className="placeorder__divider" aria-hidden="true" />
	              <div className="placeorder__sumrow placeorder__sumrow--total" role="listitem">
	                <span>Total</span>
	                <span>{formatCurrency(cart.totalPrice)}</span>
	              </div>

              {error && (
                <div className="placeorder__error" role="alert">
                  {error}
                </div>
              )}

              <div className="div-placeorder-btn">
                <button
                  className="placeorder-btn"
                  onClick={Placeorderhanlder}
                  disabled={loading || cart.cartItems.length === 0}
                >
                  {loading ? 'Placing order…' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Placeorder
