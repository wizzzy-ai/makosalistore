import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import HashLoader from 'react-spinners/HashLoader'
import CardProduct from '../../components/CardProduct'
import LottiePlayer from '../../components/LottiePlayer'
import { listProducts } from '../../actions/productActions'
import { DEPARTMENTS } from '../../constants/taxonomy'
import './FoodDeliveryPage.css'

const normalize = (value) => String(value ?? '').trim().toLowerCase()

const parseMinutes = (value) => {
  const text = String(value ?? '')
  const match = text.match(/(\d+)\s*-\s*(\d+)|(\d+)/)
  if (!match) return null
  const first = Number(match[1] || match[3])
  return Number.isFinite(first) ? first : null
}

const FoodDeliveryPage = () => {
  const dispatch = useDispatch()
  const productList = useSelector((state) => state.productList)
  const { loading, error, products = [] } = productList || {}

  const [activeCategory, setActiveCategory] = useState('all')
  const [activeDietary, setActiveDietary] = useState([])
  const [fastPrepOnly, setFastPrepOnly] = useState(false)
  const [freeDeliveryOnly, setFreeDeliveryOnly] = useState(false)

  useEffect(() => {
    dispatch(listProducts(''))
  }, [dispatch])

  const foodCategories = useMemo(() => {
    const dept = DEPARTMENTS.find((d) => d.id === 'food_drinks')
    const set = new Set()

    if (dept) {
      set.add(dept.label)
      for (const group of dept.items ?? []) {
        set.add(group.label)
        for (const link of group.links ?? []) set.add(link)
      }
    }

    // Backward/loose matches used across the app.
    ;[
      'Foodstuff',
      'Food',
      'Foods',
      'Drinks',
      'Drinkables',
      'Edibles',
      'Beverages',
    ].forEach((v) => set.add(v))

    return Array.from(set)
  }, [])

  const foodCategoryNeedles = useMemo(() => foodCategories.map(normalize), [foodCategories])

  const foodProducts = useMemo(() => {
    const matchesFood = (product) => {
      const categories = Array.isArray(product?.category) ? product.category : []
      const normalizedProductCategories = categories.map(normalize).filter(Boolean)

      return normalizedProductCategories.some((c) => foodCategoryNeedles.includes(c))
    }

    return (products || []).filter(matchesFood)
  }, [foodCategoryNeedles, products])

  const visibleProducts = useMemo(() => {
    let result = foodProducts

    if (activeCategory !== 'all') {
      const needle = normalize(activeCategory)
      result = result.filter((p) =>
        (Array.isArray(p.category) ? p.category : []).some((c) => normalize(c) === needle)
      )
    }

    if (activeDietary.length > 0) {
      const needles = new Set(activeDietary.map(normalize))
      result = result.filter((p) => {
        const values = Array.isArray(p?.dietary) ? p.dietary : []
        return values.some((v) => needles.has(normalize(v)))
      })
    }

    if (fastPrepOnly) {
      result = result.filter((p) => {
        const minutes = parseMinutes(p?.prepTime)
        return minutes !== null && minutes <= 20
      })
    }

    if (freeDeliveryOnly) {
      result = result.filter((p) => Number(p?.deliveryFee) === 0)
    }

    return result
  }, [activeCategory, activeDietary, fastPrepOnly, foodProducts, freeDeliveryOnly])

  const categoryOptions = useMemo(() => {
    const fromProducts = new Set()
    for (const product of foodProducts) {
      for (const cat of Array.isArray(product.category) ? product.category : []) {
        if (normalize(cat)) fromProducts.add(cat)
      }
    }
    return Array.from(fromProducts).sort((a, b) => String(a).localeCompare(String(b)))
  }, [foodProducts])

  const dietaryOptions = useMemo(() => {
    const fromProducts = new Set()
    for (const product of foodProducts) {
      for (const label of Array.isArray(product?.dietary) ? product.dietary : []) {
        if (normalize(label)) fromProducts.add(String(label).trim())
      }
    }
    return Array.from(fromProducts).sort((a, b) => String(a).localeCompare(String(b)))
  }, [foodProducts])

  const toggleDietary = (label) => {
    setActiveDietary((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return Array.from(next)
    })
  }

  const clearSectionFilters = () => {
    setActiveDietary([])
    setFastPrepOnly(false)
    setFreeDeliveryOnly(false)
  }

  return (
    <div className="foodDeliveryPage">
      <Helmet>
        <title>Food & Drinks</title>
      </Helmet>

      <div className="foodDeliveryHeader">
        <div className="foodDeliveryHeroText">
          <span className="foodDeliveryEyebrow">Fresh picks</span>
          <h1>Food & Drinks</h1>
          <p>Browse meals, drinks, groceries, and quick delivery options in one clean place.</p>
          <div className="foodDeliveryStats" aria-label="Food and drinks summary">
            <div>
              <strong>{foodProducts.length}</strong>
              <span>Items</span>
            </div>
            <div>
              <strong>{visibleProducts.length}</strong>
              <span>Showing</span>
            </div>
          </div>
        </div>

	        <div className="foodDeliveryFilters">
	          <LottiePlayer
	            src="/lottie/food.json"
	            className="foodDeliveryCategoryLottie"
	            aria-hidden="true"
	          />
	          <label htmlFor="foodCategory">Category</label>
	          <select
            id="foodCategory"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            <option value="all">All</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="foodDeliverySectionFilters" aria-label="Section filters">
        <div className="foodDeliverySectionFiltersHeader">
          <div>
            <span className="foodDeliveryEyebrow">Refine</span>
            <h2>Find your order faster</h2>
          </div>
          <button
            type="button"
            className="foodDeliveryClearFiltersBtn"
            onClick={clearSectionFilters}
            disabled={
              activeDietary.length === 0 &&
              !fastPrepOnly &&
              !freeDeliveryOnly
            }
          >
            Clear
          </button>
        </div>

        <div className="foodDeliverySectionFiltersGrid">
          <div className="foodDeliveryFilterBlock">
            <span className="foodDeliveryInlineLabel">Quick</span>
            <div className="foodDeliveryQuickToggles">
              <label className="foodDeliveryToggle">
                <input
                  type="checkbox"
                  checked={fastPrepOnly}
                  onChange={(e) => setFastPrepOnly(e.target.checked)}
                />
                <span>Fast prep (&lt;= 20 min)</span>
              </label>
              <label className="foodDeliveryToggle">
                <input
                  type="checkbox"
                  checked={freeDeliveryOnly}
                  onChange={(e) => setFreeDeliveryOnly(e.target.checked)}
                />
                <span>Free delivery</span>
              </label>
            </div>
          </div>

          <div className="foodDeliveryFilterBlock foodDeliveryDietaryBlock">
            <span className="foodDeliveryInlineLabel">Dietary</span>
            {dietaryOptions.length === 0 ? (
              <div className="foodDeliveryMuted">No dietary tags yet.</div>
            ) : (
              <div className="foodDeliveryChips" role="list" aria-label="Dietary filters">
                {dietaryOptions.map((label) => {
                  const active = activeDietary.includes(label)
                  return (
                    <button
                      key={label}
                      type="button"
                      className={active ? 'foodDeliveryChip foodDeliveryChipActive' : 'foodDeliveryChip'}
                      onClick={() => toggleDietary(label)}
                      aria-pressed={active}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="foodDeliveryLoading">
          <HashLoader color={'#1e1e2c'} loading={loading} size={40} />
        </div>
      ) : error ? (
        <div className="foodDeliveryError">{error}</div>
      ) : visibleProducts.length === 0 ? (
        <div className="foodDeliveryEmpty">
          <h3>No food or drink items found</h3>
          <p>Try clearing filters or add products under food and drinks categories.</p>
        </div>
      ) : (
        <div className="foodDeliveryProducts cardsProduct">
          {visibleProducts.map((product) => (
            <CardProduct key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default FoodDeliveryPage
