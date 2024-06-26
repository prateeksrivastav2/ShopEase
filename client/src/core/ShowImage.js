import React from 'react';
import { API } from '../config';

const ShowImage = ({ item, url }) => (
  <div className='product-img' style={{height: '60vh'}}>
    <img
      src={`${API}/${url}/photo/${item._id}`}
      alt={item.name}
      className='mb-3'
      style={{ objectFit: 'contain', height: '100%', width: '100%', display: 'flex', marginLeft: 'auto', marginRight: 'auto', borderRadius:'5px' }}
    />
  </div>
);

export default ShowImage;
