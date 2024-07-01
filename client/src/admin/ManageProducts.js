import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from './apiAdmin';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  productItem: {
    height: '80px', // Increase height
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 4px rgba(0, 0.1, 0.1, 0.2)',
    marginBottom:'4px',
    transition: 'box-shadow 0.3s ease-in-out', // Smooth transition for hover effect
    '&:hover': {
      boxShadow: '0 8px 8px rgba(0, 0.3, 0.3, 0.3)', // Add shadow on hover
    },
  },
  productName: {
    fontWeight: 'bold',
  },
  actionBadge: {
    cursor: 'pointer',
    '&:not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
}));
const styles = {
  heading: {
    color: '#7469B6', 
    textShadow: '2px 2px 5px rgba(0,0,0,0.3)', 
    fontSize: '1.7rem', 
    fontWeight: 'bold', 
  },
 
};
const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  // const [Yourproducts, setYourProducts] = useState([]);

  const classes = useStyles();

  const { user, token } = isAuthenticated();

  const loadProducts = () => {
    getProducts().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        const id=user._id;
        // console.log(data);
        const filteredProducts = data.filter(product => product.Userid === id);
        setProducts(filteredProducts);
      }
    });
  };

  const destroy = (productId) => {
    deleteProduct(productId, user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        loadProducts();
      }
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Layout
      title='Manage Products'
      description='Keep Your Products Updated'
      className='container-fluid'
    >
      <div className='row'>
        <div className='col-12'>
          <h2 className='text-center' style={styles.heading}>Total {products.length} products</h2>
          <hr />
          <ul className='list-group'>
            {products.map((p, i) => (
              <li
                key={i}
                className={`list-group-item ${classes.productItem}`}
              >
                <span className={classes.productName}style={{...styles.heading,color:'#3ABEF9',fontSize:'1.2rem'}}>{p.name}</span>
                <div>
                  <Link to={`/admin/product/update/${p._id}`}>
                    <span className={`badge badge-warning mx-2${classes.actionBadge}`}style={{fontSize:'1.125rem'}}>Update</span>
                  </Link>
                  <span
                    onClick={() => destroy(p._id)}
                    className={`badge badge-danger mx-4 ${classes.actionBadge}`}
                    style={{fontSize:'1.125rem'}}
                  >
                    Delete
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default ManageProducts;
