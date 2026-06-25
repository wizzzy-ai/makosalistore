import React, { useEffect, useMemo, useState } from 'react'
import { DeleteProduct, listProducts } from '../../actions/productActions';
import { useDispatch, useSelector } from 'react-redux';
import HashLoader from "react-spinners/HashLoader";
import { PRODUCT_CREATE_RESET } from '../../constants/productConstants';
import './products.css'
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import { Helmet } from 'react-helmet';
import BwConfirmDialog from '../../components/BwConfirmDialog';

const Products = ({history,match}) => {
    const dispatch = useDispatch()
    const LOW_STOCK_THRESHOLD = 5
    const productList = useSelector(state => state.productList)
    const {loading,error,products} = productList

	    const productDelete = useSelector(state => state.productDelete)
	    const {loading:loadingDelete,error:errorDelete,success:successDelete} = productDelete

	    const userLogin = useSelector(state => state.userLogin)
	    const {userInfo} = userLogin

	    const [searchTerm, setSearchTerm] = useState('')
	    const [categoryFilter, setCategoryFilter] = useState('all')
	    const [lowStockOnly, setLowStockOnly] = useState(false)
	    const [confirmDeleteId, setConfirmDeleteId] = useState(null)

	    useEffect(()=>{
	        dispatch({type : PRODUCT_CREATE_RESET})

	        if(!userInfo || !userInfo.isAdmin){
	            history.push('/login')
	        }
	        if (userInfo && userInfo.isAdmin){
	            dispatch(listProducts())

	        }
	    },[dispatch,history,userInfo,successDelete])
	    const deletehandler = (id) => {
	      setConfirmDeleteId(id)
	    }

	    const confirmDelete = () => {
	      if (!confirmDeleteId) return
	      dispatch(DeleteProduct(confirmDeleteId))
	      setConfirmDeleteId(null)
	    }

	    const createproducthandler = () =>{
	        history.push('/admin/product/new/edit')
	    }

    const categories = useMemo(() => {
      const all = (products || [])
        .flatMap((p) => (Array.isArray(p.category) ? p.category : [p.category]).filter(Boolean))
        .map((c) => String(c).trim())
        .filter(Boolean);
      return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));
    }, [products]);

	    const filteredProducts = useMemo(() => {
	      const term = searchTerm.trim().toLowerCase();
	      return (products || []).filter((p) => {
	        const name = String(p.name || '').toLowerCase();
	        const id = String(p._id || '').toLowerCase();
	        const productCategories = (Array.isArray(p.category) ? p.category : [p.category])
	          .filter(Boolean)
	          .map((c) => String(c));
	
	        const matchesSearch = !term || name.includes(term) || id.includes(term);
	        const matchesCategory =
	          categoryFilter === 'all' || productCategories.some((c) => c === categoryFilter);
	        const stockCount = Number(p.countInStock || 0)
	        const matchesLowStock = !lowStockOnly || stockCount <= LOW_STOCK_THRESHOLD
	
	        return matchesSearch && matchesCategory && matchesLowStock;
	      });
	    }, [products, searchTerm, categoryFilter, lowStockOnly]);

	    const lowStockCount = useMemo(() => {
	      return (products || []).filter((p) => {
	        const stockCount = Number(p.countInStock || 0)
	        return stockCount > 0 && stockCount <= LOW_STOCK_THRESHOLD
	      }).length
	    }, [products])

	    const outOfStockCount = useMemo(() => {
	      return (products || []).filter((p) => Number(p.countInStock || 0) === 0).length
	    }, [products])

	    const getStockBadge = (stockCount) => {
	      const n = Number(stockCount || 0)
	      if (n <= 0) return { label: 'Out', className: 'bw-badge bw-badge--danger' }
	      if (n <= LOW_STOCK_THRESHOLD) return { label: 'Low', className: 'bw-badge bw-badge--warning' }
	      return { label: 'OK', className: 'bw-badge bw-badge--ok' }
	    }

    return (
      <AdminLayout>
        <div className='admin-products'>
          <Helmet>
            <title>Admin • Products</title>
          </Helmet>

	          <div className='admin-products__top'>
	            <div>
	              <h1 className='admin-products__title'>Products</h1>
	              <p className='admin-products__subtitle'>
	                Manage product catalog and inventory - {lowStockCount} low stock - {outOfStockCount} out of stock
	              </p>
	            </div>

            <div className='admin-products__actions'>
              <button className='bw-btn bw-btn--primary' type='button' onClick={createproducthandler}>
                <FiPlus size={16} />
                Add Product
              </button>
            </div>
          </div>

	          <div className='admin-products__controls'>
	            <div className='bw-search'>
	              <FiSearch size={18} className='bw-search__icon' />
	              <input
	                value={searchTerm}
	                onChange={(e) => setSearchTerm(e.target.value)}
	                placeholder='Search by name or ID...'
	                className='bw-search__input'
	                type='text'
	              />
	            </div>

	            <div className='bw-select'>
	              <label className='bw-select__label' htmlFor='product-category-filter'>Category</label>
	              <select
	                id='product-category-filter'
	                className='bw-select__input'
	                value={categoryFilter}
	                onChange={(e) => setCategoryFilter(e.target.value)}
	              >
	                <option value='all'>All</option>
	                {categories.map((c) => (
	                  <option key={c} value={c}>{c}</option>
	                ))}
	              </select>
	            </div>

              <label className='bw-toggle' htmlFor='product-low-stock'>
                <input
                  id='product-low-stock'
                  type='checkbox'
                  checked={lowStockOnly}
                  onChange={(e) => setLowStockOnly(e.target.checked)}
                />
                <span>Low stock only</span>
              </label>
	          </div>

	          {loading || loadingDelete ? (
	            <div className='loading'>
	              <HashLoader color={"#111111"} loading={loading || loadingDelete} size={40} />
	            </div>
	          ) : error || errorDelete ? (
	            <div className='bw-alert bw-alert--error'>
	              {error || errorDelete}
	            </div>
	          ) : (
	            <div className='bw-card'>
	              <div className='bw-table-wrap'>
		                <table className='bw-table'>
	                  <thead>
	                    <tr>
	                      <th className='bw-table__id'>ID</th>
	                      <th>Name</th>
	                      <th>Stock</th>
	                      <th className='bw-table__num'>Price</th>
	                      <th>Category</th>
	                      <th className='bw-table__actions'>Actions</th>
	                    </tr>
	                  </thead>
                  <tbody>
	                    {filteredProducts.length === 0 ? (
	                      <tr>
	                        <td colSpan={6} className='bw-table__empty'>No products found.</td>
	                      </tr>
	                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product._id}>
                          <td className='bw-mono bw-truncate'>{product._id}</td>
                          <td className='bw-truncate'>{product.name}</td>
                          <td>
                            {(() => {
                              const stock = Number(product.countInStock || 0)
                              const badge = getStockBadge(stock)
                              return (
                                <span className='bw-stock'>
                                  <span className={badge.className}>{badge.label}</span>
                                  <span className='bw-stock__num'>{stock}</span>
                                </span>
                              )
                            })()}
                          </td>
                          <td className='bw-table__num'>₦{Number(product.price || 0).toLocaleString()}</td>
                          <td className='bw-truncate'>
                            {(Array.isArray(product.category) ? product.category : [product.category])
                              .filter(Boolean)
                              .join(' • ') || '—'}
                          </td>
                          <td className='bw-table__actions'>
                            <div className='bw-actions'>
                              <Link className='bw-btn bw-btn--ghost' to={`/admin/product/${product._id}/edit`}>
                                <FiEdit2 size={16} />
                                Edit
                              </Link>
                              <button
                                className='bw-btn bw-btn--danger'
                                type='button'
                                onClick={() => deletehandler(product._id)}
                              >
                                <FiTrash2 size={16} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
	            </div>
	          )}
	        </div>

          <BwConfirmDialog
            open={Boolean(confirmDeleteId)}
            title="Delete product?"
            message="This will permanently delete the product from your catalog."
            confirmText="Delete"
            cancelText="Cancel"
            tone="danger"
            onClose={() => setConfirmDeleteId(null)}
            onConfirm={confirmDelete}
          />
	      </AdminLayout>
	    )
	}

export default Products
