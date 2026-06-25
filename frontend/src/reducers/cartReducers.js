import{
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_CLEAR_ITEMS,
    CART_UPDATE_ITEM_OPTIONS,
    CART_SAVE_SHIPPING_ADRESSE,
    CART_SAVE_PAYMENT,
    CART_SAVE_DELIVERY_OPTION,
} from '../constants/cartConstants'
export const cartReducer = (state = {cartItems:  [],shippingAddress: {} , images: [], deliveryOption: 'standard'}, action) =>{
    switch(action.type) {
        case CART_ADD_ITEM:

        const item = action.payload

        // x.prosuct it's the ID
        const existItem = state.cartItems.find(x=> x.product === item.product)
        if(existItem){
            return{
            ...state,
            cartItems: state.cartItems.map((x)=>
             x.product === existItem.product ? item : x
                ),
            }
        } else {
            return{
                ...state,
                cartItems: [...state.cartItems,item]
            }
        }
        case CART_UPDATE_ITEM_OPTIONS: {
            const { id, options } = action.payload || {}
            if (!id) return state
            return {
                ...state,
                cartItems: state.cartItems.map((x) =>
                    x.product === id
                        ? { ...x, options: { ...(x.options || {}), ...(options || {}) } }
                        : x
                ),
            }
        }
        case CART_REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter((x)=> x.product !== action.payload),
            }
        case CART_CLEAR_ITEMS:
            return {
                ...state,
                cartItems: [],
            }
        case CART_SAVE_SHIPPING_ADRESSE:
            return {
                ...state,
                shippingAddress: action.payload,
            }
        case CART_SAVE_PAYMENT:
            return {
                ...state,
                paymentMethod: action.payload,
            }
        case CART_SAVE_DELIVERY_OPTION:
            return {
                ...state,
                deliveryOption: action.payload,
            }
        default : return state
    
    }
}
