import React from 'react';
import { Image } from '@chakra-ui/image';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Select } from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';
import { addToCart, removeFromCart, updateCartItemOptions } from '../actions/cartActions';
import { resolveDepartmentForCategory } from '../constants/taxonomy';
import { formatCurrency } from '../utils/formatCurrency';

const isFoodDrinksItem = (product) => {
  const categories = Array.isArray(product?.category) ? product.category : [];
  return categories.some((c) => resolveDepartmentForCategory(c)?.id === 'food_drinks');
};

const DEFAULT_FOOD_ADDONS = [
  { id: 'extra_sauce', label: 'Extra sauce' },
  { id: 'extra_spice', label: 'Extra spice' },
  { id: 'extra_cheese', label: 'Extra cheese' },
  { id: 'cutlery', label: 'Include cutlery' },
];

const Productoncart = ({ product }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const foodItem = isFoodDrinksItem(product);
  const options = product?.options || {};

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const qtyChangeHandler = (value) => {
    if (!userInfo) {
      history.push('/login?redirect=/cart');
      return;
    }
	    dispatch(addToCart(product.product, Number(value)));
	  };

  const updateOptions = (next) => {
    dispatch(updateCartItemOptions(product.product, next));
  };

  const toggleAddon = (addonId) => {
    const current = Array.isArray(options?.addons) ? options.addons : [];
    const next = current.includes(addonId)
      ? current.filter((x) => x !== addonId)
      : [...current, addonId];
    updateOptions({ addons: next });
  };

	  return (
	    <article className="productcart">
	      <div className="imagecart">
	        <Image objectFit="cover" src={product.images[0]} alt={product.name} />
      </div>

      <div className="productinfo">
        <Link to={`/product/${product.product}`}>
          <h2 className="productname">{product.name}</h2>
        </Link>

        <p className="productnote">fulfilled by Urban Threads</p>

		        <div className="productmeta">
		          <span className="priceproduct">{formatCurrency(product.price)}</span>
		          <span className="producttag">
		            {product.countInStock > 0 ? 'In stock' : 'Out of stock'}
		          </span>
		        </div>

          {foodItem ? (
            <details className="cartFoodOptions">
              <summary className="cartFoodOptionsSummary">Food order options</summary>
              <div className="cartFoodOptionsBody">
                <div className="cartFoodOptionsRow">
                  <label className="cartFoodOptionsLabel" htmlFor={`spice-${product.product}`}>
                    Spice level
                  </label>
                  <select
                    id={`spice-${product.product}`}
                    className="cartFoodOptionsSelect"
                    value={options?.spiceLevel || 'none'}
                    onChange={(e) => updateOptions({ spiceLevel: e.target.value })}
                  >
                    <option value="none">None</option>
                    <option value="mild">Mild</option>
                    <option value="medium">Medium</option>
                    <option value="hot">Hot</option>
                  </select>
                </div>

                <div className="cartFoodOptionsRow cartFoodOptionsRow--addons">
                  <span className="cartFoodOptionsLabel">Add-ons</span>
                  <div className="cartFoodOptionsAddons" role="list" aria-label="Food add-ons">
                    {DEFAULT_FOOD_ADDONS.map((addon) => {
                      const checked = (Array.isArray(options?.addons) ? options.addons : []).includes(addon.id);
                      return (
                        <label key={addon.id} className="cartFoodOptionsAddon">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleAddon(addon.id)}
                          />
                          <span>{addon.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="cartFoodOptionsRow">
                  <label className="cartFoodOptionsLabel" htmlFor={`allergy-${product.product}`}>
                    Allergy note
                  </label>
                  <input
                    id={`allergy-${product.product}`}
                    className="cartFoodOptionsInput"
                    type="text"
                    value={options?.allergyNote || ''}
                    placeholder="e.g., peanuts, dairy, gluten"
                    onChange={(e) => updateOptions({ allergyNote: e.target.value })}
                  />
                </div>

                <div className="cartFoodOptionsRow">
                  <label className="cartFoodOptionsLabel" htmlFor={`notes-${product.product}`}>
                    Instructions
                  </label>
                  <textarea
                    id={`notes-${product.product}`}
                    className="cartFoodOptionsTextarea"
                    rows={2}
                    value={options?.notes || ''}
                    placeholder="e.g., no onions, extra crispy"
                    onChange={(e) => updateOptions({ notes: e.target.value })}
                  />
                </div>

                <div className="cartFoodOptionsRow">
                  <label className="cartFoodOptionsLabel" htmlFor={`when-${product.product}`}>
                    When
                  </label>
                  <div className="cartFoodOptionsWhen">
                    <label className="cartFoodOptionsRadio">
                      <input
                        type="radio"
                        name={`when-${product.product}`}
                        checked={(options?.when || 'asap') === 'asap'}
                        onChange={() => updateOptions({ when: 'asap', time: '' })}
                      />
                      <span>ASAP</span>
                    </label>
                    <label className="cartFoodOptionsRadio">
                      <input
                        type="radio"
                        name={`when-${product.product}`}
                        checked={options?.when === 'later'}
                        onChange={() => updateOptions({ when: 'later' })}
                      />
                      <span>Later</span>
                    </label>
                    {options?.when === 'later' ? (
                      <input
                        className="cartFoodOptionsTime"
                        type="time"
                        value={options?.time || ''}
                        onChange={(e) => updateOptions({ time: e.target.value })}
                        aria-label="Desired time"
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </details>
          ) : null}
	      </div>

	      <div className="qtyoption">
	        <span className="qtylabel">Quantity</span>
	        <Select
          value={product.qty}
          onChange={(e) => qtyChangeHandler(e.target.value)}
        >
          {[...Array(product.countInStock).keys()].map((x) => (
            <option key={x + 1} value={x + 1}>
              {x + 1}
            </option>
          ))}
        </Select>
      </div>

      <div className="productactions">
        <strong className="producttotal">{formatCurrency(product.qty * product.price)}</strong>
        <button
          className="deletecart"
          type="button"
          onClick={() => removeFromCartHandler(product.product)}
        >
          <FiTrash2 />
          Remove
        </button>
      </div>
    </article>
  );
};

export default Productoncart;
