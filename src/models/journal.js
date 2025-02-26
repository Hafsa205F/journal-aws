// filepath: /journal-api/journal-api/src/models/journal.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Journal {
    static async createEntry(data) {
        return await prisma.journalEntry.create({
            data,
        });
    }

    static async getEntries() {
        return await prisma.journalEntry.findMany();
    }

    static async getEntryById(id) {
        return await prisma.journalEntry.findUnique({
            where: { id },
        });
    }

    static async updateEntry(id, data) {
        return await prisma.journalEntry.update({
            where: { id },
            data,
        });
    }

    static async deleteEntry(id) {
        return await prisma.journalEntry.delete({
            where: { id },
        });
    }
}

module.exports = Journal;