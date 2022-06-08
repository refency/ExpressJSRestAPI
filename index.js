import express from 'express';
import router from './server/routes/api.js';
import fileupload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import errorMiddleware from './server/middlewares/errorMiddleware.js';
import cors from 'cors';
import 'dotenv/config';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';

import mongoose from 'mongoose';

const app = express()
const PORT = process.env.PORT || 8000
const swaggerFile = JSON.parse(fs.readFileSync('./swagger/output.json'))

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileupload({}));

app.use('/api', router);
app.use(errorMiddleware);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerFile))

async function startApp() {
    try {
        await mongoose.connect(process.env.DB_URL)

        app.listen(PORT, () => console.log('SERVER STARTED ON PORT: ' + PORT))
    } catch (err) {
        console.log(err)
    }
}

startApp()
