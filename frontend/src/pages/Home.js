import React from 'react'
import Slider from '../components/Slider'
import Cardscg from '../components/Cardscg'
import CgDiv from '../components/CgDiv'
import ProductsC from '../components/ProductsC'
import { Helmet } from 'react-helmet';
import './Home.css'
const Home = () => {
 
    return (
        <>
        <Helmet>
            <title>Makosail Store</title>
        </Helmet>
	             <div className="homepage">
	                <Slider/>
	                 <section className="homeCategorySection">
	                     <div className="homeSectionHeader">
	                         <span className="homeEyebrow">Departments</span>
	                         <h2>Shop by category</h2>
	                     </div>
	                     <div className="cards">
	                         <Cardscg title='Sports & Outdoors'/>
	                         <Cardscg title='Electronics & Electrical'/>
	                         <Cardscg title='Fashion & Aprils'/>
	                         <Cardscg title='Food & Drinks'/> 
	                     </div>
	                 </section>
	                <CgDiv/>
	                <ProductsC
	                    eyebrow="Featured"
	                    title="Featured Products"
	                    subtitle="Explore fresh arrivals and customer favorites across every department."
	                />
	        </div>
        </>
    )
}

export default Home
