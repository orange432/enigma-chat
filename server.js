import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import APIRouter from './api/graphql.js';

// Create dirname with es6
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.use('/_graphql',APIRouter); // GraphQL routes

// Not an API call, send the webpage
app.use((req,res)=>{
    res.sendFile(path.join(__dirname,"public/index.html"));
});

 app.listen(PORT,()=>console.log(`App listening on http://localhost:${PORT}`))

