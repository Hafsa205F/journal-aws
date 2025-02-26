const request = require("supertest");
const app = require("../index");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Mock Prisma to avoid actual DB operations during tests
jest.mock("@prisma/client", () => {
  const mockPrisma = {
    journalEntry: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 1,
          title: "Test Entry",
          content: "Test Content",
          createdAt: new Date(),
        },
      ]),
      create: jest.fn().mockImplementation((data) =>
        Promise.resolve({
          id: 1,
          ...data.data,
          createdAt: new Date(),
        })
      ),
      findUnique: jest.fn().mockResolvedValue({
        id: 1,
        title: "Test Entry",
        content: "Test Content",
        createdAt: new Date(),
      }),
      update: jest.fn().mockImplementation((data) =>
        Promise.resolve({
          id: data.where.id,
          ...data.data,
          createdAt: new Date(),
        })
      ),
      delete: jest.fn().mockResolvedValue({ id: 1 }),
    },
    $disconnect: jest.fn(),
  };

  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

describe("Journal API Routes", () => {
  let server;

  // Fix: Use either done callback OR async/await, not both
  beforeAll(() => {
    return new Promise((resolve) => {
      server = app.listen(0, () => {
        resolve();
      });
    });
  });

  afterAll(async () => {
    await prisma.$disconnect(); // Disconnect Prisma client
    await new Promise((resolve) => server.close(resolve));
  });

  it("should get all journal entries", async () => {
    const res = await request(app).get("/api/entries");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should create a new journal entry", async () => {
    const res = await request(app)
      .post("/api/entries")
      .send({
        title: "Test Entry",
        content: "Test Content",
      })
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });
});
