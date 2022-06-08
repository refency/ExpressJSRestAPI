import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import swaggerAutogen from 'swagger-autogen';

const _dirname = dirname(fileURLToPath(import.meta.url));

const doc = {
  // General information
  info: {
    title: 'BlogsAPI',
    description: 'API to work with server'
  },
  host: `localhost:${process.env.PORT || 8000}`,
  schemes: ['http']
}
// Route and name generated file
const outputFile = join(_dirname, 'output.json')
// Array to routes
const endpointsFiles = [join(_dirname, '../server/routes/api.js')]

swaggerAutogen(/*options*/)(outputFile, endpointsFiles, doc).then(({ success }) => {
  console.log(`Generated: ${success}`)
})