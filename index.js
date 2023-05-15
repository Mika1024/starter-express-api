/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import functions from "firebase-functions";
import {logger} from "firebase-functions";

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { registervalidation, createvalidation } from './validation.js'
import * as module from './modules.js'
import jwttoken from './token.js'

const app = express()

const password = 'favouritemouse'
const url = 'mongodb+srv://foreducation:' + password + '@foredu.fyunlt3.mongodb.net/blog?retryWrites=true&w=majority'

mongoose.set('strictQuery', true);
console.log("hello")
mongoose
    .connect(url, { useNewUrlParser: true })
    .then(() => console.log('OK DB'))
    .catch((err) => console.log(err))

app.use(express.json())
app.use(cors())

app.get('/posts/top', module.topPosts)

app.post('/posts/create', jwttoken, createvalidation, module.createPosts)

app.get('/posts/all/:list', module.allPosts)

app.get('/posts/id/:id', module.idPosts)

app.post('/auth/login', module.login)

app.listen(process.env.PORT||3000, (err) => {
    if (err) {
        console.log(err)
    }
    console.log("OK")
})
const api = () => functions.https.onRequest(app)
api()