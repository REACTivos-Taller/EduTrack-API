import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  swaggerDefinition: {
    openapi: '3.1.1',
    info: {
      title: 'EduTrack API',
      version: '1.0.0',
      description: 'El administrador de alumnos de Kinal™',
      contact: {
        name: 'REACTivos',
        url: 'https://github.com/REACTivos-Taller/EduTrack-API',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/v1',
        description: 'Desarrollo',
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
    },
  },
  apis: ['docs/**/*.yaml'],
}

const swaggerDocs = swaggerJSDoc(options)

export { swaggerDocs, swaggerUi }
