
const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb+srv://softhafizirshad:ncqQwxYfVtKwZimn@test-cluster.ioxwmvl.mongodb.net/hafiz');


connect.then(() => {
  console.log('database connected successfully')
}).catch(() => {
  console.log('Database cannot be connected');
});


const SignUpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: false
  },
  phoneNumber: {
    type: String,
    required: false
  },

  otp_code: {
    type: String,
    required: false
  },
  otp_expiration: {
    type: String,
    required: false
  },

  is_verified: {
    type: Boolean,
    default: false
  },
  token: {
    type: String,
    default: ''
  }

  // mode: {
  //   type: String,
  //   required: true
  // },
  // lastLoginTime: {
  //   type: Date,
  //   required: false
  // }

});


const User = new mongoose.model("users", SignUpSchema);

const t = {
  greet: `Introducing FastShipper, the ultimate shipping solution. Soon, you'll be able to create labels, insure packages, and schedule pickups effortlessly.`,
};

const html = (text = t.successPayment) => {
  return `
        <html>
            <body>
                <p style="font-family: 'system-ui';" >${text}</p>
            </body>
        </html>
    `;
};

module.exports = {
  t,
  html,
  User
};
