import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { read, listRelated } from './apiCore';
import Card from './Card';
import ShowImage from './ShowImage';
import { addItem, updateItem, removeItem } from './cartHelpers';
import Button from '@material-ui/core/Button';
import { isAuthenticated } from '../auth';
const Product = (props) => {
  const [product, setProduct] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [error, setError] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const showAddToCartBtn = (showAddToCartButton) => {

    const {
      user: { role, role2 },
    } = isAuthenticated();


    return (
      showAddToCartButton &&role===0&&role2===0&& (
        <div style={{ justifyContent: 'center', textAlign: 'center' }}>
          <Button onClick={addToCart} variant='outlined' color='secondary' style={{ width: '20vw' }}>
            Add to cart
          </Button>
        </div>
      )
    );
  };
  const addToCart = () => {
    // console.log('added');
    addItem(product, setRedirect(true));
  };
  const loadSingleProduct = (productId) => {
    read(productId).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProduct(data);
        // console.log(data);
        // fetch related products
        listRelated(data._id).then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setRelatedProduct(data);
          }
        });
      }
    });
  };
  const styles = {
    heading: {
      color: '#7469B6',
      textShadow: '2px 2px 5px rgba(0,0,0,0.3)',
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    cardContainer: {

      boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', // Shadow for the card
      transition: '0.3s',
      '&:hover': {
        boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
      },
      borderRadius: '10px',
      padding: '20px',
      width: '60vw'
    }
  };
  const StyledCard = ({ product }) => {
    return (
      <div className="card mb-3" style={{ ...styles.cardContainer }}>
        <div className="card-body">
          <h5
            className="card-title"
            style={{
              ...styles.heading,
              justifyContent: 'center',
              textAlign: 'center',
              color: '#3572EF'
            }}
          >
            {product.name}
          </h5>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ShowImage
            className="my-2"
            item={product}
            url='product'
            style={{ borderRadius: '5px' }}
          />
        </div>
        <p
          className="card-text my-2"
          style={{
            ...styles.heading,
            fontSize: '1.3rem',
            color: '#3ABEF9'
          }}
        >
          <strong style={{ color: '#3572EF' }}>About: </strong>{product.description}
        </p>
        <p
          className="card-text"
          style={{
            ...styles.heading,
            fontSize: '1.3rem',
            color: '#3ABEF9'
          }}
        >
          <strong style={{ color: '#3572EF' }}>Price:</strong> ${product.price}
        </p>
        <p
          className="card-text"
          style={{
            ...styles.heading,
            fontSize: '1.3rem',
            color: '#3ABEF9'
          }}
        >
          <strong style={{ color: '#3572EF' }}>Category:</strong> {product.category.name}
        </p>
        <p
          className="card-text"
          style={{
            ...styles.heading,
            fontSize: '1.3rem',
            color: '#3ABEF9'
          }}
        >
          <strong style={{ color: '#3572EF' }}>Added on:</strong> {new Date(product.createdAt).toDateString()}
        </p>
        <p
          className="card-text"
          style={{
            ...styles.heading,
            fontSize: '1.3rem',
            color: '#3ABEF9'
          }}
        >
          <strong style={{ color: '#3572EF' }}>
            {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
          </strong>
        </p>
        {showAddToCartBtn(true)}
      </div>
    );
  };

  useEffect(() => {
    const productId = props.match.params.productId;
    loadSingleProduct(productId);
  }, [props]);

  return (
    <>
      <Layout
        title={product && product.name}
        description={
          product && product.description && product.description.substring(0, 100)
        }
        className='container-fluid'
      >
        {/* <div className='row'> */}
        {/* <div className='col-md-2'></div> */}
        <div className='mb-2' style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
          <h4 style={{ ...styles.heading, fontSize: '2.5rem' }}>Product Details</h4>
          {/* {product && product.description && (
              <Card product={product} showViewProductButton={false} />
            )} */}
        </div>

        {/* </div> */}
        <div className='mb-2' style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>

          {product && product.description && (
            <StyledCard product={product} showViewProductButton={false} />
          )}
        </div>
        <div className='mb-2' style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
          <h4 style={{ ...styles.heading, fontSize: '2.5rem' }}>Related products</h4>
        </div>
        {relatedProduct.map((p, i) => (
          <div className='mb-3' key={i}>
            <Card product={p} />
          </div>
        ))}
      </Layout>
    </>
  );
};

export default Product;
