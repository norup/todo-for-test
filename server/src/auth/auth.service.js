const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const register = async (email, password, username) => {
  try {
    const existingUser = await User.getByEmail(email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.createUser({
      email: email,
      password_hash: hashedPassword,
      username: username,
    });

    const token = generateToken(newUser.id, newUser.email);

    return token;
  } catch (error) {
    console.error("Error registering user", error);
    if (error.message === "JWT_SECRET environment variable is not set") {
      throw error;
    }
    throw new Error("Failed to register user");
  }
};

const login = async (email, password) => {
  try {
    const user = await User.getByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const { accessToken, refreshToken } = generateToken(user.id, user.email);
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error logging in", error);
    throw new Error("Failed to login");
  }
};

const generateToken = (userId, email) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  const accessToken = jwt.sign(
    { userId: userId, email: email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { userId: userId, email: email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

const refreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error("User not found");
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    return { accessToken, newRefreshToken };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  register,
  login,
  refreshToken,
};
