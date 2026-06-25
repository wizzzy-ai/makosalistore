import asyncHandler from 'express-async-handler'

import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'

// @desc Create new order
// @route POST /api/orders
// @access Private
const addorderitems = asyncHandler(async (req, res) => {
    console.log(req.user)

    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        deliveryOption,
    } = req.body
    if(orderItems && orderItems.length === 0){
        res.status(400)
        throw new Error('No order items')
        return
    }else{
        const normalizedItems = (orderItems || []).map((item) => ({
            ...item,
            qty: Number(item?.qty || 0),
            product: item?.product,
        }))

        const invalidQty = normalizedItems.find((item) => !Number.isFinite(item.qty) || item.qty <= 0)
        if (invalidQty) {
            res.status(400)
            throw new Error('Invalid item quantity')
        }

        // Reserve inventory at order creation time to prevent overselling.
        // This is done with per-product atomic updates (countInStock >= qty).
        // If any reservation fails, previously reserved items are rolled back.
        const reserved = []
        try {
            for (const item of normalizedItems) {
                const updated = await Product.findOneAndUpdate(
                    { _id: item.product, countInStock: { $gte: item.qty } },
                    { $inc: { countInStock: -item.qty } },
                    { new: true },
                )

                if (!updated) {
                    const product = await Product.findById(item.product).select('name countInStock')
                    const name = product?.name || 'Product'
                    const available = Number(product?.countInStock ?? 0)
                    res.status(400)
                    throw new Error(`${name} is out of stock (requested ${item.qty}, available ${available})`)
                }

                reserved.push({ product: item.product, qty: item.qty })
            }
        } catch (err) {
            if (reserved.length) {
                await Promise.all(
                    reserved.map((r) =>
                        Product.updateOne({ _id: r.product }, { $inc: { countInStock: r.qty } }),
                    ),
                ).catch(() => {})
            }
            throw err
        }

        const normalizedDeliveryOption =
            typeof deliveryOption === 'string' && deliveryOption.trim()
                ? deliveryOption.trim().toLowerCase()
                : 'standard'

        const deliveryMethod =
            normalizedDeliveryOption === 'express' || normalizedDeliveryOption === 'pickup'
                ? normalizedDeliveryOption
                : 'standard'

        const now = Date.now()
        const estimatedDeliveryAt =
            deliveryMethod === 'express'
                ? new Date(now + 2 * 24 * 60 * 60 * 1000)
                : deliveryMethod === 'standard'
                    ? new Date(now + 5 * 24 * 60 * 60 * 1000)
                    : undefined

		        const order = new Order({
		            user:req.user._id,
		            orderItems: normalizedItems,

	            shippingAddress,
	            paymentMethod,
	            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            delivery: {
                method: deliveryMethod,
                fee: shippingPrice,
                status: 'processing',
                estimatedDeliveryAt,
                updates: [
                    {
                        status: 'processing',
                        message: 'Order received',
                        at: now,
                    },
	                ],
	            },
	        })
	        const createdOrder = await order.save()

        res.status(201).json(createdOrder)
    }
})
    // @desc get order by id
    // @route GET /api/orders/:id
    // @access Private
const getOrderById = asyncHandler(async (req, res) => {
    const order  = await Order.findById(req.params.id).populate('user','name email')
    if(order){
        res.json(order)
    }else{
        res.status(404)
        throw new Error('Order Not found')
    }
    
})
    // @desc update order to paid
    // @route update /api/orders/:id/pay
    // @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order  = await Order.findById(req.params.id)
    if(order){
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body?.payer?.email_address || req.body?.email_address,

        }
        const updatedOrder = await order.save()
        res.json(updatedOrder)

    }else{
        res.status(404)
        throw new Error('Order Not found')
    }
    
})


