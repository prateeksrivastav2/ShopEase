import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { createOrder } from './apiCore';
import { emptyCart } from './cartHelpers'; // Ensure this helper function is imported correctly

const Success = () => {
  const [run, setRun] = useState(false); // Assuming you need a run state
  const [data, setData] = useState({ loading: false, success: false, error: '' });
  const history = useHistory();
  
  const createingorder = () => {
    const token = isAuthenticated().token;
    const userId = isAuthenticated() && isAuthenticated().user._id;
    const createOrderData = JSON.parse(localStorage.getItem('createOrderData')); // Parse the JSON string
    
    createOrder(userId, token, createOrderData)
      .then((response) => {
        console.log("Order created successfully:", response);
        emptyCart(() => {
          setRun(!run);
          setData({ ...data, loading: false, success: true });
        });
      })
      .catch((error) => {
        console.error('Error creating order:', error.message);
        setData({ ...data, loading: false, error: error.message });
      });
      
    localStorage.removeItem('createOrderData'); // Use the correct key to remove
    history.push('/user/dashboard');
  };

  useEffect(() => {
    if (localStorage.getItem('createOrderData')) {
      createingorder();
    } else {
      history.push('/user/dashboard');
    }
  }, []);

  return (
    <div>Success</div>
  );
};

export default Success;
