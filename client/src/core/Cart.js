import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import { getCart } from './cartHelpers';
import Card from './Card';
import Checkout from './Checkout';

import Copyright from './Copyright';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [run, setRun] = useState(false);

  useEffect(() => {
    setItems(getCart());
  }, [run]);
  const styles = {
    heading: {
      color: '#7469B6', 
      textShadow: '2px 2px 5px rgba(0,0,0,0.3)', 
      fontSize: '1.7rem', 
      fontWeight: 'bold', 
    },
    // cardContainer: {
    //   boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', // Shadow for the card
    //   transition: '0.3s',
    //   '&:hover': {
    //     boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', // Hover effect
    //   },
    //   borderRadius: '10px', // Optional: make corners rounded
    //   padding: '20px', // Optional: add padding inside the card
    // }
  };
  const showItems = (items) => {
    return (
      <div>
        <h2 style={styles.heading}>Your cart has {`${items.length}`} items</h2>
        <hr />
        {items.map((product, i) => (
          <Card
            key={i}
            product={product}
            showAddToCartButton={false}
            cartUpdate={true}
            showRemoveProductButton={true}
            setRun={setRun}
            run={run}
          />
        ))}
      </div>
    );
  };


  const noItemsMessage = () => (
    <h2  style={styles.heading}>
      Your cart is empty. <br /> <Link to='/shop'>Continue shopping</Link>
    </h2>
  );

  return (
    <Layout
      title='Shopping Cart'
      description='Manage your cart items. Add remove checkout or continue shopping.'
      className='container-fluid'
    >
      <div className='row'>
        <div className='col-md-2'></div>
        <div className='col-md-4'>
          {items.length > 0 ? showItems(items) : noItemsMessage()}
        </div>
        <div className='col-md-4'>
          <h2 className='mb-4' style={styles.heading}>Your cart summary</h2>
          <hr />
          <Checkout products={items} setRun={setRun} run={run} />
        </div>
        <div className='col-md-2'></div>
      </div>
      <Copyright />
    </Layout>
  );
};

export default Cart;
