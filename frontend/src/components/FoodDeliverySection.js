import React from 'react'
import { Link } from 'react-router-dom'
import './FoodDeliverySection.css'
import { formatCurrency } from '../utils/formatCurrency'

const FoodDeliverySection = () => {
  const restaurantPartners = [
    {
      name: 'Pizza Palace',
      cuisine: 'Italian',
      rating: 4.5,
      deliveryTime: '25-35 min',
      deliveryFee: 2.99,
      image: 'https://picsum.photos/seed/pizza-palace/300/200'
    },
    {
      name: 'Burger House',
      cuisine: 'American',
      rating: 4.2,
      deliveryTime: '15-25 min',
      deliveryFee: 1.99,
      image: 'https://picsum.photos/seed/burger-house/300/200'
    },
    {
      name: 'Green Garden',
      cuisine: 'Healthy',
      rating: 4.7,
      deliveryTime: '10-20 min',
      deliveryFee: 1.99,
      image: 'https://picsum.photos/seed/green-garden/300/200'
    },
    {
      name: 'Thai Express',
      cuisine: 'Thai',
      rating: 4.6,
      deliveryTime: '20-30 min',
      deliveryFee: 2.49,
      image: 'https://picsum.photos/seed/thai-express/300/200'
    }
  ]

  const deliveryFeatures = [
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Get your food delivered in 30 minutes or less'
    },
    {
      icon: '📍',
      title: 'Track Order',
      description: 'Real-time GPS tracking from kitchen to your door'
    },
    {
      icon: '💳',
      title: 'Secure Payment',
      description: 'Multiple payment options with secure processing'
    },
    {
      icon: '⭐',
      title: 'Top Rated',
      description: 'Only the best restaurants with 4+ star ratings'
    }
  ]

  return (
    <div className='foodDeliverySection'>
      <div className='container'>
        <div className='sectionHeader'>
          <h2>Food Delivery</h2>
          <p>Order from your favorite restaurants and get food delivered to your doorstep</p>
        </div>

        <div className='deliveryFeatures'>
          {deliveryFeatures.map((feature, index) => (
            <div key={index} className='featureCard'>
              <div className='featureIcon'>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className='restaurantPartners'>
          <h3>Popular Restaurants</h3>
          <div className='restaurantGrid'>
            {restaurantPartners.map((restaurant, index) => (
              <div key={index} className='restaurantCard'>
                <div className='restaurantImage'>
                  <img src={restaurant.image} alt={restaurant.name} />
                </div>
                <div className='restaurantInfo'>
                  <h4>{restaurant.name}</h4>
                  <p className='cuisine'>{restaurant.cuisine}</p>
                  <div className='restaurantMeta'>
                    <span className='rating'>⭐ {restaurant.rating}</span>
                    <span className='deliveryTime'>🕐 {restaurant.deliveryTime}</span>
                    <span className='deliveryFee'>🚚 {formatCurrency(restaurant.deliveryFee)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='ctaSection'>
          <Link to='/shop?cg=Foodstuff' className='browseFoodBtn'>
            Browse All Food Items
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FoodDeliverySection
