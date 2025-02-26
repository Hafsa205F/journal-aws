const express = require("express");
const router = express.Router();
const journalController = require("../controllers/journalController");

// POST /api/entries
// Creates a new journal entry
// Example:
// POST http://localhost:3000/api/entries
// Body: { "title": "My First Entry", "content": "Today was a good day" }
router.post("/entries", journalController.createEntry);

// GET /api/entries
// Retrieves all journal entries
// Example: GET http://localhost:3000/api/entries
router.get("/entries", journalController.getEntries);

// GET /api/entries/:id
// Retrieves a single journal entry by ID
// Example: GET http://localhost:3000/api/entries/1
router.get("/entries/:id", journalController.getEntryById);

// PUT /api/entries/:id
// Updates an existing journal entry
// Example:
// PUT http://localhost:3000/api/entries/1
// Body: { "title": "Updated Entry", "content": "Modified content" }
router.put("/entries/:id", journalController.updateEntry);

// DELETE /api/entries/:id
// Deletes a journal entry
// Example: DELETE http://localhost:3000/api/entries/1
router.delete("/entries/:id", journalController.deleteEntry);

module.exports = router;
