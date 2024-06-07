const service = require('../utils/auth-service')
const {User, html } = require('../src/config')
const randomstring = require('randomstring');
const generateOTP = require('../utils/otp-generator')
const { sendEmail } = require('../utils/node-mailer');
const response = require('../utils/responses')
const bcrypt = require('bcrypt');
require('dotenv').config()
const Register = async (req, res) => {
	const { name, email, password, dateOfBirth, phoneNumber } = req.body;
	


	const otp = generateOTP()
	const alreadyExists = await User.findOne({ email: email });
	if (alreadyExists) {
		return res.send('User already exists. Please choose different user name')
	}
	try {
		const data = {
		name,
		email,
		password,
		phoneNumber,
		dateOfBirth,
		otp_code: otp,
		otp_expiration: new Date(Date.now() + 10*60*1000)
	    }

		const salt = await bcrypt.genSalt(10);
		data.password = await bcrypt.hash(data.password, salt);
		const useradd = await User.insertMany(data);
		if(!useradd)
			{
				res.send('There was a problem registering the user.')
			}
			sendEmail(email, 'Your OTP', `Your OTP is: ${otp}`)
		res.send('User registered successfully!');
	} catch (error) {
		console.error('Error hashing password:', error);
		res.status(500).send('Internal server error.');
	}
}

const ResendOTP = async (req, res) => {
    const { email } = req.body;
    const otp_code = generateOTP();
    const otp_expiration = new Date(Date.now() + 10 * 60 * 1000);

    console.log(`Email: ${email}`); // Log the email

    try {
        const user = await User.findOneAndUpdate(
            { email: email },
            { otp_code: otp_code, otp_expiration: otp_expiration },
            { new: true }
        );

        console.log(`User: ${JSON.stringify(user)}`); // Log the user

        if (!user) { 
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the OTP to the user's email
        sendEmail(email, 'Resent OTP', `Resent OTP is: ${otp_code}`);

        return res.status(200).json({ message: 'OTP resent', user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const VerifyEmail = async (req, res)=>{
    try {
        console.log(req.body)
        const { email, otp_code } = req.body
        const emailExists = await service.EmailExists({ email })

        console.log('emailExists:', emailExists)

        if (emailExists.length <= 0) return response(res, 404, { message: 'User not found' })

        try {
            const user = await service.VerifyEmail({ email, otp_code })
            console.log('user:', user)
            if (!user) return response(res, 400, {message: 'user not found'})

            const result = user

            return response(res, 200, {
                message: 'Email is verified',
                result: result,
            })
        } catch (error) {
            console.log('VerifyEmail error:', error)
            if (error.message === 'OTP is expired') return response(res, 400, { message: 'OTP is expired' })
            if (error.message === 'Email has been verified') return response(res, 401, {message: 'Email has been verified'})
        }
    } catch (error) {
        console.log('Outer error:', error)
        return response(res, 500, error.message)
    }
} 


const ForgotPassword = async (req, res) => {
    try {
      const email = req.body.email;
      const user = await User.findOne({ email: email }); // Await the findOne operation
      if (user) {
        const randomString = randomstring.generate();
        await User.updateOne({ email: email }, { $set: { token: randomString } }); // Await the updateOne operation
  
        const resetLink = `${process.env.FRONT_END_URL}/resetpassword?token=${randomString}`;
        const message = `
          <p>Hi ${user.name},</p>
          <p>Please copy the link and <a href="${resetLink}">reset your password</a>.</p>
        `;
  
        sendEmail(email, 'For Reset Password', message); // Await sendEmail if it returns a promise
  
        res.send('Email sent');
      } else {
        res.send('This email does not exist');
      }
    } catch (error) {
      res.send(error.message);
    }
  };
  


  const ResetPassword = async (req, res) => {
    try {
      const {token, password} = req.body;
      const userData =await User.findOne({token: token});
      // console.log(token, userData, 'hello password and user');
      if(userData)
        {
          const salt = await bcrypt.genSalt(10);
          const newPassword = await bcrypt.hash(password, salt);
           
          const user = await User.findByIdAndUpdate(
            { _id: userData._id },
            { $set: { password: newPassword, token: '' } },
            { new: true }
          );
          
         console.log(password, user, 'hello password and user');
          res.send('Password reset successful')
        }
        else 
        {

        }
        
    } catch (error) {
        res.send(error.message)
    }
  }
  
  const UpdatePassword = async (req, res) => {
    try {
      const { 
        id, password, newPassword } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ _id: id });
      if (!user) {
        return res.send('User not found');
      }
  
      // Compare the current password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.send('Incorrect current password');
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
  
      // Update the user's password
      user.password = hashedNewPassword;
      await user.save();
  
      res.send('Password updated successfully');
    } catch (error) {
      res.status(500).send(error.message);
    }
  };



module.exports = { Register, ResendOTP, VerifyEmail, ForgotPassword, ResetPassword, UpdatePassword}