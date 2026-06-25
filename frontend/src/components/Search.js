import React, { useState } from 'react'
import {Input} from '@chakra-ui/react'
 
const Search = ({history}) => {
    const [keyword, setkeyword] = useState('')
    const Handlesearch = (e) => {
        if(keyword.trim() && e.key === 'Enter'){
            history.push(`/search/${keyword}`)
        }
    }
    return (
        <div className = 'Searcharea'>
        <Input size="lg" value = {keyword} onChange = {e=> setkeyword(e.target.value)} onKeyPress = {Handlesearch} bgColor  = 'white' placeholder="Tap For Search" />
        </div>
    )
}
 
export default Search
