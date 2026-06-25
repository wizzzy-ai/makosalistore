import React from 'react'
import { Helmet } from 'react-helmet'
import { Image } from '@chakra-ui/react'
import './aboutcss.css'

const About = () => {
    return (
        <>
            <Helmet>
                <title>About Urban Threads</title>
            </Helmet>

            <section className='aboutPage'>
                <div className='aboutHero'>
                    <div className='aboutHeroInner'>
                        <span className='aboutKicker'>About</span>
                        <h1>Built for a simple fashion shopping experience.</h1>
                        <p>
                            Urban Threads is a modern storefront for clean product browsing, easy checkout,
                            and a shopping flow that feels straightforward from home page to order confirmation.
                        </p>
                    </div>
                </div>

                <div className='aboutWrap'>
                    <div className='aboutIntro'>
                        <div className='aboutCard'>
                            <h2>What Urban Threads is</h2>
                            <p>
                                This project is a fashion ecommerce store built on the MERN stack. It is set up
                                for clothing, footwear, accessories, and seasonal collections with a structure
                                that already supports products, cart, checkout, accounts, and order tracking.
                            </p>
                            <p>
                                The goal is not just to show products. The goal is to keep the full shopping
                                journey clear, fast, and easy to customize for a real brand.
                            </p>
                        </div>

                        <div className='aboutCard'>
                            <h2>What you can manage</h2>
                            <div className='aboutStats'>
                                <div>
                                    <strong>Products</strong>
                                    <span>Catalog, pricing, images, and stock</span>
                                </div>
                                <div>
                                    <strong>Customers</strong>
                                    <span>Accounts, login, and order history</span>
                                </div>
                                <div>
                                    <strong>Orders</strong>
                                    <span>Checkout, payment, and delivery flow</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='aboutSection'>
                        <div className='aboutText'>
                            <h2>Designed to continue the shopping flow</h2>
                            <p>
                                The storefront uses reusable components and a simple content structure so the
                                brand experience stays consistent across home, shop, cart, account, and support
                                pages. That makes it easier to customize the store without rebuilding everything.
                            </p>
                            <p>
                                Whether you are updating visuals, adding real inventory, or preparing the app
                                for production, the foundation is already connected and ready to extend.
                            </p>
                        </div>

                        <div className='aboutImageWrap'>
                            <Image
                                className='aboutImage'
                                src='https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80'
                                alt='Fashion collection display'
                            />
                        </div>
                    </div>

                    <div className='aboutSection aboutSection--reverse'>
                        <div className='aboutImageWrap'>
                            <Image
                                className='aboutImage'
                                src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80'
                                alt='Retail fashion interior'
                            />
                        </div>

                        <div className='aboutText'>
                            <h2>Ready for real business content</h2>
                            <p>
                                Product text, collection imagery, featured categories, contact details, and
                                support content can all be replaced with your actual store information. The app
                                is structured so you can focus on your brand instead of starting from scratch.
                            </p>
                            <p>
                                It already includes the core user and admin flows needed for a working online
                                store, which makes it a practical base for building something real.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default About
