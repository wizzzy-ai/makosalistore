import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Route } from 'react-router-dom';
import { Link, NavLink } from 'react-router-dom'
import { RiShoppingCart2Line } from 'react-icons/ri';
import { MdSearch, MdKeyboardArrowRight } from 'react-icons/md';
import { BsArrowRightShort } from 'react-icons/bs';
import { IoLogOutOutline } from 'react-icons/io5';
import { IoMdArrowDropdown } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';
import ConfirmationModal from './ConfirmationModal'

import { logout } from '../actions/userActions'
import Searchnav from './Searchnav';
import { DEPARTMENTS } from '../constants/taxonomy';

const Nav = ({ history }) => {
    const [incart, setincart] = useState(0);
    const cart = useSelector(state => state.cart)
    const { cartItems } = cart
    const [nav, setNav] = useState(false)
    const navRef = useRef(null)
    const departmentsRef = useRef(null)
    const userDropdownRef = useRef(null)

    //search
    const searchRef = useRef(null)
    const [showSearchIc, setShowSearchIc] = useState(false)
    //Mobile menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
    //signin
    const [signin, setSignin] = useState(null)

    const onSeacrhFun = () => {
        setShowSearchIc((prev) => !prev)
        if (searchRef.current) {
            searchRef.current.classList.toggle('searchActive')
            searchRef.current.style.animation = 'moving 0.3s ease both 0.3s'
        }
    }

    const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev)
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
        setIsMobileSearchOpen(false)
    }
    const toggleMobileSearch = () => setIsMobileSearchOpen((prev) => !prev)
    const onChangeBack = () => {
        if (window.scrollY >= 60) {
            setNav(true)
        }
        else setNav(false)
    }

    useEffect(() => {
        window.addEventListener('scroll', onChangeBack)
        return () => {
            window.removeEventListener('scroll', onChangeBack)
        }
    }, [])

    useEffect(() => {
        const desktopQuery = window.matchMedia('(min-width: 769px)')
        const closeMenuOnDesktop = (event) => {
            if (event.matches) {
                setIsMobileMenuOpen(false)
            }
        }

        closeMenuOnDesktop(desktopQuery)

        if (desktopQuery.addEventListener) {
            desktopQuery.addEventListener('change', closeMenuOnDesktop)
            return () => desktopQuery.removeEventListener('change', closeMenuOnDesktop)
        }

        desktopQuery.addListener(closeMenuOnDesktop)
        return () => desktopQuery.removeListener(closeMenuOnDesktop)
    }, [])

    useEffect(() => {
        const cart = cartItems.length ? cartItems.length : 0;
        setincart(cart);
        return () => {
            setincart(0)
        }
    }, [cartItems.length])

    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    const [isLogoutOpen, setIsLogoutOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isDepartmentsOpen, setIsDepartmentsOpen] = useState(false)
    const openLogoutModal = () => setIsLogoutOpen(true)
    const closeLogoutModal = () => setIsLogoutOpen(false)
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)
    const toggleDepartments = () => setIsDepartmentsOpen((prev) => !prev)

    const logoutHandler = () => {
        setIsDropdownOpen(false)
        openLogoutModal()
    }

    const confirmLogout = () => {
        dispatch(logout())
        closeMobileMenu() // Double check drawer closes on success
        closeLogoutModal()
    }

    useEffect(() => {
        const onDocClick = (e) => {
            if (departmentsRef.current && !departmentsRef.current.contains(e.target)) {
                setIsDepartmentsOpen(false)
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', onDocClick)
        return () => document.removeEventListener('mousedown', onDocClick)
    }, [])

    const cgLink = (cgValue) => `/shop/?cg=${encodeURIComponent(cgValue)}`

    return (
        <nav ref={navRef} className={`nav ${nav ? 'active' : ''}`} >
            <div className="logo"><Link to=''>Makosail Stores</Link></div>
            
            {/* Nav links block */}
            <ul className={`navLinks ${isMobileMenuOpen ? 'burgerActive' : ''}`}>
                <NavLink to="/" exact onClick={closeMobileMenu} activeClassName='activlink' ><li>Home</li></NavLink>
                <li className="departments" ref={departmentsRef}>
                    <button
                        type="button"
                        className={`departments-trigger ${isDepartmentsOpen ? 'open' : ''}`}
                        onClick={() => {
                            toggleDepartments()
                        }}
                    >
                        Departments <IoMdArrowDropdown />
                    </button>
                    {isDepartmentsOpen && (
                        <div className="departments-menu" role="menu" aria-label="Departments">
                            {DEPARTMENTS.map((dept) => (
                                <div className="departments-col" key={dept.id}>
                                    <Link
                                        to={cgLink(dept.label)}
                                        className="departments-title"
                                        onClick={() => {
                                            setIsDepartmentsOpen(false)
                                            closeMobileMenu()
                                        }}
                                    >
                                        {dept.label}
                                    </Link>
                                    {dept.items.map((group) => (
                                        <div className="departments-group" key={`${dept.id}-${group.label}`}>
                                            <div className="departments-group-title">{group.label}</div>
                                            <ul className="departments-links">
                                                {group.links.map((label) => (
                                                    <li key={`${dept.id}-${group.label}-${label}`}>
                                                        <Link
                                                            to={cgLink(label)}
                                                            onClick={() => {
                                                                setIsDepartmentsOpen(false)
                                                                closeMobileMenu()
                                                            }}
                                                        >
                                                            {label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </li>
                <NavLink to="/food-drinks" onClick={closeMobileMenu} activeClassName='activlink' ><li>Food & Drinks</li></NavLink>
                <NavLink to="/shop" onClick={closeMobileMenu} activeClassName='activlink' ><li>Shop</li></NavLink>
                <NavLink to="/contact-us" onClick={closeMobileMenu} activeClassName='activlink' ><li>Contact us</li></NavLink>
                <NavLink to="/about" onClick={closeMobileMenu} activeClassName='activlink'><li>About</li></NavLink>

                {/* USER PROFILE INFO SECTION */}
                {isMobileMenuOpen && (
                    <div className="mobile-user-card">
                        {userInfo ? (
                            <div className="mobile-user-header">
                                <div className="mobile-user-avatar">
                                    {userInfo.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="mobile-user-info-block">
                                    <h4>{userInfo.name}</h4>
                                    <Link to="/profile" className="view-profile-btn" onClick={closeMobileMenu}>
                                        <span>View Profile</span>
                                        <svg 
                                            className="profile-arrow-svg" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2.5" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                        >
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="mobile-signin-btn" onClick={closeMobileMenu}>
                                Sign In
                            </Link>
                        )}

                        <div className="mobile-quick-actions">
                            <Link to="/cart" className="mobile-action" onClick={closeMobileMenu}>
                                <RiShoppingCart2Line />
                                <span>Cart</span>
                                {incart > 0 && (
                                    <span className="mobile-cart-count">{incart}</span>
                                )}
                            </Link>

                            <button
                                type="button"
                                className={`mobile-action ${isMobileSearchOpen ? 'mobile-action--active' : ''}`}
                                onClick={toggleMobileSearch}
                                aria-expanded={isMobileSearchOpen}
                            >
                                <MdSearch />
                                <span>Search</span>
                            </button>
                        </div>

                        {isMobileSearchOpen && (
                            <div className="mobile-search-panel">
                                <Route render={({ history }) => <Searchnav history={history} />} />
                            </div>
                        )}
                    </div>
                )}

                {/* SIGN OUT BUTTON POSITIONED AT THE ABSOLUTE BOTTOM */}
                {userInfo && isMobileMenuOpen && (
                    <li className="mobile-logout-item">
                        <button 
                            type="button" 
                            className="mobile-logout-btn" 
                            onClick={() => {
                                logoutHandler();   // Triggers confirmation modal visibility
                                closeMobileMenu(); // Instantly clears the sidebar drawer layer out of the way
                            }}
                        >
                            <IoLogOutOutline size="20" />
                            <span>Log Out</span>
                        </button>
                    </li>
                )}
            </ul>

            <button
                type="button"
                className={`burger ${isMobileMenuOpen ? 'toggle' : ''}`}
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
            >
                <div className='line1'></div>
                <div className='line2'></div>
                <div className='line3'></div>
            </button>
            
            <div className={`rightComp ${isMobileMenuOpen ? 'burgerActive' : ''}`}>
                <div ref={searchRef} className="search">
                    <Route render={({ history }) => <Searchnav history={history} />} />
                </div>

                {!showSearchIc && (
                    <button type="button" className="iconButton iconSearch" onClick={onSeacrhFun} aria-label="Search">
                        <MdSearch size='26' />
                    </button>
                )}
                <Link to='/cart' onClick={closeMobileMenu} className="iconButton iconCart" aria-label="Cart">
                    <RiShoppingCart2Line size='26' />
                    {userInfo && incart > 0 && (
                        <span className='dotcart' aria-label={`${incart} items in cart`}>
                            {incart}
                        </span>
                    )}
                </Link>

                {userInfo ? (
                    <>
                        <div className="user-dropdown" ref={userDropdownRef}>
                            <button className="dropdown-button" onClick={toggleDropdown} type="button">
                                {userInfo.name} <IoMdArrowDropdown />
                            </button>
                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to='/profile' className="dropdown-item">
                                        <CgProfile size='24' /> Settings
                                    </Link>
                                    <div className="dropdown-item" onClick={logoutHandler}>
                                        <IoLogOutOutline size='24' /> Logout
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <Link to='/login' onClick={closeMobileMenu} >
                        <div className='signin' onMouseOver={() => setSignin(!signin)} onMouseOut={() => setSignin(!signin)}  >
                            Sign in
                            {!signin ? <BsArrowRightShort size='25' /> : <MdKeyboardArrowRight size='25' />}
                        </div>
                    </Link>
                )}
            </div>
            {userInfo && (
                <ConfirmationModal
                    isOpen={isLogoutOpen}
                    onClose={closeLogoutModal}
                    title='Log Out'
                    description='Are you sure you want to log out?'
                    onConfirm={confirmLogout}
                    confirmLabel='Yes, log out'
                    cancelLabel='Cancel'
                />
            )}
        </nav>
    )
}
export default Nav
