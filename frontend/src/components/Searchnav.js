import { Input, InputGroup, InputRightElement } from '@chakra-ui/input'
import React, { useState } from 'react'
import { MdSearch } from 'react-icons/md'

const Searchnav = ({history}) => {
    const [keyword, setkeyword] = useState('')

    const submitSearch = () => {
        const value = keyword.trim()
        if (value) {
            history.push(`/search/${value}`)
        }
    }

    const Handlesearch = (e) => {
        if(e.key === 'Enter'){
            submitSearch()
        }
    }

    return (
        <InputGroup className="navSearch">
            <Input
                className="navSearch-input"
                value={keyword}
                onChange={e=> setkeyword(e.target.value)}
                bgColor='white'
                placeholder='Search products, food, brands...'
                onKeyPress={Handlesearch}
            />
            <InputRightElement
                className="navSearch-submit"
                children={
                    <button type="button" onClick={submitSearch} aria-label="Search products">
                        <MdSearch/>
                    </button>
                }
            />
        </InputGroup>
    )
}

export default Searchnav
