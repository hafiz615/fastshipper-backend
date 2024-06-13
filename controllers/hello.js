const axios = require('axios');

// Your EasyPost API key
const EASYPOST_API_KEY = 'EZTKc9eeb697df254d55809c07eef158de5ct46I8Ejn6EdyEbv6sNUkpw';



const data = {
  shipment: {
    to_address: {
      id: 'adr_aef44d6f28b911ef9642ac1f6bc539aa'
    },
    from_address: {
      id: 'adr_f2a9182b28b711ef935aac1f6bc53342'
    },
    parcel: {
      id: 'prcl_fd1f2292326f431f8451f0cace93c7e5'
    }
  }
};

const config = {
  headers: {
    'Content-Type': 'application/json'
  },
  auth: {
    username: EASYPOST_API_KEY
  }
};

axios.post('https://api.easypost.com/v2/shipments', data, config)
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.response.data);
  });

