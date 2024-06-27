import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import DropIn from 'braintree-web-drop-in-react';
import { getBraintreeClientToken, processPayment, createOrder } from './apiCore';
import { emptyCart } from './cartHelpers';
import './Checkout.css';
import { loadStripe } from '@stripe/stripe-js';

const Checkout = ({ products, setRun = (f) => f, run = undefined }) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: '',
    instance: {},
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
    },
  });
  const [Opt,setOpt]=useState(0);
  const [saveAddress, setsaveAddress] = useState({
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
    }
  });

  const [Address, setAddress] = useState([]);
  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getBraintreeClientToken(userId, token).then((data) => {
      if (data.error) {
        setData((prevState) => ({ ...prevState, error: data.error }));
      } else {
        setData((prevState) => ({ ...prevState, clientToken: data.clientToken }));
      }
    });
  };
  

  useEffect(() => {
    if (userId && token) {
      getToken(userId, token);
      fetchAddressdata();  // fetch address data when component mounts
    }
  }, [userId, token]);
  




  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    setData((prevState) => ({
      ...prevState,
      address: { ...prevState.address, [field]: value },
    }));
  };


  const handleAddress = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/address/create/${userId}`, {
        street: data.address.street,
        city: data.address.city,
        postalCode: data.address.postalCode,
        state: data.address.state,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data) {
        console.log("Address Added successfully:", response.data);
        setData({
          address: {
            street: "",
            city: "",
            postalCode: "",
            state: "",
          }
        });
        fetchAddressdata();  // fetch updated address data after adding new address
      }
    } catch (error) {
      console.error("Error creating address:", error);
      setData((prevState) => ({ ...prevState, error: 'Could not update address' }));
    }
  };
  const styles = {
    heading: {
      color: '#7469B6', 
      textShadow: '2px 2px 5px rgba(0,0,0,0.3)', 
      fontSize: '1.7rem', 
      fontWeight: 'bold', 
    },
    
  };

  const  getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <Link to='/signin'>
        <Button variant='contained' color='primary'>
          Sign in to checkout
        </Button>
      </Link>
    );
  };



  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const fetchAddress = () => {
    let addressElements = [];
  
   
    const handleAddressClick = (index) => {
      console.log(`Address ${index + 1} clicked`);
      console.log(Address[index]);
  
      // Toggle the selected address index
      if (selectedAddressIndex === index) {
        setSelectedAddressIndex(null); // Deselect if already selected
      } else {
        setSelectedAddressIndex(index); // Select the clicked address
      }
  
      setsaveAddress({
        address: {
          street: Address[index].street,
          city: Address[index].city,
          postalCode: Address[index].postalCode,
          state: Address[index].state,
        }
      });
    };
  
    const handleAddressDeleteClick = async (index) => {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/address/delete/${userId}`,
          { index },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.data) {
          console.log("Address deleted successfully:", response.data);
          fetchAddressdata();
          setData({
            address: {
              street: "",
              city: "",
              postalCode: "",
              state: "",
            }
          });
        }
      } catch (error) {
        console.error("Error deleting address:", error);
        // Handle error appropriately
      }
    };
  
    // Iterate over each address in the Address array
    for (let index = 0; index < Address.length; index++) {
      const address = Address[index];
      if (address && Object.keys(address).length !== 0) {
        addressElements.push(
          <div key={index} className="address-container">
            <div onClick={() => handleAddressClick(index)} style={{ cursor: 'pointer' }}>
              <h2 style={{ fontSize: "1.25rem" }}>Address {index + 1}</h2>
              <div className="address-card">
                <div className="address-row">
                  <p><strong>Street:</strong> {address.street}</p>
                  <p><strong>City:</strong> {address.city}</p>
                </div>
                <div className="address-row">
                  <p><strong>State:</strong> {address.state}</p>
                  <p><strong>Postal Code:</strong> {address.postalCode}</p>
                </div>
              </div>
            </div>
            <div className="address-row">
              <button
                className={`btn ${selectedAddressIndex === index ? 'btn-success' : 'btn-secondary'}`}
                style={{ borderRadius: '6px' }}
                onClick={() => handleAddressClick(index)}
              >
                {selectedAddressIndex === index ? 'Selected' : 'Select'}
              </button>
              {(
                <div className='btn btn-danger' style={{ borderRadius: '6px' }} onClick={() => handleAddressDeleteClick(index)}>Delete</div>
              )}
            </div>
          </div>
        );
      }
    }
  
    // Return the array of JSX elements
    return (
      <div>
        {addressElements}
      </div>
    );
  };





  const fetchAddressdata = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/getaddress/${userId}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const addressData = response.data;
        // Transform the fetched data into an array of addresses
        const addressesArray = Object.values(addressData);
        setAddress(addressesArray);
        console.log('Fetched addresses:', addressesArray); // Debugging line
      } else {
        console.error('Failed to fetch address details');
        // setError('Failed to fetch address details');
      }
    } catch (error) {
      console.error('Error fetching address details:', error);
      // setError('Error fetching address details');
    }
  };

  const Showbuyoptions=()=>{
    setOpt(1);
  }

  const buy = () => {
    // Create order data
    const createOrderData = {
      products: products,
      transaction_id: "dummy_transaction_id", 
      amount: getTotal(products), 
      address: saveAddress.address, 
    };
  
    // Call createOrder function
    createOrder(userId, token, createOrderData)
      .then((response) => {
        // Empty the cart after successful order creation
        emptyCart(() => {
          setRun(!run); // Toggle run state
          setData({ ...data, loading: false, success: true }); // Update state
        });
      })
      .catch((error) => {
        setData({ ...data, loading: false, error: error.message }); // Handle error
      });
  };


  const onlinebuy = async () => {
    console.log("Initiating Stripe checkout");
    
    const stripe = await loadStripe("pk_test_51P8TDCSDhYcpKPnMYaWVSHGofzSO3Xx2QQYrY3chzzcof9wNpSY1EWgJlMMWY7pXzp5ho3YZylwTeWU7SMDk9Ooj00c8AJpqFJ");
  
    const body = {
      start: "selectedSource",
      end: "selectedDestination",
      price: getTotal(products),
    };
  
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  
    try {
      const response = await fetch(
        `http://localhost:5000/api/order/create-checkout-session/${userId}`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const session = await response.json();
      console.log(session.id);
      console.log("session.id");
      const createOrderData = {
        products: products,
        transaction_id: session.id, 
        amount: getTotal(products),
        address: saveAddress.address,
      };
      localStorage.setItem('createOrderData', JSON.stringify(createOrderData));
      // console.log("Session:", session);
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      
  
      if (result.error) {
        console.error(result.error.message);
      } 
    } catch (error) {
      console.error('Error during Stripe checkout:', error.message);
    }
  };
  
  

  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: '' })}>
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <div className='gorm-group mb-3 my-3' style={{ fontSize: '1.5rem' }}>
            <div className='address-form'>
              <label className='my-2'>Add Delivery address:</label>

              <div className='form-row' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div className='form-group' style={{ flex: '1', marginRight: '1rem' }}>
                  <label className='my-2' style={{ display: 'block', fontSize: '1.25rem' }} >Street</label>
                  <input
                    type='text'
                    value={data.address.street}
                    onChange={handleInputChange('street')}
                    style={{ width: '100%', fontSize: '1.25rem' }}
                    placeholder='Eg. Home Address'
                  />
                </div>
                <div className='form-group' style={{ flex: '1' }}>
                  <label className='my-2' style={{ display: 'block', fontSize: '1.25rem' }}>City</label>
                  <input
                    type='text'
                    value={data.address.city}
                    onChange={handleInputChange('city')}
                    style={{ width: '100%', fontSize: '1.25rem' }}
                    placeholder='Eg. Kanpur'
                  />
                </div>
              </div>

              <div className='form-row' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div className='form-group' style={{ flex: '1', marginRight: '1rem' }}>
                  <label className='my-2' style={{ display: 'block', fontSize: '1.25rem' }}>State</label>
                  <input
                    type='text'
                    value={data.address.state}
                    onChange={handleInputChange('state')}
                    style={{ width: '100%', fontSize: '1.25rem' }}
                    placeholder='Eg. Uttar Pradesh'
                  />
                </div>
                <div className='form-group' style={{ flex: '1' }}>
                  <label className='my-2' style={{ display: 'block', fontSize: '1.25rem' }}>Postal Code</label>
                  <input
                    type='text'
                    value={data.address.postalCode}
                    onChange={handleInputChange('postalCode')}
                    style={{ width: '100%', fontSize: '1.25rem' }}
                    placeholder='Eg. 208011'
                  />
                </div>
              </div>
            </div>
            <div className='btn btn-primary' style={{ borderRadius: '5px' }} onClick={handleAddress}>
              Add Address
            </div>
          </div>

          {fetchAddress()}

          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: {
                flow: 'vault',
              },
            }}
            onInstance={(instance) => setData((prevState) => ({ ...prevState, instance }))}
          />
          <button onClick={Showbuyoptions} className='btn btn-success btn-block' style={{borderRadius:'7px'}}>
            Pay
          </button>
          <div style={{display:"flex",justifyContent:'center'}}>
          {Opt===1&&<button onClick={onlinebuy} className='btn btn-success btn-flex my-3 mr-3' style={{width:'17vw',borderRadius:'7px'}}>
            Online
          </button>}
          {Opt===1&&<button onClick={buy} className='btn btn-success btn-flex my-3 ' style={{width:'17vw',borderRadius:'7px'}}>
            Cash
          </button>}
          </div>
        </div>
      ) : null}
    </div>
  );

  const showError = (error) => (
    <div className='alert alert-danger' style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  );

  const showSuccess = (success) => (
    <div class='alert alert-info' style={{ display: success ? '' : 'none' }}>
      Thanks! Your payment was successful!
    </div>
  );

  const showLoading = (loading) =>
    loading && <h2 className='text-danger'>Loading...</h2>;

  return (
    <div>
      <h2 style={styles.heading}>Total: ${getTotal()}</h2>
      {showLoading(data.loading)}
      {showSuccess(data.success)}
      {showError(data.error)}
      {showCheckout()}
    </div>
  );
};

export default Checkout;