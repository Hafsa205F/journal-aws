const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class JournalController {
  async createEntry(req, res) {
    try {
      const { title, content } = req.body;
      const entry = await prisma.journalEntry.create({
        data: { title, content },
      });
      res.status(201).json(entry);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getEntries(req, res) {
    try {
      const entries = await prisma.journalEntry.findMany();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getEntryById(req, res) {
    try {
      const entry = await prisma.journalEntry.findUnique({
        where: { id: req.params.id },
      });
      if (!entry) {
        return res.status(404).json({ error: "Entry not found" });
      }
      res.json(entry);
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: error.message });
    }
  }

  async updateEntry(req, res) {
    try {
      const { title, content } = req.body;
      const entry = await prisma.journalEntry.update({
        where: { id: req.params.id },
        data: { title, content },
      });
      res.json(entry);
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Entry not found" });
      }
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: error.message });
    }
  }

  async deleteEntry(req, res) {
    try {
      await prisma.journalEntry.delete({
        where: { id: req.params.id },
      });
      res.status(204).send();
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Entry not found" });
      }
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new JournalController();
