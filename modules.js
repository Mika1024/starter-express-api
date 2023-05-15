import { validationResult } from 'express-validator'
import user from './user.js'
import post from './sells.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const login = async ( req, res ) => {
    try {
     const profile = await user.findOne({email: req.body.email});
     if (!profile) {
        return res.status(404).json({
            message: 'Not registration people'
        })
    }
    const availible = bcrypt.compare(req.body.password, profile._doc_passwordHash);
    if (!availible) {
        return res.status(404).json({
            message: 'Not registration people'
        })
    }
    const token = jwt.sign(
        {
            _id: profile._id
        },
        'secretkey1024',
        {
            expiresIn:'30d'
        }
    )
    res.json({
        token 
    })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server error',
        })
    }
}
export const createPosts = async (req, res) => {
    try {
        console.log(req.userId)
        const profile = await user.findById(req.userId)
        if (!profile) {
            return res.status(404).json({
                message: 'User not registration'
            })
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        const doc = new post({
            name: req.body.name,
            text: req.body.text,
            countSee: 0
        })

        const postCtr = await doc.save();

        user.findByIdAndUpdate(
            { _id: req.userId },
            { $addToSet: { sellList: postCtr._doc._id.toString() } },
            (err, result) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(result)
                }
            }
        )

        res.json({
            ...postCtr._doc
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server error',
        })
    }
}
export const allPosts = async (req, res) => {
    try {
        
        const postList = await post.find().sort({countSee: -1}).skip((req.params.list - 1) * 12).limit(12).exec()
        res.send({
            ...postList,
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server error',
        })
    }
}
export const topPosts = async (req, res) => {
    try {

        const topPosts = await post.find().sort({ countSee: -1 }).limit(3).exec()

        res.send({
            ...topPosts
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server error',
        })
    }
}
export const idPosts = async (req, res) => {
    try {
        const postId = req.params.id

        post.findByIdAndUpdate(
            {
                _id: postId
            },
            {
                $inc: { "countSee": 1}
            },
            {
                returnDocument: 'after'
            },
            (err, doc) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Server error',
                    })
                }
                if (!doc) {
                    console.log(err)
                    return res.status(404).json({
                        message: 'Good not found',
                    })
                }
                
                res.json(doc)
            }
        )
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server error',
        })
    }
}