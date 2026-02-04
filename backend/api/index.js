require('dotenv').config();
const serverless = require('serverless-http');
const app = require('../src/app');
const connectDB = require('../src/config/db');

// Ensure DB is connected before handling requests
(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Failed to connect to database:', err);
  }
})();

app.use("/api/auth/login", async (req, res) => {
  console.log(1);
  try {
    console.log(2);
    const { email, password } = req.body;
    console.log('email: ', email);
    console.log(3);
    console.log({ email })
    const user = await User.findOne({ email });
    console.log(4);
    console.log(user);
    if (!user) {
      console.log(5);
      return res.status(401).json({ message: "Invalid credentials" });
      console.log(6);
    }

    console.log(password, ' ==== ', user.passwordHash);
    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.log('error while executing user mongodb query');
    console.error(err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

module.exports = serverless(app);
