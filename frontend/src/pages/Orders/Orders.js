import React,{useEffect, useState} from 'react'
import { listOrders} from '../../actions/orderActions';
import { useDispatch, useSelector } from 'react-redux';
import HashLoader from "react-spinners/HashLoader";
import AdminLayout from '../../components/AdminLayout';
import { Link } from 'react-router-dom';
import { FiEdit2, FiSearch, FiFilter, FiDownload, FiPackage, FiCalendar, FiDollarSign, FiUser, FiCheck, FiX, FiClock, FiTruck } from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatCurrency';
import './Orders.css';

const Orders = ({history}) => {
    const dispatch = useDispatch()
    const orderList = useSelector(state => state.orderList)
    const {loading,error,orders} = orderList
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterPayment, setFilterPayment] = useState('all')

    useEffect(()=>{
        if(userInfo && userInfo.isAdmin){
            dispatch(listOrders())
        }else{
            history.push('/login')
        }
    },[dispatch,history,userInfo])

    const filteredOrders = orders?.filter(order => {
        const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (order.user && order.user.name && order.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesStatus = filterStatus === 'all' || 
                            (filterStatus === 'delivered' && order.isDelivered) ||
                            (filterStatus === 'pending' && !order.isDelivered)
        const matchesPayment = filterPayment === 'all' ||
                             (filterPayment === 'paid' && order.isPaid) ||
                             (filterPayment === 'unpaid' && !order.isPaid)
        return matchesSearch && matchesStatus && matchesPayment
    }) || []

    const stats = {
        total: orders?.length || 0,
        delivered: orders?.filter(o => o.isDelivered).length || 0,
        pending: orders?.filter(o => !o.isDelivered).length || 0,
        paid: orders?.filter(o => o.isPaid).length || 0,
        unpaid: orders?.filter(o => !o.isPaid).length || 0,
        totalRevenue: orders?.reduce((sum, order) => sum + (order.totalPrice || 0), 0) || 0
    }

    return (
        <AdminLayout>
            <div className='orders-container'>
                {/* Header Section */}
                <div className='orders-header'>
                    <div className='header-left'>
                        <h1 className='page-title'>Order Management</h1>
                        <p className='page-subtitle'>Manage customer orders and fulfillment</p>
                    </div>
                    <div className='header-actions'>
                        <button className='btn btn-primary'>
                            <FiPackage size={16} />
                            New Order
                        </button>
                        <button className='btn btn-secondary'>
                            <FiDownload size={16} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className='stats-row'>
                    <div className='stat-card'>
                        <div className='stat-icon'>
                            <FiPackage size={20} />
                        </div>
                        <div className='stat-content'>
                            <h3>{stats.total}</h3>
                            <p>Total Orders</p>
                        </div>
                    </div>
                    <div className='stat-card'>
                        <div className='stat-icon delivered'>
                            <FiCheck size={20} />
                        </div>
                        <div className='stat-content'>
                            <h3>{stats.delivered}</h3>
                            <p>Delivered</p>
                        </div>
                    </div>
                    <div className='stat-card'>
                        <div className='stat-icon pending'>
                            <FiClock size={20} />
                        </div>
                        <div className='stat-content'>
                            <h3>{stats.pending}</h3>
                            <p>Pending</p>
                        </div>
                    </div>
                    <div className='stat-card'>
                        <div className='stat-icon revenue'>
                            <FiDollarSign size={20} />
                        </div>
                        <div className='stat-content'>
	                            <h3>{formatCurrency(stats.totalRevenue)}</h3>
                            <p>Total Revenue</p>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className='filters-section'>
                    <div className='search-box'>
                        <FiSearch size={18} className='search-icon' />
                        <input
                            type='text'
                            placeholder='Search orders by ID or customer name...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className='filter-buttons'>
                        <div className='filter-group'>
                            <label>Status:</label>
                            <select 
                                value={filterStatus} 
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className='filter-select'
                            >
                                <option value='all'>All Status</option>
                                <option value='delivered'>Delivered</option>
                                <option value='pending'>Pending</option>
                            </select>
                        </div>
                        <div className='filter-group'>
                            <label>Payment:</label>
                            <select 
                                value={filterPayment} 
                                onChange={(e) => setFilterPayment(e.target.value)}
                                className='filter-select'
                            >
                                <option value='all'>All Payment</option>
                                <option value='paid'>Paid</option>
                                <option value='unpaid'>Unpaid</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className='table-container'>
                    {loading ? (
                        <div className='loading-container'>
                            <HashLoader color={'#000000'} loading={loading} size={40} />
                        </div>
                    ) : error ? (
                        <div className='error-message'>
                            <p>{error}</p>
                        </div>
                    ) : (
                        <table className='orders-table'>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Payment Status</th>
                                    <th>Delivery Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <tr key={order._id}>
                                        <td>
                                            <div className='order-id'>
                                                <span className='id-text'>#{order._id.slice(-8)}</span>
                                                <span className='id-full'>{order._id}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='customer-info'>
                                                <div className='customer-avatar'>
                                                    <FiUser size={16} />
                                                </div>
                                                <div className='customer-details'>
                                                    <div className='customer-name'>{order.user ? order.user.name : 'Guest'}</div>
                                                    <div className='customer-email'>{order.user ? order.user.email : 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='date-info'>
                                                <FiCalendar size={14} />
                                                <span>{order.createdAt ? order.createdAt.substring(0,10) : 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='price-info'>
                                                <span className='price-amount'>{formatCurrency(order.totalPrice || 0)}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${order.isPaid ? 'paid' : 'unpaid'}`}>
                                                {order.isPaid ? (
                                                    <><FiCheck size={12} /> Paid</>
                                                ) : (
                                                    <><FiX size={12} /> Unpaid</>
                                                )}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${order.isDelivered ? 'delivered' : 'pending'}`}>
                                                {order.isDelivered ? (
                                                    <><FiCheck size={12} /> Delivered</>
                                                ) : (
                                                    <><FiTruck size={12} /> {(order.delivery && order.delivery.status) ? order.delivery.status : 'Pending'}</>
                                                )}
                                            </span>
                                        </td>
                                        <td>
                                            <div className='action-buttons'>
                                                <Link to={`/order/${order._id}`} className='action-btn view'>
                                                    <FiEdit2 size={16} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}

export default Orders
