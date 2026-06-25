import React from 'react'
import { FiFacebook, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { AiOutlineInstagram } from 'react-icons/ai'
import { IoLogoYoutube } from 'react-icons/io'
import './footercss.css'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <div className="footerCmp">
            <footer>
                {/* Main Footer Content */}
                <div className="footer-main">
                    {/* Brand Section */}
                    <div className="footer-brand">
                        <h2>URBAN THREADS</h2>
                        <p>Your premium destination for contemporary fashion and streetwear. Quality meets style in every piece we create.</p>
                        <div className="footer-social">
                            <button className="social-icon" aria-label="Facebook"><FiFacebook /></button>
                            <button className="social-icon" aria-label="Instagram"><AiOutlineInstagram /></button>
                            <button className="social-icon" aria-label="Twitter"><FiTwitter /></button>
                            <button className="social-icon" aria-label="YouTube"><IoLogoYoutube /></button>
                        </div>
                    </div>

                    {/* Shop Categories */}
                    <div className="footer-section">
                        <h3>Shop</h3>
                        <ul>
                            <li><Link to='/shop/?cg=Women'>Sports</Link></li>
                            <li><Link to='/shop/?cg=Men'>Electronics</Link></li>
                            <li><Link to='/shop/?cg=Shoes'>Aprils</Link></li>
                            <li><Link to='/shop/?cg=Watches'>Watches</Link></li>
                            <li><Link to='/shop/?cg=Accessories'>Foodstuffs</Link></li>
                            <li><Link to='/shop/?cg=New Arrivals'>New Arrivals</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="footer-section">
                        <h3>Customer Service</h3>
                        <ul>
                            <li><Link to='/track-order'>Track Order</Link></li>
                            <li><Link to='/returns'>Returns & Exchanges</Link></li>
                            <li><Link to='/shipping'>Shipping Info</Link></li>
                            <li><Link to='/size-guide'>Size Guide</Link></li>
                            <li><Link to='/faq'>FAQs</Link></li>
                            <li><Link to='/contact-us'>Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Company Info */}
                    <div className="footer-section">
                        <h3>Company</h3>
                        <ul>
                            <li><Link to='/about'>About Us</Link></li>
                            <li><Link to='/careers'>Careers</Link></li>
                            <li><Link to='/sustainability'>Sustainability</Link></li>
                            <li><Link to='/press'>Press</Link></li>
                            <li><Link to='/affiliates'>Affiliates</Link></li>
                            <li><Link to='/wholesale'>Wholesale</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-section footer-contact">
                        <h3>Get in Touch</h3>
                        <div className="contact-info">
                            <div className="contact-item">
                                <FiMail />
                                <span>support@urbanthreads.com</span>
                            </div>
                            <div className="contact-item">
                                <FiPhone />
                                <span>+234 706 918 5859</span>
                            </div>
                            <div className="contact-item">
                                <FiMapPin />
                                <span>241 Market Street, Suite 5, Lagos, Nigeria</span>
                            </div>
                        </div>
                        <div className="newsletter">
                            <p>Subscribe to get exclusive offers and new arrivals</p>
                            <div className="newsletter-form">
                                <input type="email" placeholder="Enter your email" />
                                <button type="button">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="footer-payments">
                    <h4>We Accept</h4>
                    <div className="payment-icons">
                        <img src="https://i.imgur.com/AHCoUZO.png" alt="Visa" />
                        <img src="https://i.imgur.com/JZRipBg.png" alt="American Express" />
                        <img src="https://i.imgur.com/l8OAGyo.png" alt="Mastercard" />
                        <img src="https://i.imgur.com/IDHC2iv.png" alt="Discover" />
                        <img src="https://i.imgur.com/9B2tLdQ.png" alt="PayPal" />
                        <img src="https://i.imgur.com/g3jvLdr.png" alt="Apple Pay" />
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p>&copy; 2026 Urban Threads. All rights reserved.</p>
                        <div className="footer-links">
                            <Link to='/privacy-policy'>Privacy Policy</Link>
                            <Link to='/terms-of-service'>Terms of Service</Link>
                            <Link to='/cookie-policy'>Cookie Policy</Link>
                            <Link to='/accessibility'>Accessibility</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer
