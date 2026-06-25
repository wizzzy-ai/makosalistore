import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import HashLoader from 'react-spinners/HashLoader';
import AdminLayout from '../../components/AdminLayout';
import { listProductDetails, UpdateProduct, CreateProductWithData } from '../../actions/productActions';
import { PRODUCT_UPDATE_RESET, PRODUCT_CREATE_RESET } from '../../constants/productConstants';
import { DEPARTMENTS, FILTER_ATTRIBUTES } from '../../constants/taxonomy';
import './Editproduct.css';
const Editproduct = ({match,history}) => {
	    const productId = match.params.id
	    const isNewProduct = productId === 'new'
	    const DEFAULT_IMAGE_PLACEHOLDER = 'https://i.imgur.com/QN2BSdJ.jpg'
	    const [name,setName] = useState('')
	    const [description,setdescription] = useState('')
	    const [price,setprice] = useState(0)
	    const [countInStock,setcountInStock] = useState(0)
    const [Url1,setUrl1] = useState('')
    const [Url2,setUrl2] = useState('')
    const [Url3,setUrl3] = useState('')
	    const [sizes,setsizes] = useState([])
	    const [category,setcategory] = useState([])
	    const [departmentId, setDepartmentId] = useState('')
	    const [uploadingSlot,setUploadingSlot] = useState(null)
	    const [uploadError,setUploadError] = useState('')
	    const [reviewsAdmin, setReviewsAdmin] = useState([])
	    const [reviewsAdminLoading, setReviewsAdminLoading] = useState(false)
	    const [reviewsAdminError, setReviewsAdminError] = useState('')
	    const [reviewActionLoading, setReviewActionLoading] = useState(false)

    const dispatch = useDispatch()

	    const productDetails = useSelector(state => state.productDetails)
	  
	    const { loading,error, product } = productDetails
	    const detailsLoading = isNewProduct ? false : loading
	    const detailsError = isNewProduct ? null : error

	    const productUpdate = useSelector(state => state.productUpdate)
	   
	    const { loading:lodingUpdate,error:errorUpdate, success:successUpdate } = productUpdate

	    const productCreate = useSelector(state => state.productCreate)
	    const { loading:loadingCreate, error:errorCreate, success:successCreate, product:createdproduct } = productCreate

	    const userLogin = useSelector(state => state.userLogin)
	    const { userInfo } = userLogin

	    const fetchReviewsAdmin = async () => {
	      if (!userInfo || !userInfo.isAdmin || isNewProduct) return
	      try {
	        setReviewsAdminLoading(true)
	        setReviewsAdminError('')
	        const config = {
	          headers: {
	            Authorization: `Bearer ${userInfo.token}`,
	          },
	        }
	        const { data } = await axios.get(`/api/products/${productId}/reviews/all`, config)
	        setReviewsAdmin(Array.isArray(data) ? data : [])
	      } catch (err) {
	        setReviewsAdminError(
	          err.response && err.response.data && err.response.data.message
	            ? err.response.data.message
	            : err.message
	        )
	      } finally {
	        setReviewsAdminLoading(false)
	      }
	    }

	    const imageUrls = useMemo(() => [Url1, Url2, Url3].filter(Boolean), [Url1, Url2, Url3])
	    const selectedDepartment = useMemo(
	        () => DEPARTMENTS.find((d) => d.id === departmentId) || null,
	        [departmentId]
	    )

	    const sizeOptions = useMemo(() => {
	      if (!selectedDepartment) return []

	      if (selectedDepartment.id === 'food_drinks') {
	        const volumeValues =
	          FILTER_ATTRIBUTES.find((a) => a.key === 'volume_size')?.values || []
	        const defaults = ['250ml', '500ml', '1L', '2L', '5L']
	        return Array.from(new Set([...volumeValues, ...defaults]))
	      }

	      if (selectedDepartment.id === 'sports_outdoors') {
	        const isDumbbells = (category || []).some((c) => String(c) === 'Dumbbells')
	        if (isDumbbells) {
	          return ['2kg', '5kg', '10kg', '15kg', '20kg', '25kg', '30kg']
	        }
	        return []
	      }

	      if (selectedDepartment.id === 'fashion_accessories') {
	        return ['S', 'M', 'L', 'XL']
	      }

	      return []
	    }, [selectedDepartment, category])

	    const visibleSizeOptions = useMemo(() => {
	      const existing = (sizes || []).map((s) => String(s)).filter(Boolean)
	      return Array.from(new Set([...(sizeOptions || []), ...existing]))
	    }, [sizeOptions, sizes])


		    useEffect(() => {



	        if(successUpdate){
	            dispatch({type : PRODUCT_UPDATE_RESET})
	            history.push('/admin/products')
	        }
	        else if (successCreate) {
	            dispatch({type : PRODUCT_CREATE_RESET})
	            history.push(`/admin/product/${createdproduct._id}/edit`)
	        }
	        else{
	            if (isNewProduct) {
	                setName('')
	                setprice(0)
	                setdescription('')
	                setUrl1('')
	                setUrl2('')
	                setUrl3('')
	                setcategory([])
	                setsizes([])
	                setDepartmentId('')
	                setcountInStock(0)
	            } else {
		                if(!product.name || product._id !== productId){
		                    dispatch(listProductDetails(productId))
		                  }else{
	                    setName(product.name)
	                    setprice(product.price)
	                    setdescription(product.description)
	                    const productImages = product.images || []
	                    const isDefaultPlaceholder =
	                      productImages.length === 3 &&
	                      productImages.every((img) => String(img) === DEFAULT_IMAGE_PLACEHOLDER)
	                    setUrl1(isDefaultPlaceholder ? '' : (productImages[0] || ''))
	                    setUrl2(isDefaultPlaceholder ? '' : (productImages[1] || ''))
	                    setUrl3(isDefaultPlaceholder ? '' : (productImages[2] || ''))
	                    const productCategories = product.category || []
	                    const productSizes = product.sizes || []
	                    setcategory(productCategories)
	                    setsizes(productSizes)
	                    const inferredDept =
	                      DEPARTMENTS.find((d) =>
	                        (productCategories || []).some((c) => String(c).trim().toLowerCase() === String(d.label).trim().toLowerCase())
	                      ) || null
	                    setDepartmentId(inferredDept ? inferredDept.id : '')
		                    setcountInStock(product.countInStock)
		                    fetchReviewsAdmin()
		                  }
		            }
		        }

		    }, [dispatch,productId,history,product,successUpdate,isNewProduct,successCreate,createdproduct])

		    const onToggleReviewApproval = async (reviewId, nextApproved) => {
		      if (!userInfo || !userInfo.isAdmin) return
		      try {
		        setReviewActionLoading(true)
		        setReviewsAdminError('')
		        const config = {
		          headers: {
		            'Content-Type': 'application/json',
		            Authorization: `Bearer ${userInfo.token}`,
		          },
		        }
		        const { data } = await axios.put(
		          `/api/products/${productId}/reviews/${reviewId}/approve`,
		          { isApproved: nextApproved },
		          config
		        )
		        setReviewsAdmin((prev) =>
		          (prev || []).map((r) => (r._id === reviewId ? { ...r, ...data.review } : r))
		        )
		      } catch (err) {
		        setReviewsAdminError(
		          err.response && err.response.data && err.response.data.message
		            ? err.response.data.message
		            : err.message
		        )
		      } finally {
		        setReviewActionLoading(false)
		      }
		    }

		    const onDeleteReview = async (reviewId) => {
		      if (!userInfo || !userInfo.isAdmin) return
		      if (!window.confirm('Delete this review?')) return
		      try {
		        setReviewActionLoading(true)
		        setReviewsAdminError('')
		        const config = {
		          headers: {
		            Authorization: `Bearer ${userInfo.token}`,
		          },
		        }
		        await axios.delete(`/api/products/${productId}/reviews/${reviewId}`, config)
		        setReviewsAdmin((prev) => (prev || []).filter((r) => r._id !== reviewId))
		      } catch (err) {
		        setReviewsAdminError(
		          err.response && err.response.data && err.response.data.message
		            ? err.response.data.message
		            : err.message
		        )
		      } finally {
		        setReviewActionLoading(false)
		      }
		    }

	    const submitHandler = (e) => {
	        e.preventDefault()
	        const images = [Url1, Url2, Url3].filter(Boolean)
	        if (isNewProduct) {
	            dispatch(CreateProductWithData({
	                name,
	                price,
	                images,
	                category,
	                sizes,
	                countInStock,
	                description
	            }))
	        } else {
	            dispatch(UpdateProduct({
	                _id: productId,
	                name,
	                price,
	                images,
	                category,
	                sizes,
	                countInStock,
	                description

	            }))
	        }
	    }
    const checkboxhandler = (value) =>{
        setsizes((prevSizes) =>
            prevSizes.includes(value)
                ? prevSizes.filter((size) => size !== value)
                : [...prevSizes, value]
        )
    }
    
	    const checkboxhandlercg = (value) =>{
	        setcategory((prevCategories) =>
	            prevCategories.includes(value)
	                ? prevCategories.filter((item) => item !== value)
	                : [...prevCategories, value]
	        )
	    }

	    const onDepartmentChange = (nextDeptId) => {
	      setDepartmentId(nextDeptId)
	      const nextDept = DEPARTMENTS.find((d) => d.id === nextDeptId) || null
	      if (!nextDept) return

	      setcategory((prev) => {
	        const withoutOtherDepts = (prev || []).filter(
	          (c) => !DEPARTMENTS.some((d) => String(c).trim().toLowerCase() === String(d.label).trim().toLowerCase())
	        )
	        return withoutOtherDepts.includes(nextDept.label)
	          ? withoutOtherDepts
	          : [...withoutOtherDepts, nextDept.label]
	      })
	    }

    const uploadFileHandler = async (e, slot) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        const formData = new FormData()
        formData.append('image', file)

        try {
            setUploadingSlot(slot)
            setUploadError('')

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`
                }
            }

            const { data } = await axios.post('/api/upload', formData, config)

            if (slot === 1) setUrl1(data)
            if (slot === 2) setUrl2(data)
            if (slot === 3) setUrl3(data)
        } catch (error) {
            setUploadError(
                error.response && error.response.data.message
                ? error.response.data.message
                : error.message
            )
        } finally {
            setUploadingSlot(null)
        }
    }

    return (
        <AdminLayout>
          <div className="admin-product-edit">
            <Helmet>
              <title>Admin • Edit Product</title>
            </Helmet>

            <div className="admin-product-edit__top">
              <div>
	                <h1 className="admin-product-edit__title">{isNewProduct ? 'Add Product' : 'Edit Product'}</h1>
                <p className="admin-product-edit__subtitle">
                  Update details, inventory, categories, sizes, and images
                </p>
              </div>

              <div className="admin-product-edit__actions">
                <Link className="bw-btn bw-btn--ghost" to="/admin/products">
                  <FiArrowLeft size={16} />
                  Back
                </Link>
                <button className="bw-btn bw-btn--primary" type="submit" form="admin-product-edit-form">
                  <FiSave size={16} />
                  Save
                </button>
              </div>
            </div>

	            {(detailsError || errorUpdate || errorCreate) && (
	              <div className="bw-alert bw-alert--error">{detailsError || errorUpdate || errorCreate}</div>
	            )}

		            {detailsLoading || lodingUpdate || loadingCreate ? (
		              <div className="loading">
		                <HashLoader color={"#111111"} loading={detailsLoading || lodingUpdate || loadingCreate} size={40} />
		              </div>
		            ) : (
		              <>
		                <div className="bw-card">
                <form id="admin-product-edit-form" onSubmit={submitHandler} className="admin-product-edit__form">
                  <section className="admin-product-edit__section">
                    <div className="admin-product-edit__section-head">
                      <h2>Basics</h2>
                      <p>Core product details and pricing.</p>
                    </div>

                    <div className="admin-product-edit__grid">
                      <div className="bw-field">
                        <label className="bw-label" htmlFor="product-name">Product Name</label>
                        <input
                          id="product-name"
                          className="bw-input"
                          type="text"
                          value={name}
                          placeholder="e.g. Premium Leather Jacket"
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="bw-field">
                        <label className="bw-label" htmlFor="product-price">Price</label>
                        <input
                          id="product-price"
                          className="bw-input"
                          type="number"
                          min="0"
                          step="0.01"
                          value={price}
                          placeholder="0.00"
                          onChange={(e) => setprice(e.target.value)}
                          required
                        />
                      </div>

                      <div className="bw-field">
                        <label className="bw-label" htmlFor="product-stock">Count In Stock</label>
                        <input
                          id="product-stock"
                          className="bw-input"
                          type="number"
                          min="0"
                          step="1"
                          value={countInStock}
                          placeholder="0"
                          onChange={(e) => setcountInStock(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </section>

                  <section className="admin-product-edit__section">
                    <div className="admin-product-edit__section-head">
                      <h2>Description</h2>
                      <p>Clear, sales-focused copy helps conversions.</p>
                    </div>

                    <div className="bw-field">
                      <label className="bw-label" htmlFor="product-description">Product Description</label>
	                      <textarea
	                        id="product-description"
	                        className="bw-textarea"
	                        value={description}
	                        placeholder="Describe the product, materials, fit, warranty, etc."
	                        onChange={(e) => setdescription(e.target.value)}
	                        rows={5}
	                        required
	                      />
                    </div>
                  </section>

	                  <section className="admin-product-edit__section">
	                    <div className="admin-product-edit__section-head">
	                      <h2>Department</h2>
	                      <p>Pick a department, then choose the sections that fit this product.</p>
	                    </div>

	                    <div className="admin-product-edit__dept">
	                      <div className="bw-field">
	                        <label className="bw-select__label" htmlFor="product-department">Department</label>
	                        <select
	                          id="product-department"
	                          className="bw-select__input"
	                          value={departmentId}
	                          onChange={(e) => onDepartmentChange(e.target.value)}
	                        >
	                          <option value="">Select a department...</option>
	                          {DEPARTMENTS.map((d) => (
	                            <option key={d.id} value={d.id}>
	                              {d.label}
	                            </option>
	                          ))}
	                        </select>
	                      </div>

	                      {selectedDepartment ? (
	                        <div className="bw-chipgroup" aria-label="Department sections">
	                          {(selectedDepartment.items || []).map((group) => (
	                            <div key={group.label} className="bw-chipgroup__block">
	                              <div className="bw-chipgroup__label">{group.label}</div>
	                              <div className="bw-chipgrid" role="group" aria-label={`${group.label} options`}>
	                                {(group.links || []).map((link) => (
	                                  <label
	                                    key={link}
	                                    className={`bw-chip ${category.includes(link) ? 'is-active' : ''}`}
	                                  >
	                                    <input
	                                      type="checkbox"
	                                      checked={category.includes(link)}
	                                      onChange={() => checkboxhandlercg(link)}
	                                    />
	                                    <span>{link}</span>
	                                  </label>
	                                ))}
	                              </div>
	                            </div>
	                          ))}
	                        </div>
	                      ) : (
	                        <div className="bw-alert bw-alert--subtle">
	                          Choose a department to see its sections.
	                        </div>
	                      )}
	                    </div>
	                  </section>

	                  <section className="admin-product-edit__section">
	                    <div className="admin-product-edit__section-head">
	                      <h2>Sizes</h2>
	                      <p>
	                        {selectedDepartment?.id === 'food_drinks'
	                          ? 'Choose available volumes (ml/L).'
	                          : selectedDepartment?.id === 'sports_outdoors' && (category || []).includes('Dumbbells')
	                            ? 'Choose available weights (kg).'
	                          : 'Choose available sizes.'}
	                      </p>
	                    </div>

	                    {selectedDepartment ? (
	                      visibleSizeOptions.length > 0 ? (
	                        <div className="bw-chipgrid" role="group" aria-label="Sizes">
	                          {visibleSizeOptions.map((s) => (
	                            <label key={s} className={`bw-chip ${sizes.includes(s) ? 'is-active' : ''}`}>
	                              <input type="checkbox" checked={sizes.includes(s)} onChange={() => checkboxhandler(s)} />
	                              <span>{s}</span>
	                            </label>
	                          ))}
	                        </div>
	                      ) : (
	                        <div className="bw-alert bw-alert--subtle">
	                          Sizes aren’t used for this department.
	                        </div>
	                      )
	                    ) : (
	                      <div className="bw-alert bw-alert--subtle">Select a department to enable sizes.</div>
	                    )}
	                  </section>

	                  {selectedDepartment ? (
	                    <section className="admin-product-edit__section admin-product-edit__section--images">
	                      <div className="admin-product-edit__section-head">
	                        <h2>Images</h2>
	                        <p>Paste URLs or upload new images (up to 3).</p>
	                      </div>

	                      <div className="admin-product-edit__images">
	                        {[
	                          { slot: 1, label: 'Image 1', url: Url1, setUrl: setUrl1 },
	                          { slot: 2, label: 'Image 2', url: Url2, setUrl: setUrl2 },
	                          { slot: 3, label: 'Image 3', url: Url3, setUrl: setUrl3 }
	                        ].map(({ slot, label, url, setUrl }) => (
	                          <div key={slot} className="bw-image-card">
	                            <div className="bw-image-card__top">
	                              <div className="bw-image-card__label">{label}</div>
	                              {url ? (
	                                <a className="bw-link" href={url} target="_blank" rel="noreferrer">
	                                  Open
	                                </a>
	                              ) : (
	                                <span className="bw-muted">No image</span>
	                              )}
	                            </div>

	                            <div className="bw-field">
	                              <label className="bw-label" htmlFor={`product-image-url-${slot}`}>Image URL</label>
	                              <input
	                                id={`product-image-url-${slot}`}
	                                className="bw-input"
	                                type="url"
	                                placeholder="https://..."
	                                value={url}
	                                onChange={(e) => setUrl(e.target.value)}
	                              />
	                            </div>

	                            <div className="bw-field">
	                              <label className="bw-label" htmlFor={`product-image-file-${slot}`}>Upload Image</label>
	                              <input
	                                id={`product-image-file-${slot}`}
	                                className="bw-file"
	                                type="file"
	                                accept="image/*"
	                                onChange={(e) => uploadFileHandler(e, slot)}
	                              />
	                            </div>

	                            {url ? (
	                              <div className="bw-image-preview">
	                                <img src={url} alt={`${label} preview`} />
	                              </div>
	                            ) : null}
	                          </div>
	                        ))}
	                      </div>

	                      {uploadingSlot ? (
	                        <div className="bw-alert bw-alert--info">Uploading image {uploadingSlot}...</div>
	                      ) : null}
	                      {uploadError ? (
	                        <div className="bw-alert bw-alert--error">{uploadError}</div>
	                      ) : null}

	                      {imageUrls.length > 0 ? (
	                        <div className="bw-alert bw-alert--subtle">
	                          Using {imageUrls.length} image{imageUrls.length === 1 ? '' : 's'} for this product.
	                        </div>
	                      ) : null}
	                    </section>
		                  ) : (
		                    <section className="admin-product-edit__section">
		                      <div className="admin-product-edit__section-head">
		                        <h2>Images</h2>
		                        <p>Paste URLs or upload new images (up to 3).</p>
		                      </div>
		                      <div className="bw-alert bw-alert--subtle">Select a department to enable images.</div>
		                    </section>
		                  )}
		                </form>
		              </div>

		              {!isNewProduct && userInfo?.isAdmin ? (
		                <div className="bw-card admin-product-edit__reviews">
		                  <section className="admin-product-edit__section">
		                    <div className="admin-product-edit__section-head admin-product-edit__section-head--row">
		                      <div>
		                        <h2>Reviews Moderation</h2>
		                        <p>Approve or delete customer reviews before they appear publicly.</p>
		                      </div>
		                      <button
		                        type="button"
		                        className="bw-btn bw-btn--ghost"
		                        onClick={fetchReviewsAdmin}
		                        disabled={reviewsAdminLoading || reviewActionLoading}
		                      >
		                        Refresh
		                      </button>
		                    </div>

		                    {reviewsAdminError ? (
		                      <div className="bw-alert bw-alert--error">{reviewsAdminError}</div>
		                    ) : null}

		                    {reviewsAdminLoading ? (
		                      <div className="bw-alert bw-alert--info">Loading reviews…</div>
		                    ) : reviewsAdmin.length === 0 ? (
		                      <div className="bw-alert bw-alert--subtle">No reviews yet.</div>
		                    ) : (
		                      <div className="bw-tablewrap" role="region" aria-label="Product reviews">
		                        <table className="bw-table">
		                          <thead>
		                            <tr>
		                              <th>User</th>
		                              <th>Rating</th>
		                              <th>Status</th>
		                              <th>Date</th>
		                              <th>Comment</th>
		                              <th className="bw-table__actions">Actions</th>
		                            </tr>
		                          </thead>
		                          <tbody>
		                            {reviewsAdmin
		                              .slice()
		                              .sort((a, b) => (a.isApproved === b.isApproved ? 0 : a.isApproved ? 1 : -1))
		                              .map((review) => (
		                                <tr key={review._id}>
		                                  <td>{review.name}</td>
		                                  <td>{review.rating}/5</td>
		                                  <td>
		                                    <span className={`bw-badge ${review.isApproved ? 'bw-badge--ok' : 'bw-badge--pending'}`}>
		                                      {review.isApproved ? 'Approved' : 'Pending'}
		                                    </span>
		                                  </td>
		                                  <td>{String(review.createdAt || '').substring(0, 10)}</td>
		                                  <td className="bw-table__comment">{review.comment}</td>
		                                  <td className="bw-table__actions">
		                                    <button
		                                      type="button"
		                                      className="bw-btn bw-btn--primary"
		                                      onClick={() => onToggleReviewApproval(review._id, !review.isApproved)}
		                                      disabled={reviewActionLoading}
		                                    >
		                                      {review.isApproved ? 'Unapprove' : 'Approve'}
		                                    </button>
		                                    <button
		                                      type="button"
		                                      className="bw-btn bw-btn--danger"
		                                      onClick={() => onDeleteReview(review._id)}
		                                      disabled={reviewActionLoading}
		                                    >
		                                      Delete
		                                    </button>
		                                  </td>
		                                </tr>
		                              ))}
		                          </tbody>
		                        </table>
		                      </div>
		                    )}
		                  </section>
		                </div>
			              ) : null}
		              </>
		            )}
		          </div>
		        </AdminLayout>
	    )
	}

export default Editproduct
