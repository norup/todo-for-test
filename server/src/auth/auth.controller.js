const AuthService = require("./auth.service");

const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const { refreshToken, accessToken } = await AuthService.register(
      email,
      password,
      username
    );

    res.cookie("token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 3600000,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken: accessToken,
    });
  } catch (error) {
    if (error.message === "User already exists") {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const { accessToken, refreshToken } = await AuthService.login(
      email,
      password
    );

    res.cookie("token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 3600000,
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      accessToken: accessToken,
    });
  } catch (error) {
    if (
      error.message === "User not found" ||
      error.message === "Invalid password"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

const refreshToken = async (req, res) => {
  try {
    if (!req.cookies || !req.cookies.token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const token = req.cookies.token;

    const { accessToken, newRefreshToken } = await AuthService.refreshToken(
      token
    );

    res.cookie("token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 3600000,
    });

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken: accessToken,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.clearCookie("token");
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token - please login again",
      });
    }
    if (error.name === "TokenExpiredError") {
      res.clearCookie("token");
      return res.status(401).json({
        success: false,
        message: "Refresh token expired - please login again",
      });
    }
    if (error.message === "User not found") {
      res.clearCookie("token");
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error refreshing token",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
};
