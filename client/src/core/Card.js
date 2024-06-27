import React, { useLayoutEffect, useState,useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import ShowImage from './ShowImage';
import moment from 'moment';
import { isAuthenticated } from '../auth';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import CardM from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

import { addItem, updateItem, removeItem } from './cartHelpers';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  card: {
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 8px rgba(0, 0.1, 0.1, 0.2)', // Add shadow
    borderRadius: '15px', // Increase border radius
    width: '27vw', // Increase width
     // Set a maximum width for the card
    margin: 0, // Center the card horizontally
    transition: 'box-shadow 0.3s ease-in-out', // Add transition for smooth hover effect
    '&:hover': {
      boxShadow: '0 16px 16px rgba(0, 0.3, 0.3, 0.3)', // Increase shadow on hover
    },
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  productDescription: {
    height: '20vw',
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const Card = ({
  product,
  showViewProductButton = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  setRun = (f) => f, // default value of function
  run = undefined, // default value of undefined
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

  const showViewButton = (showViewProductButton) => {
    return (
      showViewProductButton && (
        <Link href={`/product/${product._id}`} className='mr-2'>
          <Button variant='contained' color='primary'>
            View Product
          </Button>
        </Link>
      )
    );
  };

  const [role, setRole] = useState(2);
  const [role2, setRole2] = useState(2);

  useEffect(() => {
    const auth = isAuthenticated();
    // console.log('Authentication:', auth); // Check what isAuthenticated() returns
    if (auth) {
      const { role, role2 } = auth;
      // console.log('Role:', role, 'Role2:', role2); // Check role and role2 values
      setRole(role);
      setRole2(role2);
    }
  }, []);
  
  const addToCart = () => {
    addItem(product, setRedirect(true));
  };

  const shouldRedirect = (redirect) => {
    if (redirect) {
      return <Redirect to='/cart' />;
    }
  };

  const showAddToCartBtn = (showAddToCartButton) => {
    return (
      showAddToCartButton &&role===0&&role2===0 &&(
        <Button onClick={addToCart} variant='outlined' color='secondary'>
          Add to cart
        </Button>
      )
    );
  };

  const showStock = (quantity) => {
    return quantity > 0 ? (
      <span className='badge badge-primary badge-pill'>In Stock </span>
    ) : (
      <span className='badge badge-primary badge-pill'>Out of Stock </span>
    );
  };

  const handleChange = (productId) => (event) => {
    setRun(!run); // run useEffect in parent Cart
    setCount(event.target.value < 1 ? 1 : event.target.value);
    if (event.target.value >= 1) {
      updateItem(productId, event.target.value);
    }
  };

  const showCartUpdateOptions = (cartUpdate) => {

    return (
      cartUpdate && (
        <div className='mt-2'>
          <div className='input-group mb-3'>
            <div className='input-group-prepend'>
              <span className='input-group-text'>Adjust Quantity</span>
            </div>
            <input
              type='number'
              className='form-control'
              value={count}
              onChange={handleChange(product._id)}
            />
          </div>
        </div>
      )
    );
  };

  const showRemoveButton = (showRemoveProductButton) => {
    return (
      showRemoveProductButton && (
        <Button
          onClick={() => {
            removeItem(product._id);
            setRun(!run); // run useEffect in parent Cart
          }}
          variant='contained'
          color='secondary'
          className={classes.button}
          startIcon={<DeleteIcon />}
        >
          Remove Product
        </Button>
      )
    );
  };

  const classes = useStyles();
  const styles = {
    heading: {
      color: '#7469B6', 
      textShadow: '2px 2px 5px rgba(0,0,0,0.3)', 
      fontSize: '1.7rem', 
      fontWeight: 'bold', 
    },
    
  };


  return (
    <Container className={classes.cardGrid} maxWidth='md'>
      <CssBaseline />
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={12} md={12}>
        <CardM className={`${classes.card} mx-5`}>
            {shouldRedirect(redirect)}
            <div style={{display:'block',marginBottom:'0'}}>
            <ShowImage item={product} url='product' />
            </div>
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant='h5' component='h2' style={{...styles.heading,marginTop:'0px',marginBottom:'2px',padding:'0'}}>
                {product.name}
              </Typography>
              <p style={{marginTop:'0px'}}>{product.description.substring(0, 100)}</p>
              <p className='black-10'>Price: ${product.price}</p>
              <p className='black-9'>
                Category: {product.category && product.category.name}{' '}
              </p>{' '}
              <p className='black-8'>
                Added on {moment(product.createdAt).fromNow()}{' '}
              </p>
              <div className='my-2'>
                {showStock(product.quantity)}
              </div>
              <span className='my-1'> 
                {showViewButton(showViewProductButton)}
                {showAddToCartBtn(showAddToCartButton)}
                {showRemoveButton(showRemoveProductButton)}
              </span>
              {showCartUpdateOptions(cartUpdate)}
            </CardContent>
          </CardM>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Card;
