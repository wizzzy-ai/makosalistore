import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { FiLock, FiMail, FiUser } from 'react-icons/fi';
import HashLoader from 'react-spinners/HashLoader';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import '../pages/Login/logincss.css';
import { formatCurrency } from '../utils/formatCurrency';

const ProfileScreen = ({ history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { loading: loadingUpdate, error: errorUpdate, success } = userUpdateProfile;

  const orderMylist = useSelector((state) => state.orderMylist);
  const { loading: loadingOrders, error: errorOrders, orders = [] } = orderMylist;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
      return;
    }

    if (!user || !user.name) {
      dispatch(getUserDetails('profile'));
    }
  }, [dispatch, user, userInfo, history]);

  useEffect(() => {
    if (userInfo) {
      dispatch(listMyOrders());
    }
  }, [userInfo, dispatch]);

  useEffect(() => {
    if (success) {
      dispatch(getUserDetails('profile'));
      setPassword('');
      setConfirmPassword('');
      setMessage(null);
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (user && user.name) {
      setName(user.name);
      setEmail(user.email || '');
    }
  }, [user]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setMessage(null);
    dispatch(updateUserProfile({ id: user._id, name, email, password }));
  };

  return (
    <section className="settings-page settings-page--profile">
      <Helmet>
        <title>Settings</title>
      </Helmet>

      <div className="settings-wrap">
        <div className="settings-heading">
          <span className="account-kicker">Settings</span>
          <h1>Account settings</h1>
          <p>Update your profile and review your orders without leaving the flow of the store.</p>
        </div>

        <div className="settings-grid">
          <div className="account-card">
            <div className="account-cardHead">
              <h2>Profile details</h2>
              <p>Email stays read-only here. You can update your name and password.</p>
            </div>

            {(error || errorUpdate || message) && (
              <div className="account-message account-message--error">{message || errorUpdate || error}</div>
            )}
            {success && <div className="account-message account-message--success">Profile updated successfully.</div>}

            {loading ? (
              <div className="settings-loader">
                <HashLoader color="#1e1e2c" loading={loading} size={38} />
              </div>
            ) : (
              <form className="account-form" onSubmit={submitHandler}>
                <label className="account-field" htmlFor="settings-name">
                  <span>Name</span>
                  <div className="account-inputRow">
                    <FiUser className="account-inputIcon" />
                    <input
                      id="settings-name"
                      type="text"
                      value={name}
                      placeholder="Enter your name"
                      autoComplete="name"
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </label>

                <label className="account-field" htmlFor="settings-email">
                  <span>Email</span>
                  <div className="account-inputRow account-inputRow--readonly">
                    <FiMail className="account-inputIcon" />
                    <input id="settings-email" type="email" value={email} autoComplete="email" readOnly />
                  </div>
                </label>

                <label className="account-field" htmlFor="settings-password">
                  <span>New password</span>
                  <div className="account-inputRow">
                    <FiLock className="account-inputIcon" />
                    <input
                      id="settings-password"
                      type="password"
                      value={password}
                      placeholder="Leave blank to keep your current password"
                      autoComplete="new-password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </label>

                <label className="account-field" htmlFor="settings-confirm-password">
                  <span>Confirm password</span>
                  <div className="account-inputRow">
                    <FiLock className="account-inputIcon" />
                    <input
                      id="settings-confirm-password"
                      type="password"
                      value={confirmPassword}
                      placeholder="Confirm your new password"
                      autoComplete="new-password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </label>

                <button className="account-button" type="submit" disabled={loadingUpdate}>
                  {loadingUpdate ? 'Saving...' : 'Save changes'}
                </button>
              </form>
            )}
          </div>

          <div className="settings-side">
            <div className="settings-summary">
              <h3>{name || 'Your account'}</h3>
              <p>{email || 'Signed in member'}</p>
              <div className="settings-stats">
                <div>
                  <span>Orders</span>
                  <strong>{orders.length}</strong>
                </div>
                <div>
                  <span>Paid</span>
                  <strong>{orders.filter((order) => order.isPaid).length}</strong>
                </div>
              </div>
            </div>

            <div className="settings-summary">
              <h3>Quick note</h3>
              <p>Your recent orders are listed below with direct links to the full order page.</p>
            </div>
          </div>
        </div>

        <div className="orders-panel">
          <div className="orders-panelHead">
            <h2>My orders</h2>
          </div>

          {loadingOrders ? (
            <div className="settings-loader">
              <HashLoader color="#1e1e2c" loading={loadingOrders} size={38} />
            </div>
          ) : errorOrders ? (
            <div className="account-message account-message--error">{errorOrders}</div>
          ) : orders.length === 0 ? (
            <div className="orders-empty">You have no orders yet.</div>
          ) : (
            <div className="orders-tableWrap">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Delivered</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>{formatCurrency(order.totalPrice || 0)}</td>
                      <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'Not paid'}</td>
                      <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'Not delivered'}</td>
                      <td>
                        <Link className="orders-link" to={`/order/${order._id}`}>
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfileScreen;
