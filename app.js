import express from 'express';
// import path from 'path';
import {router} from './routes/routes.js';

const app = express();
const port = 3000;

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

// Set default views folder to views
app.set('views', 'views');

// Set view engine to EJS
app.set('view engine','ejs');

// Set folder location for static content
app.use(express.static('public'));

app.use('/', router); 

app.listen(port, () => {
  console.log(`OptInt listening at http://localhost:${port}`)
});