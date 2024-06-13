
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
    required: false
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
  },
  user_ddresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }]

  // mode: {
  //   type: String,
  //   required: true
  // },
  // lastLoginTime: {
  //   type: Date,
  //   required: false
  // }

});


const User = mongoose.model("User", SignUpSchema);


const AddressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  company:{
    type: String,
    required: true
  },

  street1:{
    type: String,
    required: true
  },
  street2: {
    type: String,
    required: false
  },
  city:{
    type: String,
    required: true
  },

  state: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isBusinessAddress: {
    type: Boolean,
    default: false
  }
});

const Address = mongoose.model('UserAddress', AddressSchema);

const RecepientAddress = mongoose.model('RecepientAddress', AddressSchema);

const parcelSchema = new mongoose.Schema({
  length: {
    type: String,
    required: true
  },
  width: {
    type: String,
    required: true
  },
  height: {
    type: String,
    required: true
  },
  weight: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Parcel = mongoose.model('Parcel', parcelSchema);


const predefinedParcelSchema = new mongoose.Schema({
  predefined_package:{
    type: String,
    required: true
  },
  weight: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

})

const PredefinedParcel = new mongoose.model('PredefinedParcel', predefinedParcelSchema)


const shipmentSchema = new mongoose.Schema({
  to_address:{
    type: String,
    required: true
  },
  from_address: {
    type: String,
    required: true
  },
  parcel:{
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

const Shipment = new mongoose.model('Shipment', shipmentSchema);
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
  User,
  Address, 
  RecepientAddress, 
  Parcel,
  PredefinedParcel,
  Shipment
};
