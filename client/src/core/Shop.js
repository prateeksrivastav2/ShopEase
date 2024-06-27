import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import Button from '@material-ui/core/Button';
import Card from './Card';
import { getCategories, getFilteredProducts } from './apiCore';
import Search from './Search';
import { prices } from './fixedPrices';
import Copyright from './Copyright';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Shop = () => {
  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] },
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);
  const [limit, setLimit] = useState(6);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');

  const styles = {
    heading: {
      color: '#7469B6',
      textShadow: '2px 2px 5px rgba(0,0,0,0.3)',
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    loadMoreButton: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      borderRadius: 3,
      border: 0,
      color: 'white',
      height: 48,
      padding: '0 20px',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <Button onClick={loadMore} variant="contained" style={styles.loadMoreButton}>
          Load more
        </Button>
      )
    );
  };

  const init = () => {
    getCategories().then((data) => {
      if (!data || data.error) {
        setError('Error fetching categories');
      } else {
        console.log('Categories:', data);
        setCategories(data);
      }
    });
  };

  const loadFilteredResults = (newFilters) => {
    getFilteredProducts(skip, limit, newFilters).then((data) => {
      if (!data || data.error) {
        setError('Error fetching filtered products');
      } else {
        console.log('Filtered Results:', data);
        setFilteredResults(data.data);
        setSize(data.size);
        setSkip(0);
      }
    });
  };

  const loadMore = () => {
    let toSkip = skip + limit;
    getFilteredProducts(toSkip, limit, myFilters.filters).then((data) => {
      if (!data || data.error) {
        setError('Error loading more products');
      } else {
        setFilteredResults([...filteredResults, ...data.data]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };

  useEffect(() => {
    init();
    loadFilteredResults(myFilters.filters);
  }, []);

  const handleFilters = (filters, filterBy) => {
    const newFilters = { ...myFilters };
    newFilters.filters[filterBy] = filters;

    if (filterBy === 'price') {
      let priceValues = handlePrice(filters);
      newFilters.filters[filterBy] = priceValues;
    }
    loadFilteredResults(newFilters.filters);
    setMyFilters(newFilters);
  };

  const handlePrice = (value) => {
    const data = prices;
    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value)) {
        array = data[key].array;
      }
    }
    return array;
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    handleFilters([category], 'category');
  };

  const handlePriceChange = (price) => {
    setSelectedPrice(price);
    handleFilters([price], 'price');
  };

  const renderDropdown = (label, items, selectedItem, handleChange) => (
    <div className="dropdown">
      <button className="btn btn-info dropdown-toggle text-white" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ width: 'fit-content', fontSize: '1.2rem' }}>
        {label}
      </button>
      <ul className="dropdown-menu my-2" style={{ boxShadow:  '2px 2px 5px rgba(0,0.1,0.2,0.3)', }}>
       { label==="Categories"&&<a className="dropdown-item" href="#" onClick={() => handleChange('')}>
          All {label}
        </a>}

        {items.map((item, i) => (
          <li key={i}>
            <a className="dropdown-item" href="#" onClick={() => handleChange(item._id)} style={{ fontSize: '1rem' }}>
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <Layout
      title="Purchase Here"
      description="Search and find Your best fit!"
      className="container-fluid"
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginRight: '4vw' }}>
        <h2 className="mb-2" style={{ ...styles.heading, fontSize: '2.5rem' }}>Products</h2>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Search />
      </div>
      <div className="row my-4" style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '9vw' }}>
        <div className="col-md-4">
          <p style={styles.heading}>Filter by categories</p>
          {renderDropdown('Categories', categories, selectedCategory, handleCategoryChange)}
        </div>
        <div className="col-md-4" style={{ marginLeft: '6vw' }}>
          <p style={styles.heading}>Filter by price range</p>
          {renderDropdown('Prices', prices, selectedPrice, handlePriceChange)}
        </div>
      </div>

      <div className="row" style={{ margin: '0px' }}>
        {filteredResults.map((product, i) => (
          <div key={i} className="col-xl-4 col-lg-3 col-md-3 col-sm-3">
            <Card product={product} />
          </div>
        ))}
      </div>
      <hr />
      {loadMoreButton()}
      <Copyright />
    </Layout>
  );
};

export default Shop;
