import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { useDispatch, useSelector } from 'react-redux'
import { IoMdDoneAll } from 'react-icons/io'
import HashLoader from 'react-spinners/HashLoader'
import LottiePlayer from '../../components/LottiePlayer'
import { formatCurrency } from '../../utils/formatCurrency'
import {
  deliverOrder,
  getOrderDetails,
  payOrder,
  updateOrderDelivery,
} from '../../actions/orderActions'

import './Order.css'
import '../placeorder/Placeorder.css'
import {
  ORDER_DELIVER_RESET,
  ORDER_DELIVERY_UPDATE_RESET,
  ORDER_PAY_RESET,
} from '../../constants/orderConstants'
import { Button } from '@chakra-ui/button'

const Order = ({ match, history }) => {
  const [sdkReady, setsdkReady] = useState(false)
  const [deliveryStatus, setDeliveryStatus] = useState('')
  const [deliveryCarrier, setDeliveryCarrier] = useState('')
  const [deliveryTrackingNumber, setDeliveryTrackingNumber] = useState('')
  const [deliveryEstimated, setDeliveryEstimated] = useState('')
  const [deliveryMessage, setDeliveryMessage] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState('')

  const orderId = match.params.id
  const dispatch = useDispatch()

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingpay, success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const orderDeliveryUpdate = useSelector((state) => state.orderDeliveryUpdate)
  const {
    loading: loadingDeliveryUpdate,
    success: successDeliveryUpdate,
    error: errorDeliveryUpdate,
  } = orderDeliveryUpdate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  const formatDate = (value) => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return String(value)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    })
  }

  const formatDateTime = (value) => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return String(value)
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!loading && order?.orderItems) {
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
  }

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }

    const addPaypalscript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal')
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.onload = () => {
        setsdkReady(true)
      }
      document.body.appendChild(script)
    }

    if (
      !order ||
      successPay ||
      successDeliver ||
      successDeliveryUpdate ||
      order._id !== orderId
    ) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch({ type: ORDER_DELIVERY_UPDATE_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPaypalscript()
      } else {
        setsdkReady(true)
      }
    }
  }, [
    dispatch,
    history,
    order,
    orderId,
    successPay,
    successDeliver,
    successDeliveryUpdate,
    userInfo,
  ])

  useEffect(() => {
    if (order && order.delivery) {
      setDeliveryStatus(order.delivery.status || '')
      setDeliveryCarrier(order.delivery.carrier || '')
      setDeliveryTrackingNumber(order.delivery.trackingNumber || '')
      setDeliveryEstimated(
        order.delivery.estimatedDeliveryAt
          ? order.delivery.estimatedDeliveryAt.substring(0, 10)
          : ''
      )
    }
  }, [order])

  const successpaymenthandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult))
  }

  const deliverhandler = () => {
    dispatch(deliverOrder(order))
  }

  const updateDeliveryHandler = (e) => {
    e.preventDefault()
    dispatch(
      updateOrderDelivery(orderId, {
        status: deliveryStatus,
        carrier: deliveryCarrier,
        trackingNumber: deliveryTrackingNumber,
        estimatedDeliveryAt: deliveryEstimated
          ? new Date(deliveryEstimated).toISOString()
          : undefined,
        message: deliveryMessage,
        location: deliveryLocation,
        addUpdate: true,
      })
    )
    setDeliveryMessage('')
    setDeliveryLocation('')
  }

  if (loading || loadingDeliver) {
    return (
      <div className="loading-product">
        <HashLoader color={'#1e1e2c'} loading={loading || loadingDeliver} size={50} />
      </div>
    )
  }

  if (error) {
    return <h1>{error}</h1>
  }

  return (
    <section className="placeorder-page order-details-page">
      <Helmet>
        <title>ORDER</title>
      </Helmet>

      <div className="placeorder__layout">
        <div className="placeorder__main">
          <section className="placeorder__card" aria-label="Shipping details">
            <h2 className="placeorder__title">Shipping</h2>
            <div className="placeorder__rows">
              <div className="placeorder__row">
                <span className="placeorder__label">Name</span>
                <span className="placeorder__value">{order?.user?.name || '—'}</span>
              </div>

              <div className="placeorder__row">
                <span className="placeorder__label">Email</span>
                <span className="placeorder__value">
                  {order?.user?.email ? (
                    <a className="order-details__link" href={`mailto:${order.user.email}`}>
                      {order.user.email}
                    </a>
                  ) : (
                    '—'
                  )}
                </span>
              </div>

              <div className="placeorder__row">
                <span className="placeorder__label">Address</span>
                <span className="placeorder__value">
                  {order?.shippingAddress
                    ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`
                    : '—'}
                </span>
              </div>

              <div className="placeorder__row">
                <span className="placeorder__label">Delivery</span>
                <span className="placeorder__value">
                  {order?.isDelivered ? (
                    <span className="placeorder__pill order-details__pill--success">
                      Delivered {formatDateTime(order.deliveredAt)}
                    </span>
                  ) : (
                    <span className="placeorder__pill order-details__pill--muted">
                      Not delivered yet
                    </span>
                  )}
                </span>
              </div>
            </div>
          </section>

          <section className="placeorder__card" aria-label="Delivery tracking">
            <div className="placeorder__cardhead">
              <h2 className="placeorder__title">Delivery Tracking</h2>
              <span className="placeorder__muted">
                {order?.delivery?.trackingNumber ? `#${order.delivery.trackingNumber}` : ''}
              </span>
            </div>

            <div className="placeorder__rows">
              <div className="placeorder__row">
                <span className="placeorder__label">Status</span>
                <span className="placeorder__value placeorder__pill">
                  {order?.delivery?.status
                    ? order.delivery.status
                    : order?.isDelivered
                      ? 'delivered'
                      : 'processing'}
                </span>
              </div>

              <div className="placeorder__row">
                <span className="placeorder__label">Method</span>
                <span className="placeorder__value">{order?.delivery?.method || '—'}</span>
              </div>

              <div className="placeorder__row">
                <span className="placeorder__label">Carrier</span>
                <span className="placeorder__value">{order?.delivery?.carrier || '—'}</span>
              </div>

              <div className="placeorder__row">
                <span className="placeorder__label">ETA</span>
                <span className="placeorder__value">
                  {order?.delivery?.estimatedDeliveryAt
                    ? formatDate(order.delivery.estimatedDeliveryAt)
                    : '—'}
                </span>
              </div>
            </div>

            {order?.delivery?.updates?.length > 0 && (
              <div className="order-details__updates">
                {order.delivery.updates
                  .slice()
                  .reverse()
                  .map((u, idx) => (
                    <div key={idx} className="placeorder__hint">
                      <div className="order-details__updateTitle">{u.status || 'Update'}</div>
                      <div className="order-details__updateMeta">
                        {u.at ? formatDateTime(u.at) : null}
                        {u.location ? <span> • {u.location}</span> : null}
                        {u.message ? <span> • {u.message}</span> : null}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {userInfo && userInfo.isAdmin && (
              <form onSubmit={updateDeliveryHandler} className="order-details__adminForm">
                {errorDeliveryUpdate && (
                  <div className="order-details__error">{errorDeliveryUpdate}</div>
                )}
                <div className="order-details__adminGrid">
                  <input
                    className="order-details__input"
                    value={deliveryStatus}
                    onChange={(e) => setDeliveryStatus(e.target.value)}
                    placeholder="Status (e.g. shipped, out_for_delivery)"
                  />
                  <input
                    className="order-details__input"
                    value={deliveryCarrier}
                    onChange={(e) => setDeliveryCarrier(e.target.value)}
                    placeholder="Carrier (optional)"
                  />
                  <input
                    className="order-details__input"
                    value={deliveryTrackingNumber}
                    onChange={(e) => setDeliveryTrackingNumber(e.target.value)}
                    placeholder="Tracking number (optional)"
                  />
                  <input
                    className="order-details__input"
                    type="date"
                    value={deliveryEstimated}
                    onChange={(e) => setDeliveryEstimated(e.target.value)}
                  />
                  <input
                    className="order-details__input"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    placeholder="Location (optional)"
                  />
                  <input
                    className="order-details__input"
                    value={deliveryMessage}
                    onChange={(e) => setDeliveryMessage(e.target.value)}
                    placeholder="Update message (optional)"
                  />
                  <Button
                    isLoading={loadingDeliveryUpdate}
                    height="42px"
                    size="lg"
                    type="submit"
                    colorScheme="blue"
                  >
                    UPDATE DELIVERY
                  </Button>
                </div>
              </form>
            )}
          </section>

          <section className="placeorder__card" aria-label="Payment method">
            <h2 className="placeorder__title">Payment</h2>
            <div className="placeorder__rows">
              <div className="placeorder__row">
                <span className="placeorder__label">Method</span>
                <span className="placeorder__value placeorder__pill">
                  {order?.paymentMethod || '—'}
                </span>
              </div>
              <div className="placeorder__row">
                <span className="placeorder__label">Status</span>
                <span className="placeorder__value">
                  {order?.isPaid ? (
                    <span className="placeorder__pill order-details__pill--success">
                      Paid {formatDateTime(order.paidAt)}
                    </span>
                  ) : (
                    <span className="placeorder__pill order-details__pill--muted">
                      Not paid yet
                    </span>
                  )}
                </span>
              </div>
            </div>

            {order?.isPaid && (
              <div className="payment-success">
                <LottiePlayer
                  src={
                    process.env.REACT_APP_PAYMENT_SUCCESS_LOTTIE_SRC ||
                    '/lottie/payment-success.json'
                  }
                />
                <div className="payment-success__text">Payment successful</div>
              </div>
            )}
          </section>

          <section className="placeorder__card" aria-label="Order items">
            <div className="placeorder__cardhead">
              <h2 className="placeorder__title">Order Items</h2>
              <span className="placeorder__muted">{order?.orderItems?.length || 0} item(s)</span>
            </div>

            {order?.orderItems?.length === 0 ? (
              <div className="placeorder__empty">Your order is empty</div>
            ) : (
              <div className="orders-placeorder">
                {order.orderItems.map((item, index) => (
                  <div className="placeorder__item" key={item.product || index}>
                    <div className="placeorder__itemname">
                      <Link className="placeorder__link" to={`/product/${item.product}`}>
                        {item.name}
                      </Link>
                    </div>
                    <div className="placeorder__itemcalc">
                      {item.qty} × {formatCurrency(item.price)}
                    </div>
                    <div className="placeorder__itemtotal">
                      {formatCurrency(addDecimals(item.qty * item.price))}
                    </div>
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
                <span>{formatCurrency(order.itemsPrice)}</span>
              </div>
              <div className="placeorder__sumrow" role="listitem">
                <span>Shipping</span>
                <span>{formatCurrency(order.shippingPrice)}</span>
              </div>
              <div className="placeorder__sumrow" role="listitem">
                <span>Tax</span>
                <span>{formatCurrency(order.taxPrice)}</span>
              </div>
              <div className="placeorder__divider" aria-hidden="true" />
              <div className="placeorder__sumrow placeorder__sumrow--total" role="listitem">
                <span>Total</span>
                <span>{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>

            <div className="order-details__orderId">Order: {order._id}</div>

            {!order.isPaid && (
              <div className="order-details__payArea">
                {loadingpay && (
                  <div className="loading-product">
                    <HashLoader color={'#1e1e2c'} loading={loading} size={50} />
                  </div>
                )}

                {!sdkReady ? (
                  <div className="loading-product">
                    <HashLoader color={'#1e1e2c'} loading={loading} size={50} />
                  </div>
                ) : (
                  <div className="paypalbuttons">
                    <PayPalButton amount={order.totalPrice} onSuccess={successpaymenthandler} />
                  </div>
                )}
              </div>
            )}

            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <Button
                height="42px"
                size="lg"
                onClick={deliverhandler}
                leftIcon={<IoMdDoneAll size="16" />}
                colorScheme="blue"
              >
                DELIVERED
              </Button>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}

export default Order
