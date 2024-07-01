import React from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { getCategories } from './apiAdmin';

const CategoryList = () => {
  const { user } = isAuthenticated();

  const [categories, setCategories] = React.useState([]);
  const styles = {
    heading: {
      color: '#7469B6',
      textShadow: '2px 2px 5px rgba(0,0,0,0.3)',
      fontSize: '1.7rem',
      fontWeight: 'bold',
    },
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

  };
  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  React.useEffect(() => {
    loadCategories();
  }, []);

  return (
    <Layout
      title='Category List'
      description={`Hey ${user.name} ready to manage categories?`}
    >
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          <h2 className='text-center' style={styles.heading}>Total {categories.length} categories</h2>
          <hr />
          <ul className='list-group' >
            {categories.length > 0 ? (
              categories.map((c, i) => (
                <li key={i} className='list-group-item'style={{...styles.productItem,...styles.heading,fontSize:'1.2rem',color:'#3ABEF9'}}>
                  {c.name}
                </li>
              ))
            ) : (
              <h4 className='text-center'>No categories found</h4>
            )}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryList;
