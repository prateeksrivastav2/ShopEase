import React from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const {
    user: { _id, name, email, role,role2 },
  } = isAuthenticated();
  // console.log(role2);
  const styles = {
    heading: {
      color: '#7469B6', 
      textShadow: '2px 2px 5px rgba(0,0,0,0.3)', 
      fontSize: '1.7rem', 
      fontWeight: 'bold', 
    },
   
  };
  const adminLinks = () => {
    return (
      <div className='card'>
        {role2==1&&<h4 className='card-header' style={styles.heading}>Admin Controls</h4>}
        {role2==0&&<h4 className='card-header'style={styles.heading}>Seller Controls</h4>}
        <ul className='list-group'>
         { role2==1&&<li className='list-group-item'>
            <Link className='nav-link' to='/admin/categories'style={{...styles.heading,color:'#3ABEF9',fontSize:'1.2rem'}}>
              Category List
            </Link>
          </li>}
         { role2==1&&<li className='list-group-item'>
            <Link className='nav-link' to='/create/category'style={{...styles.heading,color:'#3ABEF9',fontSize:'1.2rem'}}>
              Add Category
            </Link>
          </li>}
          <li className='list-group-item'>
            <Link className='nav-link' to='/create/product'style={{...styles.heading,color:'#3ABEF9',fontSize:'1.2rem'}}>
              Add Product
            </Link>
          </li>
          <li className='list-group-item'>
            <Link className='nav-link' to='/admin/orders'style={{...styles.heading,color:'#3ABEF9',fontSize:'1.2rem'}}>
              View Orders
            </Link>
          </li>
          <li className='list-group-item'>
            <Link className='nav-link' to='/admin/products'style={{...styles.heading,color:'#3ABEF9',fontSize:'1.2rem'}}>
              Manage Products
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const adminInfo = () => {
    return (
      <div className='card mb-5'>
        <h3 className='card-header' style={{...styles.heading,fontSize:'2rem'}}>User information</h3>
        <ul className='list-group'>
          <li className='list-group-item'style={{...styles.heading,color:'#B1AFFF',fontSize:'1.3rem'}}>{name}</li>
          <li className='list-group-item'style={{...styles.heading,color:'#B1AFFF',fontSize:'1.3rem'}}>{email}</li>
          <li className='list-group-item'style={{...styles.heading,color:'#B1AFFF',fontSize:'1.3rem'}}>
            {role === 1 && role2==1&& 'Admin'}
            {role === 1 && role2==0&& 'Seller'}
            {role === 0 && role2==0&& 'Registered-User'}
          </li>
        </ul>
      </div>
    );
  };

  return (
    <Layout
      title='Dashboard'
      description={`${name}`}
      className='container-fluid'
    >
      <div className='row'>
        <div className='col-md-3'>{adminLinks()}</div>
        <div className='col-md-9'>{adminInfo()}</div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
