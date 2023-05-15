
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

app.get('/', (req, res) => res.json({ "conten": true}))

app.listen(process.env.PORT||3000, (err) => {
    if (err) {
        console.log(err)
    }
    console.log("OK")
})
