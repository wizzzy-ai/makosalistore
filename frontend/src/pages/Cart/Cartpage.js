import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../actions/cartActions';
import Empty from '../../components/Empty';
import Productoncart from '../../components/Productoncart';
import { formatCurrency } from '../../utils/formatCurrency';
import './cartcss.css';

const Cartpage = ({ match, location, history }) => {
  const { id } = match.params;
  const qty = location.search ? Number(location.search.split('=')[1]) : 1;

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (id) {
      if (!userInfo) {
        history.push(`/login?redirect=/cart/${id}?qty=${qty}`)
        return
      }
      dispatch(addToCart(id, qty));
    }
  }, [dispatch, id, qty, history, userInfo]);

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping');
  };

  const itemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <>
      <Helmet>
        <title>Cart</title>
      </Helmet>

      <section className="cart-page cart-page--with-bg">
        <div className="cart-shell">
          <div className="cart-header">
            <span className="cart-kicker">Cart</span>
            <h1>Shopping cart</h1>
            <p>Review your items and continue to checkout when you are ready.</p>
          </div>

          {cartItems.length === 0 ? (
            <Empty />
          ) : (
            <div className="cart-layout">
              <div className="cart-main">
                <div className="cart-toolbar cart-toolbar--simple">
                  <h2>{itemCount === 1 ? '1 item in your cart' : `${itemCount} items in your cart`}</h2>
                  <Link className="cart-continue" to="/shop">
                    Continue shopping
                  </Link>
                </div>

                <div className="productsoncart">
                  {cartItems.map((product) => (
                    <Productoncart key={product.product} product={product} />
                  ))}
                </div>
              </div>

              <aside className="cart-summary">
                <div className="cart-summaryCard">
                  <h2>Order summary</h2>

	                  <div className="cart-summaryRow">
	                    <span>Subtotal</span>
	                    <strong>{formatCurrency(subtotal)}</strong>
	                  </div>
                  <div className="cart-summaryRow">
                    <span>Items</span>
                    <strong>{itemCount}</strong>
                  </div>
                  <div className="cart-summaryRow">
                    <span>Delivery</span>
                    <strong>Free</strong>
                  </div>
	                  <div className="cart-summaryRow cart-summaryRow--total">
	                    <span>Total</span>
	                    <strong>{formatCurrency(subtotal)}</strong>
	                  </div>

                  <button
                    className="checkoutbtn"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed to checkout
                  </button>

                  <p className="cart-summaryNote">
                    Shipping, taxes, and payment details will be confirmed during checkout.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Cartpage;
