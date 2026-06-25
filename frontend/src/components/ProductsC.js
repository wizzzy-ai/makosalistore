import React,{useEffect,useState} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import CardProduct from './CardProduct'
import {listProducts,ListproductbyCg, Listproductbyfiter,Listproductbyprice} from '../actions/productActions'
import {BsFilter} from 'react-icons/bs'
import {AiOutlineSearch} from 'react-icons/ai'
import {IoMdClose} from 'react-icons/io'
import Search from './Search';
import {NumberInput,NumberInputField,FormLabel, Button, Stack, FormControl, Select, Checkbox} from "@chakra-ui/react"
import HashLoader from "react-spinners/HashLoader";
import { Link, Route } from 'react-router-dom'
import { DEPARTMENTS, getApplicableFilterAttributes } from '../constants/taxonomy';
const ProductsC = ({ title, subtitle, eyebrow = 'Shop collection' }) => {
    const [From, setFrom] = useState('')
    const [To, setTo] = useState('')

    let Cg = window.location.search ? window.location.search.split('=')[1] : null
    if (Cg) Cg = decodeURIComponent(Cg)
    const keyword = window.location.pathname.split('/')[2] 
    const dispatch = useDispatch()
    const productList = useSelector((state) => state.productList)
    const {loading,error,products} = productList
    const searchType = window.location.search ? window.location.search.split('=')[0] : ''
    useEffect(()=>{
 
        if(Cg){
            if(searchType === '?cg'){
                dispatch(ListproductbyCg(Cg))
            }else{
                dispatch(Listproductbyfiter(Cg))

            }
        }else{
            dispatch(listProducts(keyword))
        }

    },[dispatch,Cg,keyword,searchType])
    const [showfilter,setshowfilter] = useState(false);
    const [showsearch,setshowsearch] = useState(false);
    const filterfunc = () =>{
        setshowfilter(!showfilter);
        if(showsearch){
            setshowsearch(false)
        }
 
    }
    const searchfunc=()=>{
        setshowsearch(!showsearch);
        if(showfilter){
            setshowfilter(false)
        }
    }
	    const pricehandler = ()=>{
	        dispatch(Listproductbyprice(From,To))
	    }

	    const cgLink = (cgValue) => `?cg=${encodeURIComponent(cgValue)}`
	    const applicableAttributes = getApplicableFilterAttributes(Cg)
	    const pageTitle = title || (Cg ? Cg : keyword ? `"${keyword}" Search` : 'All Products')
			    return (
	        <>
		        <div className = 'Cgfilter shopHeroPanel'>
	            <div className='shopHeroContent'>
	                <span className='shopEyebrow'>{eyebrow}</span>
	                <h1>{pageTitle}</h1>
	                <p>{subtitle || 'Browse the latest products, filter by category, and find exactly what fits your cart.'}</p>
		            </div>
	            <div className = 'filtersbtn '>
	            <button className = {`filterbtn ${showfilter ? 'activebtn' : ''}` }  
	            onClick = {filterfunc} > {showfilter ?  <IoMdClose  size = '20'/>: <BsFilter size = '20'/> } 
            Filter
            </button>
       
            <button className = {`searchbtn ${showsearch ? 'activebtn' : ''}` } onClick = {searchfunc}>{showsearch ?  <IoMdClose  size = '20'/>:<AiOutlineSearch size = '20'/>}Search</button>
            </div>
        
	            <div className = 'filters'> 
	            <ul>
	                    <Link className = 'lined' to = '?cg'>All</Link>
	                    {DEPARTMENTS.map((dept) => (
	                      <Link key={dept.id} className="lined" to={cgLink(dept.label)}>
	                        {dept.label}
	                      </Link>
	                    ))}
	            </ul>
	            </div>
	        </div>
        {showsearch && <Route render = {({history}) => <Search  history = {history}/> }/>} 
        <div className = {`filterarea ${showfilter ? 'filter' : 'filteroff' }`}>
        <div className = 'sortbydiv'>
            <h1> Sort By</h1>
            <ul>
                <Link onClick = {()=>(setshowfilter(false))} className = 'lined' to = '?filter'>Default</Link>
                <Link onClick = {()=>(setshowfilter(false))} className = 'lined' to = '?filter=date'>Date</Link>
                <Link onClick = {()=>(setshowfilter(false))} className = 'lined' to = '?filter=highprice'>Low to high price</Link>
                <Link onClick = {()=>(setshowfilter(false))} className = 'lined' to = '?filter=lowprice'>high to low price</Link>
            </ul> 
        </div>
	        <div className = 'pricediv'>
	            <h1> Price</h1>
	            <FormControl id="email">
                <Stack spacing = {2}>
                 <FormLabel>From :</FormLabel>
                 <NumberInput value={From} bg = 'white' onChange = {(e) => setFrom(e)} borderRadius="md" borderTopRadius="md" borderTopLeftRadius="md">
                 <NumberInputField />
                </NumberInput>
                 <FormLabel>To :</FormLabel>
                <NumberInput value = {To} bg = 'white' onChange = {(e) => setTo(e)} borderRadius="md" borderTopRadius="md" borderTopLeftRadius="md">
                 <NumberInputField />
                </NumberInput>
                <Button onClick = {pricehandler} type="submit" colorScheme="teal">Filter</Button>
                </Stack>
	            </FormControl>

	        </div>

	        {applicableAttributes.length > 0 && (
	          <div className='attribute-filters'>
	            <h1>Attributes</h1>
	            <FormControl>
	              {applicableAttributes.map((attr) => {
	                if (attr.key === 'condition') {
	                  return (
	                    <React.Fragment key={attr.key}>
	                      <FormLabel fontSize="sm">Condition</FormLabel>
	                      <Stack direction="row" spacing={4}>
	                        {attr.values.map((label) => (
	                          <Checkbox key={label} colorScheme="teal">
	                            {label}
	                          </Checkbox>
	                        ))}
	                      </Stack>
	                    </React.Fragment>
	                  )
	                }

	                return (
	                  <React.Fragment key={attr.key}>
	                    <FormLabel fontSize="sm">{attr.label}</FormLabel>
	                    <Select placeholder={`Select ${attr.label.toLowerCase()}`} size="sm" bg="white">
	                      {attr.values.map((label) => (
	                        <option key={label} value={label}>
	                          {label}
	                        </option>
	                      ))}
	                    </Select>
	                  </React.Fragment>
	                )
	              })}
	            </FormControl>
	          </div>
	        )}
	 
	    </div>
	            {loading ?
	               <div className='shopLoading'>
	                          <HashLoader   color={"#050505"}  loading={loading} size={40} />
	                     </div> 
	            : error ? <h2>{error} </h2> 
	            : products.length === 0 ? 
	            <div className = 'shopEmptyState'>
                    <h2>Nothing found</h2>
                    <p>Try a different category, search term, or price range.</p>
                </div> : <div className='shopProductsGrid cardsProduct'>
                       {products.map((product) =>(
                               <CardProduct key={product._id} product={product} />

                          )  )}

                  
                 </div> }
                   
        </> 
    )
}

export default ProductsC
