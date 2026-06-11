import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Enterprise Employee Management System API',
      version: '1.0.0',
      description: 'Production-ready REST API documentation for the HRMS/ERP Employee Management System',
      contact: {
        name: 'i-SOFTZONE Technical Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './controllers/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
