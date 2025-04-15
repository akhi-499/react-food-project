const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Connect to MongoDB (authDB)
mongoose
  .connect("mongodb://127.0.0.1:27017/authDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB (authDB)"))
  .catch((err) => console.log(err));

// Define User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String, // Store hashed password
});

const User = mongoose.model("User", userSchema);

// ✅ Register API (Ensure password is hashed)
const router = express.Router();

// Registration API
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // 🔹 Check if the user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists. Please log in." });
        }

        // 🔹 Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 🔹 Save the new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
      // 🔹 Check if the user exists
      const user = await User.findOne({ email: email });
      if (!user) {
          return res.status(400).json({ message: "User not found. Please register first." });
      }

      // 🔹 Compare hashed passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
      }

      res.status(200).json({ message: "Login successful", user: user });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
});

app.use("/", router);
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
