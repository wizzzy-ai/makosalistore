import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom';
import ShopNowBtn from './ShopNowBtn'
const Slider = () => {
     const SliderData = [
        {
            title: 'Find The Best Outfit',
            subtitle :'With 30% Off',
            to: '/shop'
        },
        {
 
            title: 'The Best Shoes',
            subtitle :'Comfort For your long day',
            to: '/shop'
        },
        {
 
            title: 'Next Season Is here',
            subtitle :'Enjoy your summer with us.',
            to: '/shop'
        },
        {
            title: 'Food & Drinks',
            subtitle: 'Fresh picks delivered fast',
            to: '/food-drinks'
        },
        {
            title: 'Sports & Outdoors',
            subtitle: 'Gear up for your next adventure',
            to: '/shop'
        },
        {
            title: 'Electronics & Electricals',
            subtitle: 'Smart gadgets, better living',
            to: '/shop'
        }
      ];
    const [current, setCurrent] = useState(0);
    const length = SliderData.length;
    const intervaltime = 6000;
    const slideinterval = useRef(null);
    const nextslide = useCallback(() =>{
        setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1))
 
    }, [length])
    const prevslide = () =>{
        setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1))
   }
   useEffect(()=>{
      slideinterval.current = setInterval(nextslide, intervaltime)
      return ()=>{ 
        clearInterval(slideinterval.current)
      }
   }, [nextslide])
 
    return (
        <div className = 'slider'>
            {SliderData.map((slide,index) =>{
                return(
                    <div key = {index} className={index === current ? 'slide current' : 'slide'}>
                    <h1 className = 'titleslider'>{slide.title}</h1>
                    <h3 className = 'subtitleslider'>{slide.subtitle}</h3>
                    <div className = 'content'> <Link to={slide.to || '/shop'}> <ShopNowBtn /></Link>  </div>
                    </div>
                );
 
            })}
            <IoIosArrowForward className ='next' size ='32' onClick = {nextslide}/>
            <IoIosArrowBack className = 'prev' size ='32' onClick = {prevslide}/>
        </div>
    )
}
 
export default Slider
