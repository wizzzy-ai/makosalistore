import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import Product from '../models/productModel.js'
import Order from '../models/orderModel.js'

const formatNaira = (value) => {
    const amount = Number(value || 0)
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 2,
    }).format(Number.isFinite(amount) ? amount : 0)
}

// @desc Get dashboard statistics
// @route GET /api/admin/statistics
// @access Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    // Get total users count
    const totalUsers = await User.countDocuments({})

    // Get total products count
    const totalProducts = await Product.countDocuments({})

    // Get total orders count
    const totalOrders = await Order.countDocuments({})

    // Get total revenue (sum of all paid orders)
    const orders = await Order.find({ isPaid: true })
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0)

    // Get recent orders (last 5)
    const recentOrders = await Order.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'id name email')

    // Get top selling products (by quantity in orders)
    const topProducts = await Product.find({})
        .sort({ numReviews: -1 }) // Using numReviews as a proxy for popularity
        .limit(5)

    // Get monthly revenue for the last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const monthlyOrders = await Order.aggregate([
        {
            $match: {
                isPaid: true,
                createdAt: { $gte: sixMonthsAgo }
            }
        },
        {
            $group: {
                _id: { 
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                revenue: { $sum: "$totalPrice" },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ])

    // Format monthly data
    const monthlyRevenue = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthKey = { 
            year: date.getFullYear(), 
            month: date.getMonth() + 1 
        }
        
        const found = monthlyOrders.find(m => 
            m._id.year === monthKey.year && m._id.month === monthKey.month
        )
        
        monthlyRevenue.push({
            month: monthNames[date.getMonth()],
            revenue: found ? found.revenue : 0,
            orders: found ? found.count : 0
        })
    }

    const calcGrowthPercent = (current, previous) => {
        const curr = Number(current || 0)
        const prev = Number(previous || 0)
        if (!Number.isFinite(curr) || !Number.isFinite(prev)) return null
        if (prev === 0) return curr === 0 ? 0 : null
        return Number((((curr - prev) / prev) * 100).toFixed(1))
    }

    const lastMonth = monthlyRevenue[monthlyRevenue.length - 1]
    const prevMonth = monthlyRevenue[monthlyRevenue.length - 2]

    const stats = {
        revenue: totalRevenue,
        revenueGrowth: calcGrowthPercent(lastMonth?.revenue, prevMonth?.revenue),
        users: totalUsers,
        usersGrowth: null,
        orders: totalOrders,
        ordersGrowth: calcGrowthPercent(lastMonth?.orders, prevMonth?.orders),
        products: totalProducts,
        productsGrowth: null,
        monthlyRevenue,
        recentOrders: recentOrders.map(order => ({
            id: order._id,
            customer: order.user ? order.user.name : 'Guest',
            email: order.user ? order.user.email : 'N/A',
            amount: order.totalPrice,
            status: (order.adminStatus || 'processing'),
            date: order.createdAt.toISOString().split('T')[0]
        })),
        topProducts: topProducts.map(product => ({
            id: product._id,
            name: product.name,
            category: product.category || 'Uncategorized',
            price: product.price,
            image: product.image
        }))
    }

    res.json(stats)
})

// @desc Get recent activities
// @route GET /api/admin/activities
// @access Private/Admin
const getRecentActivities = asyncHandler(async (req, res) => {
    const activities = []

    // Get recent users
    const newUsers = await User.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email createdAt')

    newUsers.forEach(user => {
        activities.push({
            type: 'green',
            text: 'New user registered',
            meta: `${user.email} • ${getTimeAgo(user.createdAt)}`
        })
    })

    // Get recent orders
    const recentOrders = await Order.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email')

	    recentOrders.forEach(order => {
	        activities.push({
	            type: 'blue',
	            text: `Order ${order.isDelivered ? 'completed' : 'placed'}`,
	            meta: `Order #${order._id.toString().slice(-5)} - ${formatNaira(order.totalPrice)} • ${getTimeAgo(order.createdAt)}`
	        })
	    })

    // Sort by time and return top 10
    activities.sort((a, b) => new Date(b.meta.split('• ')[1]) - new Date(a.meta.split('• ')[1]))
    
    res.json(activities.slice(0, 10))
})

// Helper function to get time ago string
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000)
    
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
    
    return date.toLocaleDateString()
}

export { getDashboardStats, getRecentActivities }
