const { OAuth2Client } = require('google-auth-library');
const User = require('../../MongoConnect/All Schema/Schema');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: jwt.sign({ email, createdAt: Date.now() }, process.env.SECRET_KEY),
        role: 'user',
        isloggedin: true,
      });
      await user.save();
    } else {
      user.isloggedin = true;
      await user.save();
    }

    const token = jwt.sign({ userId: user._id, name: user.name }, process.env.SECRET_KEY, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Google login successful',
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        isloggedin: user.isloggedin,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({ error: 'Google login failed' });
  }
};
