import axios from 'axios'
import {
	  CART_ADD_ITEM,
	  CART_REMOVE_ITEM,
	  CART_CLEAR_ITEMS,
	  CART_UPDATE_ITEM_OPTIONS,
	  CART_SAVE_SHIPPING_ADRESSE,
	  CART_SAVE_PAYMENT,
	  CART_SAVE_DELIVERY_OPTION,
	} from '../constants/cartConstants'

export const addToCart = (id, qty) => async (dispatch, getState) => {
			const { data } = await axios.get(`/api/products/${id}`)
			const existing = (getState().cart?.cartItems || []).find((x) => x.product === data._id)
			  dispatch({
		    type: CART_ADD_ITEM,
		    payload: {
		      product: data._id,
		      name: data.name,
		      images: data.images,
		      category: data.category,
		      price: data.price,
		      countInStock: data.countInStock,
		      qty,
		      options: existing?.options || {},
		    },
		  })

	  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
	}

export const removeFromCart= (id)=> (dispatch,getState)=>{
    dispatch({
      type: CART_REMOVE_ITEM,
      payload: id
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))

}

export const updateCartItemOptions = (id, options) => (dispatch, getState) => {
	dispatch({
		type: CART_UPDATE_ITEM_OPTIONS,
		payload: { id, options },
	})
	localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const clearCartItems = ()=> (dispatch)=>{
  dispatch({
    type: CART_CLEAR_ITEMS
  })
  localStorage.removeItem('cartItems')
}

export const saveAddressshipping = (data)=> (dispatch,getState)=>{
  dispatch({
    type: CART_SAVE_SHIPPING_ADRESSE,
    payload: data
  })
  localStorage.setItem('shippingAddress', JSON.stringify(data))

}
export const savepaymentmethod = (data)=> (dispatch,getState)=>{
  dispatch({
    type: CART_SAVE_PAYMENT,
    payload: data
  })
  localStorage.setItem('paymentMethod', JSON.stringify(data))

}

export const saveDeliveryOption = (data)=> (dispatch,getState)=>{
  dispatch({
    type: CART_SAVE_DELIVERY_OPTION,
    payload: data
  })
  localStorage.setItem('deliveryOption', JSON.stringify(data))

}