// @desc update order to delivered
    // @route update /api/orders/:id/deliver
    // @access Private
    const updateOrderToDelivered = asyncHandler(async (req, res) => {
        const order  = await Order.findById(req.params.id)
        if(order){
            order.isDelivered = true
            order.deliveredAt = Date.now()
            if (order.delivery) {
                order.delivery.status = 'delivered'
                order.delivery.updates = order.delivery.updates || []
                order.delivery.updates.push({
                    status: 'delivered',
                    message: 'Order delivered',
                    at: Date.now(),
                })
            } else {
                order.delivery = {
                    status: 'delivered',
                    updates: [{ status: 'delivered', message: 'Order delivered', at: Date.now() }],
                }
            }
            const updatedOrder = await order.save()
            res.json(updatedOrder)
    
        }else{
            res.status(404)
            throw new Error('Order Not found')
        }
        
    })

// @desc update order delivery/tracking info (and optionally add a delivery update)
// @route PUT /api/orders/:id/delivery
// @access Private/Admin
const updateOrderDelivery = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        res.status(404)
        throw new Error('Order Not found')
    }

    const {
        status,
        carrier,
        trackingNumber,
        estimatedDeliveryAt,
        message,
        location,
        addUpdate = true,
    } = req.body || {}

    if (!order.delivery) {
        order.delivery = { status: 'processing', updates: [] }
    }

    if (typeof carrier === 'string') order.delivery.carrier = carrier
    if (typeof trackingNumber === 'string') order.delivery.trackingNumber = trackingNumber
    if (estimatedDeliveryAt) order.delivery.estimatedDeliveryAt = estimatedDeliveryAt

    if (typeof status === 'string' && status.trim()) {
        order.delivery.status = status.trim()
        if (status.trim().toLowerCase() === 'delivered' && !order.isDelivered) {
            order.isDelivered = true
            order.deliveredAt = Date.now()
        }
    }

    const shouldAppend =
        addUpdate &&
        ((typeof status === 'string' && status.trim()) ||
            (typeof message === 'string' && message.trim()) ||
            (typeof location === 'string' && location.trim()))

    if (shouldAppend) {
        order.delivery.updates = order.delivery.updates || []
        order.delivery.updates.push({
            status: (typeof status === 'string' && status.trim()) ? status.trim() : order.delivery.status || 'update',
            message: typeof message === 'string' ? message : undefined,
            location: typeof location === 'string' ? location : undefined,
            at: Date.now(),
        })
    }

	    const updatedOrder = await order.save()
	    res.json(updatedOrder)
})

// @desc Update order admin status (processing/success/failed)
// @route PUT /api/orders/:id/admin-status
// @access Private/Admin
const updateOrderAdminStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        res.status(404)
        throw new Error('Order Not found')
    }

    const nextStatusRaw = typeof req.body?.status === 'string' ? req.body.status : ''
    const nextStatus = nextStatusRaw.trim().toLowerCase()

    const allowed = new Set(['processing', 'success', 'failed'])
    if (!allowed.has(nextStatus)) {
        res.status(400)
        throw new Error('Invalid status. Use processing, success, or failed.')
    }

    order.adminStatus = nextStatus
    const updatedOrder = await order.save()
    res.json(updatedOrder)
})

// @desc Delete an order
// @route DELETE /api/orders/:id
// @access Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        res.status(404)
        throw new Error('Order Not found')
    }

    await order.deleteOne()
    res.json({ message: 'Order removed' })
})
    // @desc get logged in user orders
    // @route GET /api/orders/myorders
    // @access Private
const GetMyOrders = asyncHandler(async (req, res) => {
    const orders  = await Order.find({user: req.user._id})
    res.json(orders)
    
})

// @desc get orders
    // @route GET /api/admin/orders
    // @access Private/admin
    const GetOrders = asyncHandler(async (req, res) => {
        const orders  = await Order.find({}).populate('user','id name')
        res.json(orders)
        
    })

export {addorderitems,getOrderById,updateOrderToPaid,GetMyOrders,GetOrders,updateOrderToDelivered,updateOrderDelivery, updateOrderAdminStatus, deleteOrder}
