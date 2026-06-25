import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowRight, FiLock, FiMail } from 'react-icons/fi';
import login from '../../actions/userActions';
import LottiePlayer from '../../components/LottiePlayer';
import './logincss.css';

const LoginScreen = ({ location }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  // Calculate target path for redirect
  const getTargetPath = () => {
    if (!userInfo) return '/login';

    // If user is admin, redirect to admin dashboard
    if (userInfo.isAdmin) {
      return '/admin';
    }

    // For regular users, use the redirect parameter or default to home
    let targetPath = redirect;

    // If someone tried to use an admin redirect param, ignore it for non-admins.
    if (targetPath && targetPath.startsWith('/admin')) {
      targetPath = '/';
    }

    return targetPath;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  // ✅ Fixed: Use Redirect instead of null to prevent blank page
  if (userInfo) {
    return <Redirect to={getTargetPath()} />;
  }

  return (
    <section className="account-page account-page--login">
      <Helmet>
        <title>Sign In</title>
      </Helmet>

      <div className="account-wrap">
        <div className="account-intro">
          <LottiePlayer
            src="/lottie/sign-in.json"
            style={{ width: '300px', height: '300px', margin: '0 auto' }}
          />
          <span className="account-kicker">Account</span>
          <h1>Sign in and continue shopping.</h1>
          <p>
            Pick up where you left off, check your orders, and move through checkout with the same
            clean flow as the rest of the store.
          </p>

          <div className="account-notes-wrapper">
            <div className="account-note">
              <h3>Why sign in?</h3>
              <p>Keep your cart, track your orders, and manage your account details in one place.</p>
            </div>

            <div className="account-note">
              <h3>Secure Shopping</h3>
              <p>Your payment information is protected with industry-standard encryption for safe transactions.</p>
            </div>
          </div>
        </div>

        <div className="account-card">
          <div className="account-cardHead">
            <h2>Welcome back</h2>
            <p>Enter your details below.</p>
          </div>

          {error && <div className="account-message account-message--error">{error}</div>}

          <form className="account-form" onSubmit={submitHandler}>
            <label className="account-field" htmlFor="signin-email">
              <span>Email</span>
              <div className="account-inputRow">
                <FiMail className="account-inputIcon" />
                <input
                  id="signin-email"
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </label>

            <label className="account-field" htmlFor="signin-password">
              <span>Password</span>
              <div className="account-inputRow">
                <FiLock className="account-inputIcon" />
                <input
                  id="signin-password"
                  type="password"
                  value={password}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </label>

            <button className="account-button" type="submit" disabled={loading}>
              <span>{loading ? 'Signing in...' : 'Sign in'}</span>
              <FiArrowRight />
            </button>
          </form>

          <p className="account-switch">
            Don't have an account?{' '}
            <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Create one</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginScreen;