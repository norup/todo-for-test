const app = require("./server-config.js");
const userRoutes = require("./src/users/user.routes");
const boardRoutes = require("./src/boards/boards.routes");

const port = process.env.PORT || 3000;

app.use("/users", userRoutes);
app.use("/boards", boardRoutes);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;
