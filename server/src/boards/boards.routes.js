const express = require("express");
const router = express.Router();
const boardController = require("./boards.controller");
const verifyToken = require("../middlewares/jwt.middleware");

// Apply JWT middleware to all board routes
router.use(verifyToken);

// GET /boards
router.get("/", boardController.getBoards);

// GET /boards/:id
router.get("/:id", boardController.getBoardById);

// POST /boards
router.post("/", boardController.createBoard);

// PUT /boards/:id
router.put("/:id", boardController.updateBoard);

// DELETE /boards/:id
router.delete("/:id", boardController.deleteBoard);

module.exports = router;
