import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'

import { listProductDetails, createproductReview } from '../../actions/productActions'
import { Image, Select, Button, FormControl, FormLabel, Textarea, Alert, AlertIcon } from '@chakra-ui/react'
import { FiShoppingCart, FiCheck } from 'react-icons/fi'
import { HiOutlineTruck } from 'react-icons/hi'
import { HiOutlineArrowPath } from 'react-icons/hi2'
import { HiOutlineShieldCheck } from 'react-icons/hi2'
import { AiOutlineStar, AiFillStar } from 'react-icons/ai'
import HashLoader from 'react-spinners/HashLoader'
import { PRODUCT_CREATE_REVIEW_RESET } from '../../constants/productConstants'
import './product.css'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatCurrency'

const Productpage = ({ history, match }) => {
  const [qty, setQty] = useState(1)
  const [rating, setrating] = useState(0)
  const [comment, setcomment] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('description')
  const dispatch = useDispatch()
  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  const productReviewCreate = useSelector((state) => state.productReviewCreate)
  const { success: successProductReview, error: errorProductReview } = productReviewCreate

  useEffect(() => {
    if (successProductReview) {
      setSuccessMessage('Thanks! Your review was submitted and is pending approval.')
      setrating(0)
      setcomment('')
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }
    dispatch(listProductDetails(match.params.id))
  }, [dispatch, match, successProductReview])

  useEffect(() => {
    setSelectedImageIndex(0)
  }, [product._id])

  const submithanlder = () => {
    dispatch(
      createproductReview(match.params.id, {
        rating,
        comment,
      })
    )
  }

  const addToCartHandler = () => {
    if (!userInfo) {
      history.push(`/login?redirect=/cart/${match.params.id}?qty=${qty}`)
      return
    }
    history.push(`/cart/${match.params.id}?qty=${qty}`)
  }

  const renderStars = (count) => {
    const safe = Math.max(0, Math.min(5, Math.round(Number(count) || 0)))
    return (
      <div className='star-rating'>
        {[...Array(5)].map((_, i) => (
          <span key={i}>
            {i < safe ? <AiFillStar /> : <AiOutlineStar />}
          </span>
        ))}
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{product.name}</title>
      </Helmet>
      <div className='productpage'>
        {loading ? (
          <div className='loading-product'>
            <HashLoader color={'#1e1e2c'} loading={loading} size={50} />
          </div>
        ) : error ? (
          <h2 className='error-message'>{error}</h2>
        ) : (
          <>
            {/* PRODUCT SECTION */}
            <div className='product-section'>
              <div className='product-gallery'>
                <div className='main-image-container'>
                  <Image
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    className='main-image'
                  />
                </div>
                <div className='thumbnail-gallery'>
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                      onClick={() => setSelectedImageIndex(index)}
                      type='button'
                    >
                      <Image src={image} alt={`View ${index + 1}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className='product-info'>
                <h1 className='product-name'>{product.name}</h1>

                <div className='rating-section'>
                  {renderStars(product.rating)}
                  <span className='review-count'>({product.numReviews || 0} reviews)</span>
                </div>

                <div className='price-section'>
                  <span className='current-price'>{formatCurrency(product.price)}</span>
                  <span className='old-price'>{formatCurrency(product.price * 1.5)}</span>
                </div>

                <p className='product-description'>{product.description}</p>

                <div className='options-container'>
                  {product.sizes && product.sizes.length > 0 && (
                    <div className='option-group'>
                      <label>Size</label>
                      <Select className='modern-select' defaultValue='S'>
                        {product.sizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </Select>
                    </div>
                  )}

                  <div className='option-group'>
                    <label>Quantity</label>
                    <div className='qty-selector'>
                      <button type='button' onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                      <input type='number' value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value)))} />
                      <button type='button' onClick={() => setQty(qty + 1)}>+</button>
                    </div>
                  </div>
                </div>

                <div className='cta-buttons'>
                  <button onClick={addToCartHandler} className='add-to-cart-btn' disabled={product.countInStock === 0}>
                    <FiShoppingCart /> Add to Cart
                  </button>
                  <button className='buy-now-btn' disabled={product.countInStock === 0}>
                    <FiCheck /> Buy Now
                  </button>
                </div>

                <div className='trust-badges'>
    <div className='badge'>
        <div className='badge-icon'>
            <HiOutlineTruck />
        </div>

        <div className='badge-content'>
            <h4>Free Shipping</h4>
            <p>On orders over ₦100</p>
        </div>
    </div>

    <div className='badge'>
        <div className='badge-icon'>
            <HiOutlineArrowPath />
        </div>

        <div className='badge-content'>
            <h4>30-Day Returns</h4>
            <p>Hassle-free returns</p>
        </div>
    </div>

    <div className='badge'>
        <div className='badge-icon'>
            <HiOutlineShieldCheck />
        </div>

        <div className='badge-content'>
            <h4>Secure Checkout</h4>
            <p>100% protected payment</p>
        </div>
    </div>
</div>
              </div>
            </div>

            {/* CONTENT TABS */}
            <div className='content-section'>
              <div className='tab-navigation'>
                <button
                  className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews ({product.reviews?.length || 0})
                </button>
                <button
                  className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
                  onClick={() => setActiveTab('shipping')}
                >
                  Shipping
                </button>
              </div>

              <div className='tab-content'>
                {activeTab === 'description' && (
                  <div className='tab-pane'>
                    <h3>Product Details</h3>
                    <p>{product.description}</p>
                    <ul>
                      <li>Status: {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</li>
                      <li>Category: {product.category?.join(', ')}</li>
                      <li>Shipping Area: Worldwide</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className='tab-pane'>
                    <div className='reviews-list'>
                      {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map((review) => (
                          <div key={review._id || `${review.name}-${review.createdAt}`} className='review-item'>
                            <div className='review-header'>
                              <h4>{review.name}</h4>
                              <span className='review-date'>{review.createdAt.substring(0, 10)}</span>
                            </div>
                            <div className='review-rating'>{renderStars(review.rating)}</div>
                            <p className='review-comment'>{review.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className='no-reviews'>No reviews yet. Be the first to review!</p>
                      )}
                    </div>

                    <div className='create-review'>
                      <h3>Leave a Review</h3>
                      {successMessage && (
                        <Alert status='success' mb={4}>
                          <AlertIcon />
                          {successMessage}
                        </Alert>
                      )}
                      {errorProductReview && <Alert status='error'><AlertIcon />{errorProductReview}</Alert>}
                      {userInfo ? (
                        <FormControl>
                          <FormLabel>Rating</FormLabel>
                          <Select onChange={(e) => setrating(e.target.value)} mb={4}>
                            <option value='0'>Select rating...</option>
                            <option value='1'>1 - Poor</option>
                            <option value='2'>2 - Fair</option>
                            <option value='3'>3 - Good</option>
                            <option value='4'>4 - Very Good</option>
                            <option value='5'>5 - Excellent</option>
                          </Select>
                          <FormLabel>Comment</FormLabel>
                          <Textarea
                            onChange={(e) => setcomment(e.target.value)}
                            placeholder='Share your experience with this product...'
                            mb={4}
                          />
                          <Button colorScheme='blue' onClick={submithanlder}>
                            Submit Review
                          </Button>
                        </FormControl>
                      ) : (
                        <p className='login-prompt'>
                          <Link to='/login'>Sign in</Link> to leave a review
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className='tab-pane'>
                    <h3>Shipping Information</h3>
                    <div className='shipping-info'>
                      <div className='info-item'>
                        <h4>Free Shipping</h4>
                        <p>Orders over ₦100 ship free. Orders under ₦100 cost ₦10.</p>
                      </div>
                      <div className='info-item'>
                        <h4>Delivery Time</h4>
                        <p>Typically arrives within 5-7 business days.</p>
                      </div>
                      <div className='info-item'>
                        <h4>Returns</h4>
                        <p>30-day returns on all items. Free returns for unworn items.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Productpage
