import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { getPurchaseHistory } from './apiUser';
import moment from 'moment';
import './UserDashboard.css';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const navigate = useHistory();
  // const Color1 = "E2BBE9";
  const {
    user: { _id, name, email, role },
  } = isAuthenticated();

  const token = isAuthenticated().token;

  const handleorder = (id) => {
    navigate.push(`/product/${id}`);
  };
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
  const init = (userId, token) => {
    getPurchaseHistory(userId, token).then((data) => {
      if (data.error) {
        // console.log(data.error);
      } else {
        setHistory(data);
        // console.log(data);
      }
    });
  };

  useEffect(() => {
    init(_id, token);
  }, []);

  const userLinks = () => {
    return (
      <div className="card">
        <h4 className="card-header" style={{...styles.heading}}>User links</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <Link className="nav-link" to="/cart" style={{...styles.heading,color:'#3ABEF9',fontSize:'1.2rem'}}>
              My Cart
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to={`/profile/${_id}`} style={{...styles.heading,color:'#3ABEF9',fontSize:'1.2rem'}}>
              Update Profile
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const userInfo = () => {
    return (
      <div className="card mb-5">
        <h3 className="card-header" style={{...styles.heading}}>User information</h3>
        <ul className="list-group">
          <li className="list-group-item" style={{...styles.heading,color:'#B1AFFF',fontSize:'1.2rem'}}>{name}</li>
          <li className="list-group-item" style={{...styles.heading,color:'#B1AFFF',fontSize:'1.2rem'}}>{email}</li>
          <li className="list-group-item" style={{...styles.heading,color:'#B1AFFF',fontSize:'1.2rem'}}>
            {role === 1 ? 'Admin' : 'Registered user'}
          </li>
        </ul>
      </div>
    );
  };

  const purchaseHistory = (history) => {
    // Reverse the history array
    const reversedHistory = [...history].reverse();
  
    return (
      <div className="card mb-5">
        <h3 className="card-header" style={{...styles.heading}}>My Orders</h3>
        <ul className="list-group">
          {reversedHistory.map((h, i) => (
            <li key={i} className="list-group-item purchase-history-item">
              <div className="order-container" style={{ position: 'relative' }}>
                <div
                  className="text-white"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: '#FF6969',
                    borderRadius: '5px',
                    padding: '5px 10px',
                  }}
                >
                  Order {i + 1}
                </div>
                {h.products.map((p, index) => (
                  <React.Fragment key={index}>
                    <h3
                      className="product-name my-3 mx-5"
                      style={{
                        fontStyle: 'italic',
                        fontFamily: 'cursive',
                        color: '#30c1d7',
                        margin: '10px 0 0 0',
                        fontSize: '2.1rem',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        handleorder(p._id);
                      }}
                    >
                      {p.name}
                    </h3>
                    <div className="product-container">
                      <div style={{ display: 'block' }}>
                        <div
                          className="product-details-container"
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            textAlign: 'center',
                            fontSize: '2rem',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              padding: '0 10px',
                            }}
                          >
                            <h6
                              className="btn text-white"
                              style={{
                                margin: '0 10px',
                                borderRadius: '5px',
                                backgroundColor: '#AD88C6',
                              }}
                            >
                              Status: {h.status}
                            </h6>
                            {h.transaction_id === "dummy_transaction_id" && (
                              <h6
                                className="btn text-white"
                                style={{
                                  margin: '0 10px',
                                  borderRadius: '5px',
                                  backgroundColor: '#E2BBE9',
                                }}
                              >
                                Payment Mode: Cash
                              </h6>
                            )}
                            {h.transaction_id !== "dummy_transaction_id" && (
                              <h6
                                className="btn text-white"
                                style={{
                                  margin: '0 10px',
                                  borderRadius: '5px',
                                  backgroundColor: '#E2BBE9',
                                }}
                              >
                                Payment Mode: Online
                              </h6>
                            )}
                            <h6
                              className="btn btn-primary text-white"
                              style={{
                                margin: '0 10px',
                                borderRadius: '5px',
                                backgroundColor: '#B1AFFF',
                              }}
                            >
                              Product price: ${p.price}
                            </h6>
                            <h6
                              className="btn btn-primary"
                              style={{
                                fontStyle: 'italic',
                                margin: '0 10px',
                                borderRadius: '5px',
                                backgroundColor: '#9B86BD',
                              }}
                            >
                              Purchased date: {moment(h.createdAt).fromNow()}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  

  return (
    <Layout
      title="Dashboard"
      description={`${name}`}
      className="container-fluid"
    >
      <div className="row">
        <div className="col-md-3">{userLinks()}</div>
        <div className="col-md-9">
          {userInfo()}
          {purchaseHistory(history)}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
