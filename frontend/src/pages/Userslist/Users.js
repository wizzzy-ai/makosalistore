import React,{useEffect, useState} from 'react'
import { ListUsers,DeleteUser } from '../../actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import HashLoader from "react-spinners/HashLoader";
import './Users.css'
import AdminLayout from '../../components/AdminLayout';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiSearch, FiFilter, FiDownload, FiUserPlus, FiMail, FiShoppingBag, FiCalendar } from 'react-icons/fi';
import BwConfirmDialog from '../../components/BwConfirmDialog'

const Users = ({history}) => {
    const dispatch = useDispatch()
    const userList = useSelector(state => state.userList)
    const {loading,error,users} = userList
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin
	    const userDelete = useSelector(state => state.userDelete)
	    const {success:successDelete} = userDelete
	    const [searchTerm, setSearchTerm] = useState('')
	    const [filterRole, setFilterRole] = useState('all')
	    const [confirmDeleteId, setConfirmDeleteId] = useState(null)

    useEffect(()=>{
        if(userInfo && userInfo.isAdmin){
            dispatch(ListUsers())

        }else{
            history.push('/login')
        }
    },[dispatch,history,successDelete,userInfo])

	    const deletehandler = (id) => {
	        setConfirmDeleteId(id)
	    }

	    const confirmDelete = () => {
	        if (!confirmDeleteId) return
	        dispatch(DeleteUser(confirmDeleteId))
	        setConfirmDeleteId(null)
	    }

    const filteredUsers = users?.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterRole === 'all' || 
                              (filterRole === 'admin' && user.isAdmin) ||
                              (filterRole === 'user' && !user.isAdmin)
        return matchesSearch && matchesFilter
    }) || []

    const stats = {
        total: users?.length || 0,
        admins: users?.filter(u => u.isAdmin).length || 0,
        customers: users?.filter(u => !u.isAdmin).length || 0
    }
    return (
        <AdminLayout>
            <div className='users-container'>
                {/* Header Section */}
                <div className='users-header'>
                    <div className='header-left'>
                        <h1 className='page-title'>User Management</h1>
                        <p className='page-subtitle'>Manage customer accounts and administrative access</p>
                    </div>
                    <div className='header-actions'>
                        <button className='btn btn-primary'>
                            <FiUserPlus size={16} />
                            Add User
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
                            <FiUserPlus size={20} />
                        </div>
                        <div className='stat-content'>
                            <h3>{stats.total}</h3>
                            <p>Total Users</p>
                        </div>
                    </div>
                    <div className='stat-card'>
                        <div className='stat-icon admin'>
                            <FiUserPlus size={20} />
                        </div>
                        <div className='stat-content'>
                            <h3>{stats.admins}</h3>
                            <p>Administrators</p>
                        </div>
                    </div>
                    <div className='stat-card'>
                        <div className='stat-icon customer'>
                            <FiShoppingBag size={20} />
                        </div>
                        <div className='stat-content'>
                            <h3>{stats.customers}</h3>
                            <p>Customers</p>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className='filters-section'>
                    <div className='search-box'>
                        <FiSearch size={18} className='search-icon' />
                        <input
                            type='text'
                            placeholder='Search users by name or email...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className='filter-buttons'>
                        <button 
                            className={`filter-btn ${filterRole === 'all' ? 'active' : ''}`}
                            onClick={() => setFilterRole('all')}
                        >
                            All Users
                        </button>
                        <button 
                            className={`filter-btn ${filterRole === 'admin' ? 'active' : ''}`}
                            onClick={() => setFilterRole('admin')}
                        >
                            Admins
                        </button>
                        <button 
                            className={`filter-btn ${filterRole === 'user' ? 'active' : ''}`}
                            onClick={() => setFilterRole('user')}
                        >
                            Customers
                        </button>
                    </div>
                </div>

                {/* Users Table */}
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
                        <table className='users-table'>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Contact</th>
                                    <th>Role</th>
                                    <th>Orders</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user._id}>
                                        <td>
                                            <div className='user-info'>
                                                <div className='user-avatar'>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className='user-details'>
                                                    <div className='user-name'>{user.name}</div>
                                                    <div className='user-id'>ID: {user._id.slice(-8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='contact-info'>
                                                <div className='email-row'>
                                                    <FiMail size={14} />
                                                    <a href={`mailto:${user.email}`}>{user.email}</a>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`role-badge ${user.isAdmin ? 'admin' : 'customer'}`}>
                                                {user.isAdmin ? 'Administrator' : 'Customer'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className='orders-info'>
                                                <span className='orders-count'>12</span>
                                                <span className='orders-label'>orders</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='date-info'>
                                                <FiCalendar size={14} />
                                                <span>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='action-buttons'>
                                                <Link to={`/admin/user/${user._id}/edit`} className='action-btn edit'>
                                                    <FiEdit2 size={16} />
                                                </Link>
                                                <button 
                                                    className='action-btn delete' 
                                                    onClick={() => deletehandler(user._id)}
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
	                </div>

	                <BwConfirmDialog
	                  open={Boolean(confirmDeleteId)}
	                  title="Delete user?"
	                  message="This will permanently delete the user account."
	                  confirmText="Delete"
	                  cancelText="Cancel"
	                  tone="danger"
	                  onClose={() => setConfirmDeleteId(null)}
	                  onConfirm={confirmDelete}
	                />
	            </div>
	        </AdminLayout>
	    )
	}

export default Users
