const express = require('express');
const router = express();
const passport = require('passport');
const generateOTP = require('../utils/otp-generator')
const bcrypt = require('bcrypt');
require('../utils/passport');
const { User } = require('../src/config')
const crypto = require('crypto');

function generateRandomPassword(length) {
	return crypto.randomBytes(length).toString('hex').slice(0, length);
}

router.use(passport.initialize());
router.use(passport.session());
router.use(express.json());

router.use(express.urlencoded({ extended: false }))


const ctrl = require('../controllers/auth-controllers')

router.post('/signup', ctrl.Register)
router.post('/resend-otp', ctrl.ResendOTP)
router.post('/verify', ctrl.VerifyEmail)
router.post('/forgot-password', ctrl.ForgotPassword);
router.post('/reset-password', ctrl.ResetPassword);
router.post('/update-password', ctrl.UpdatePassword);
router.post('/login', async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.send('User not found');
		}

		const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
		if (!isPasswordMatch) {
			return res.send('Incorrect password');
		}

		user.isLoggedIn = true;
		await user.save();

		// Exclude sensitive information before sending the response
		const { password, ...userData } = user.toObject();

		res.send({
			message: 'User logged in successfully.',
			user: userData
		});
	} catch (error) {
		console.error('Error logging in:', error);
		res.send('Internal server error.');
	}
});



router.post('/logout', async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.send('User not found');
		}

		user.isLoggedIn = false;
		await user.save();

		res.send('User logged out successfully');
	} catch (error) {
		console.error('Error logging out:', error);
		res.status(500).send('Internal server error.');
	}
});

// Auth 
router.get('/auth/google', passport.authenticate('google', {
	scope:
		['email', 'profile']
}));

// Auth Callback 


router.get('/auth/google/callback', (req, res, next) => {
	passport.authenticate('google', async (err, user, info) => {
		if (err) {
			return res.redirect(`${process.env.FRONT_END_URL}/login?error=server_error`);
		}
		if (!user) {
			return res.redirect(`${process.env.FRONT_END_URL}/login?error=authentication_failed`);
		}

		try {
			let existingUser = await User.findOne({ email: user.email });
			if (existingUser) {
				existingUser.isLoggedIn = true;
				await existingUser.save();
				return res.redirect(`${process.env.FRONT_END_URL}/dashboard?userData=${encodeURIComponent(JSON.stringify(existingUser))}`);
			} else {
				const { email } = user;
				const randomPassword = generateRandomPassword(12);
				const data = {
					name: `${user.given_name} ${user.family_name}`,
					email,
					password: randomPassword,
					phoneNumber: '',
					dateOfBirth: '',
					isLoggedIn: true
				};

				const salt = await bcrypt.genSalt(10);
				data.password = await bcrypt.hash(data.password, salt);
				await User.insertMany(data);
				return res.redirect(`${process.env.FRONT_END_URL}/dashboard?userData=${encodeURIComponent(JSON.stringify(data))}`);
			}
		} catch (dbError) {
			console.error('Database operation error:', dbError);
			return res.redirect(`${process.env.FRONT_END_URL}/login?error=internal_server_error`);
		}
	})(req, res, next);
});

// update profile 

// Update user profile
router.put('/profile', async (req, res) => {
	const { _id, email, name, phoneNumber } = req.body;
	console.log(_id, email, name, phoneNumber, 'hello data')
	try {
		const user = await User.findOne({ _id });
		if (!user) {
			return res.status(404).send('User not found');
		}

		// Update user data
		user.name = name || user.name;
		user.phoneNumber = phoneNumber || user.phoneNumber;
		user.email = email || user.email;

		await user.save();

		// Exclude sensitive information before sending the response
		 const { password, ...userData } = user.toObject();

		res.status(200).json({
			message: 'User profile updated successfully.',
			user: userData
		});
	} catch (error) {
		console.error('Error updating profile:', error);
		res.status(500).send('Internal server error.');
	}
});


module.exports = router;