const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Meeting Booking System API",
    version: "1.0.0",
    description: "REST API for managing meeting rooms, user authorization, and schedule bookings.",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],
  paths: {
    "/api/health": {
      get: {
        summary: "Check API Health and server availability",
        tags: ["System"],
        responses: {
          200: { description: "Server is healthy and PostgreSQL is connected" }
        }
      }
    },
    "/api/auth/login": {
      post: {
        summary: "Authenticate user and get JWT Token",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "user@example.com" },
                  password: { type: "string", example: "password123" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Login successful" },
          400: { description: "Validation error" },
          401: { description: "Invalid credentials" }
        }
      }
    },
    "/api/categories": {
      get: {
        summary: "Get cached rooms as system categories",
        tags: ["Rooms"],
        responses: {
          200: { description: "Returns array of rooms with X-Cache headers" }
        }
      }
    },
    "/api/tickets": {
      get: {
        summary: "Get paginated list of bookings (tickets)",
        tags: ["Bookings"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } }
        ],
        responses: {
          200: { description: "Paginated bookings object with metadata" }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};

module.exports = { openApiDocument };