import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getProducts } from './apiCore';
import Card from './Card';
import Search from './Search';
import 'fontsource-roboto';
import Copyright from './Copyright';

const Home = () => {
  const [productsBySell, setProductsBySell] = useState([]);
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [error, setError] = useState([]);
  const styles = {
    heading: {
      color: '#7469B6',
      textShadow: '2px 2px 5px rgba(0,0,0,0.3)',
      fontSize: '1.5rem',
      fontWeight: 'bold',
    }
  };
  const loadProductsBySell = () => {
    getProducts('sold').then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductsBySell(data);
      }
    });
  };

  const loadProductsByArrival = () => {
    getProducts('createdAt').then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductsByArrival(data);
      }
    });
  };

  useEffect(() => {
    loadProductsByArrival();
    loadProductsBySell();
  }, []);

  return (
    <Layout
      title='ShopEase-Your Ultimate E-commerce Solution'
      description='Explore a wide range of products, enjoy secure transactions, and elevate your online shopping journey with ShopEase.'
      className='container-fluid'
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Search />
      </div>
      <div className='row'>
        <div className='col-md-1'></div>
        <div className='col-md-10'>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {/* <Search /> */}
            <h2 className='mb-2' style={{ ...styles.heading, fontSize: '1.8rem' }}>New Arrivals</h2>
          </div>
        </div>
      </div>
      <div className="row" style={{ margin: '0px' ,marginRight:'4vw'}}>
        {productsByArrival.map((product, i) => (
          <div key={i} className="col-xl-4 col-lg-3 col-md-3 col-sm-3">
            <Card product={product} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {/* <Search /> */}
        <h2 className='mb-2 mt-4' style={{ ...styles.heading, fontSize: '1.8rem' }}>Best Sellers</h2>
      </div>
      <div className='row'>
        {productsBySell.map((product, i) => (
          <div key={i} className='col-xl-4 col-lg-6 col-md-6 col-sm-12'>
            <Card product={product} />
          </div>
        ))}
      </div>
      <Copyright />
    </Layout>
  );
};

export default Home;
