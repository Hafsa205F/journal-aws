# Journal API

A RESTful API for managing journal entries, deployed on AWS EKS.

## Architecture

- Backend: Node.js Express API with Prisma ORM
- Database: PostgreSQL (Azure Neon)
- Infrastructure: AWS EKS managed with Terraform
- CI/CD: GitHub Actions

## API Endpoints

### GET /api/entries

Returns all journal entries.

### POST /api/entries

Creates a new journal entry.
Body: `{ "title": "Entry title", "content": "Entry content" }`

### GET /api/entries/:id

Returns a specific journal entry.

### PUT /api/entries/:id

Updates a specific journal entry.
Body: `{ "title": "Updated title", "content": "Updated content" }`

### DELETE /api/entries/:id

Deletes a specific journal entry.

## Deployment

The API is deployed at: http://a9d1d4561fa4645958bbba492a4f91cd-2137975475.eu-north-1.elb.amazonaws.com
# Added to trigger CI/CD


