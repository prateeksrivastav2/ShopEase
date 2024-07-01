import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { listOrders, getStatusValues, updateOrderStatus, getProducts } from './apiAdmin';
import moment from 'moment';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [orders2, setOrders2] = useState([]);
  const [statusValues, setStatusValues] = useState([]);
  const { user, token } = isAuthenticated();
  const [Products, setProducts] = React.useState([]);

  const loadProducts = () => {
    getProducts().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setProducts(data);
      }
    });
  };
  const loadOrders = () => {
    listOrders(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrders2(data);
      }
    });
  };

  const loadStatusValues = () => {
    getStatusValues(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setStatusValues(data);
      }
    });
  };

  useEffect(() => {
    loadOrders();
    loadStatusValues();
    loadProducts();

  }, []);
  useEffect(() => {
    if (orders2.length > 0 && Products.length > 0) {
      const updatedOrders = orders2.reduce((acc, order) => {
        const id = order.products[0]._id;
        const product = Products.find(product => product._id === id);
        if (product && product.Userid === user._id) {
          acc.push(order);
          // console.log(order);
        }
        return acc;
      }, []);

      setOrders(updatedOrders);
    }
  }, [Products]);

  const showOrdersLength = () => {
    if (Array.isArray(orders) && orders.length > 0) {
      // console.log(orders);
      // console.log("orders")
      return (
        <h1 className='text-danger display-2'>Total orders: {orders.length}</h1>
      );
    } else {
      return <h1 className='text-danger'>No orders</h1>;
    }
  };

  const showInput = (key, value) => (
    <div className='input-group mb-2 mr-sm-2'>
      <div className='input-group-prepend'>
        <div className='input-group-text'>{key}</div>
      </div>
      <input type='text' value={value} className='form-control' readOnly />
    </div>
  );

  const handleStatusChange = (e, orderId) => {
    updateOrderStatus(user._id, token, orderId, e.target.value).then((data) => {
      if (data.error) {
        console.log('Status update failed');
      } else {
        loadOrders();
      }
    });
  };

  const showStatus = (o) => (
    <div className='form-group'>
      <h3 className='mark mb-4'>Status: {o.status}</h3>
      <select
        className='form-control'
        onChange={(e) => handleStatusChange(e, o._id)}
      >
        <option>Update Status</option>
        {statusValues.map((status, index) => (
          <option key={index} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <Layout
      title='Orders'
      description={`Hey ${user.name}, you can manage all the ordes here`}
    >
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          {showOrdersLength()}

          {orders && Array.isArray(orders) && orders.map((o, oIndex) => {
            return (
              <div
                className='mt-5'
                key={oIndex}
                style={{ borderBottom: '5px solid indigo' }}
              >
                <h2 className='mb-5'>
                  <span className='bg-primary'>Order ID: {o._id}</span>
                </h2>

                <ul className='list-group mb-2'>
                  <li className='list-group-item'>{showStatus(o)}</li>
                  <li className='list-group-item'>
                    Transaction ID: {o.transaction_id}
                  </li>
                  <li className='list-group-item'>Amount: ${o.amount}</li>
                  <li className='list-group-item'>Ordered by: {o.userId}</li>
                  <li className='list-group-item'>
                    Ordered on: {moment(o.createdAt).fromNow()}
                  </li>
                  <li className="list-group-item">
                    Delivery address:  {o.addresses[0].street}, {o.addresses[0].city}, {o.addresses[0].postalCode} {o.addresses[0].state}
                  </li>

                </ul>

                <h3 className='mt-4 mb-4 font-italic'>
                  Total products in the order: {o.products.length}
                </h3>

                {o.products.map((p, pIndex) => (
                  <div
                    className='mb-4'
                    key={pIndex}
                    style={{ padding: '20px', border: '1px solid indigo' }}
                  >
                    {showInput('Product name', p.name)}
                    {showInput('Product price', p.price)}
                    {showInput('Product total', p.count)}
                    {showInput('Product Id', p._id)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
