/**
 * Swagger/OpenAPI Configuration
 * Auto-generates interactive API documentation
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ACHHADAM API Documentation',
      version: '1.0.0',
      description: 'Digital Farming Platform - RESTful API Documentation',
      contact: {
        name: 'ACHHADAM Team',
        email: 'support@achhadam.com',
        url: 'https://achhadam.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.achhadam.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            firstName: {
              type: 'string',
              description: 'First name',
            },
            lastName: {
              type: 'string',
              description: 'Last name',
            },
            phone: {
              type: 'string',
              description: 'Phone number (10 digits)',
            },
            userType: {
              type: 'string',
              enum: ['farmer', 'buyer', 'transporter', 'admin'],
              description: 'User role',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
            },
          },
        },
        CropListing: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Crop listing ID',
            },
            cropName: {
              type: 'string',
              description: 'Name of the crop',
            },
            cropType: {
              type: 'string',
              description: 'Type of crop',
            },
            quantity: {
              type: 'object',
              properties: {
                available: {
                  type: 'number',
                  description: 'Available quantity',
                },
                unit: {
                  type: 'string',
                  enum: ['kg', 'quintal', 'tonne', 'pieces', 'bags'],
                },
              },
            },
            pricing: {
              type: 'object',
              properties: {
                pricePerUnit: {
                  type: 'number',
                  description: 'Price per unit',
                },
                negotiable: {
                  type: 'boolean',
                  description: 'Is price negotiable',
                },
              },
            },
            location: {
              type: 'object',
              properties: {
                city: {
                  type: 'string',
                },
                state: {
                  type: 'string',
                },
                pincode: {
                  type: 'string',
                },
              },
            },
            farmerId: {
              type: 'string',
              description: 'ID of the farmer who listed this crop',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './server.js',
    './src/routes/**/*.js',
    './routes/**/*.js',
  ],
};

const specs = swaggerJsdoc(options);

const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'ACHHADAM API Docs',
};

module.exports = {
  specs,
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, swaggerOptions),
};