import React, { useState } from 'react'
import {HiOutlineShoppingCart,HiShoppingCart} from "react-icons/hi"
import { Image } from "@chakra-ui/react"
import { Link, useHistory } from 'react-router-dom'
import { addToCart, removeFromCart } from "../actions/cartActions";
import { useDispatch, useSelector } from 'react-redux'
import { formatCurrency } from '../utils/formatCurrency'
const CardProduct = ({product}) => {
    const  [showbtn,setShowbtn] = useState(false) 
    const dispatch = useDispatch();
    const history = useHistory();
    const Cart = useSelector(state => state.cart)
    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin
    const {cartItems} = Cart
    const inCart = cartItems.some((item) => item.product === product._id)

    const toggleCart = ()=>{
       if (inCart) {
           dispatch(removeFromCart(product._id))
           return
       }
       if (!userInfo) {
           history.push(`/login?redirect=/cart/${product._id}?qty=1`)
           return
       }
       dispatch(addToCart(product._id,1))
   }

    const goToDetails = () => {
        history.push(`/product/${product._id}`)
    }

     return (
        <>  
            <div
                className='cardProduct'
                role='button'
                tabIndex={0}
                onClick={goToDetails}
                onKeyDown={(e)=>{
                    if(e.key === 'Enter' || e.key === ' '){
                        e.preventDefault();
                        goToDetails();
                    }
                }}
                onMouseOver={ ()=> {setShowbtn (true)}}
                onMouseLeave= { ()=> {setShowbtn (false)}}
            >           
                 <div className='imgDiv'>
                         <Image className='imgProduct' boxSize='350px' objectFit='cover' src={product.images[0]} />  
                 </div>
               <div className='bottomcard'>
                       <Link to={`/product/${product._id}`} onClick={(e)=>e.stopPropagation()}>
                            <span>{product.name}</span>     
                       </Link>
                              <button
                                  className='iconFavButton'
                                  type='button'
                                  onClick={(e)=>{ e.stopPropagation(); toggleCart(); }}
                              >
                                {inCart ? <HiShoppingCart className='iconFav' size='26' /> : <HiOutlineShoppingCart className='iconFav' color='#999' size='26' />}
                              </button>

	                       <div className = 'productpricecard'>{formatCurrency(product.price)}</div>
	                      
	                       {/* Food Delivery Specific Features */}
		                       {(product.restaurant || product.prepTime || product.deliveryFee !== undefined || product.dietary?.length > 0) && (
                           <div className='foodDeliveryInfo'>
                               {product.restaurant && (
                                   <div className='restaurantName'>{product.restaurant}</div>
                               )}
                               {product.prepTime && (
                                   <div className='prepTime'>
	                                       <span className='timeIcon'>Prep</span> {product.prepTime}
                                   </div>
                               )}
		                               {product.deliveryFee !== undefined && product.deliveryFee !== null && (
		                                   <div className='deliveryFee'>
		                                       <span className='deliveryIcon'>Delivery</span> {formatCurrency(product.deliveryFee)}
		                                   </div>
		                               )}
                               {product.dietary && product.dietary.length > 0 && (
                                   <div className='dietaryBadges'>
                                       {product.dietary.map((diet, index) => (
                                           <span key={index} className='dietaryBadge'>{diet}</span>
                                       ))}
                                   </div>
                               )}
                           </div>
                       )}
                             
               </div>
              
                      <Link to={`/product/${product._id}`} onClick={(e)=>e.stopPropagation()}>
                             <button className= { showbtn ? 'QuickView QuickViewActive' : 'QuickView' } type='button'> View Details</button>
                      </Link>   
             </div>     
         </>

    )
}

export default CardProduct
