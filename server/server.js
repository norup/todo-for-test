const app = require("./server-config.js");
const userRoutes = require("./src/users/user.routes");

const port = process.env.PORT || 3000;

app.use("/users", userRoutes);

// app.get("/", routes.getAllTodos);
// app.get("/:id", routes.getTodo);

// app.post("/", routes.postTodo);
// app.patch("/:id", routes.patchTodo);

// app.delete("/", routes.deleteAllTodos);
// app.delete("/:id", routes.deleteTodo);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;
