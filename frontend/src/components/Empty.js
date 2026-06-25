import React from 'react';
import { Link } from 'react-router-dom';
import LottiePlayer from './LottiePlayer';

const Empty = () => {
  const emptyCartLottieSrc = process.env.REACT_APP_EMPTY_CART_LOTTIE_SRC || '/lottie/empty-cart.json';

  return (
    <div className="Emptycart">
      <div className="emptyvisual">
        <LottiePlayer src={emptyCartLottieSrc} className="illustration" />
      </div>

      <div className="textempty">
        <span className="cart-kicker">Your bag</span>
        <h2>Your cart is empty.</h2>
        <p>Looks like you have not added anything yet. Start browsing and build your next look.</p>
        <Link to="/shop" className="goshop">
          Go to shop
        </Link>
      </div>
    </div>
  );
};

export default Empty;
