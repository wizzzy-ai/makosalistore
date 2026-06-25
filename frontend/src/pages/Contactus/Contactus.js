import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Helmet } from 'react-helmet'
import { Input, InputGroup, InputLeftElement, Textarea, Button, Text } from '@chakra-ui/react'
import { BsEnvelope } from 'react-icons/bs'
import { GiPositionMarker } from 'react-icons/gi'
import { HiOutlinePhone } from 'react-icons/hi'
import './contactuscss.css'

const Contactus = () => {
    const line = useRef(null)
    const text = useRef(null)
    const [email, setemail] = useState('')
    const [body, setbody] = useState('')
    const [loading, setloading] = useState(false)
    const [successMessage, setsuccessMessage] = useState('')
    const [errorMessage, seterrorMessage] = useState('')
    const [fallbackEmail, setfallbackEmail] = useState('abdulmahleeque07@gmail.com')

    useEffect(() => {
        const timer = setTimeout(() => {
            line.current?.classList.add('lineon')
            text.current?.classList.add('titleon')
        }, 5)

        return () => clearTimeout(timer)
    }, [])

    const handlesubmit = async () => {
        if (!email || !body) {
            seterrorMessage('Please enter your email and message')
            setsuccessMessage('')
            return
        }

        try {
            setloading(true)
            seterrorMessage('')
            setsuccessMessage('')

            const { data } = await axios.post('/api/contact', {
                email,
                message: body
            })

            setsuccessMessage(data.message || 'Message sent successfully')
            setfallbackEmail(data.supportEmail || fallbackEmail)
            setemail('')
            setbody('')
        } catch (error) {
            const supportEmail =
                error.response && error.response.data && error.response.data.supportEmail
                ? error.response.data.supportEmail
                : fallbackEmail

            setfallbackEmail(supportEmail)
            seterrorMessage(
                error.response && error.response.data.message
                ? error.response.data.message
                : 'Unable to send message right now'
            )
        } finally {
            setloading(false)
        }
    }

    return (
        <div className="contactUs">
            <Helmet>
                <title>Contact</title>
            </Helmet>

            <div className='contactHeading'>
                <div className='line' ref={line}></div>
                <h1 className='title' ref={text}>Contact Urban Threads</h1>
            </div>

            <div className="card-contact">
                <div className="sendMsg">
                    <div className="form-container">
                        <h4>Send Us A Message</h4>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <InputGroup width="100%">
                                    <InputLeftElement pointerEvents="none" children={<BsEnvelope className='input-icon' />} />
                                    <Input 
                                        id="email"
                                        value={email} 
                                        onChange={e => setemail(e.target.value)} 
                                        type="email" 
                                        placeholder="your.email@example.com"
                                        className="modern-input"
                                    />
                                </InputGroup>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="message" className="form-label">Message</label>
                            <div className="textarea-wrapper">
                                <Textarea 
                                    id="message"
                                    value={body} 
                                    onChange={e => setbody(e.target.value)} 
                                    width="100%" 
                                    placeholder="How can we help you? Tell us more about your inquiry..."
                                    height="160px"
                                    className="modern-textarea"
                                />
                            </div>
                        </div>
                        {successMessage && <Text className='contactSuccess'>{successMessage}</Text>}
                        {errorMessage && <Text className='contactError'>{errorMessage}</Text>}
                        <Text className='contactHelp'>
                            Prefer email? <a href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a>
                        </Text>
                        <div className="contentContact">
                            <Button isLoading={loading} onClick={handlesubmit} borderRadius="90px" colorScheme="teal" variant="solid" className="contactBtn">Send Message</Button>
                        </div>
                    </div>
                </div>
                <div className="showAdrss">
                    <div className="box">
                        <div className="iconCtn"><GiPositionMarker opacity="0.8" /></div>
                        <div className="adressCtn">
                            <h3>Address</h3>
                            <p>Urban Threads Studio, 241 Market Street, Suite 5, Lagos</p>
                        </div>
                    </div>
                    <div className="box">
                        <div className="iconCtn"><HiOutlinePhone opacity="0.8" /></div>
                        <div className="adressCtn">
                            <h3>Contact Support</h3>
                            <p className="infoCtn">07069185859</p>
                        </div>
                    </div>
                    <div className="box">
                        <div className="iconCtn"><BsEnvelope opacity="0.8" /></div>
                        <div className="adressCtn">
                            <h3>Email Support</h3>
                            <p className="infoCtn"><a href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contactus
