import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowRight, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { register } from '../actions/userActions';
import '../pages/Login/logincss.css';

const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const redirectOnce = useRef(false);

  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);
  const { error, loading, userInfo } = userRegister;

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (!userInfo || redirectOnce.current) return;

    let targetPath = redirect;
    if (targetPath.startsWith('/admin') && !userInfo.isAdmin) {
      targetPath = '/';
    }

    if (targetPath === '/login' || history.location.pathname === targetPath) return;

    redirectOnce.current = true;
    history.push(targetPath);
  }, [history, redirect, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setMessage(null);
    dispatch(register(name, email, password));
  };

  return (
    <section className="account-page account-page--register">
      <Helmet>
        <title>Create Account</title>
      </Helmet>

      <div className="account-wrap">
        <div className="account-intro">
          <span className="account-kicker">Account</span>
          <h1>Create an account and keep it simple.</h1>
          <p>
            Join the store so your details, orders, and checkout flow stay connected whenever you
            come back.
          </p>

          <div className="account-notes-wrapper account-notes-wrapper--vertical">
            <div className="account-note">
              <h3>What you get</h3>
              <p>A faster checkout, easier order tracking, and one place to manage your profile.</p>
            </div>

            <div className="account-note">
              <h3>Exclusive Offers</h3>
              <p>Receive special discounts and promotions available only to registered members.</p>
            </div>

            <div className="account-note">
              <h3>Wishlist Feature</h3>
              <p>Save your favorite products to a wishlist for future purchases and easy access.</p>
            </div>
          </div>
        </div>

        <div className="account-card">
          <div className="account-cardHead">
            <h2>Create your account</h2>
            <p>Fill in your details below.</p>
          </div>

          {error && <div className="account-message account-message--error">{error}</div>}
          {message && <div className="account-message account-message--error">{message}</div>}

          <form className="account-form" onSubmit={submitHandler}>
            <label className="account-field" htmlFor="register-name">
              <span>Name</span>
              <div className="account-inputRow">
                <FiUser className="account-inputIcon" />
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  placeholder="Enter your name"
                  autoComplete="name"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </label>

            <label className="account-field" htmlFor="register-email">
              <span>Email</span>
              <div className="account-inputRow">
                <FiMail className="account-inputIcon" />
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </label>

            <label className="account-field" htmlFor="register-password">
              <span>Password</span>
              <div className="account-inputRow">
                <FiLock className="account-inputIcon" />
                <input
                  id="register-password"
                  type="password"
                  value={password}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </label>

            <label className="account-field" htmlFor="register-confirm-password">
              <span>Confirm password</span>
              <div className="account-inputRow">
                <FiLock className="account-inputIcon" />
                <input
                  id="register-confirm-password"
                  type="password"
                  value={confirmPassword}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </label>

            <button className="account-button" type="submit" disabled={loading}>
              <span>{loading ? 'Creating account...' : 'Create account'}</span>
              <FiArrowRight />
            </button>
          </form>

          <p className="account-switch">
            Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Sign in</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterScreen;
