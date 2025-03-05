const app = require("./server-config.js");
const userRoutes = require("./src/users/user.routes");
const boardRoutes = require("./src/boards/boards.routes");
const authRoutes = require("./src/auth/auth.routes");
const cookieParser = require("cookie-parser");

const port = process.env.PORT || 3000;
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/boards", boardRoutes);
app.use("/auth", authRoutes);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;
