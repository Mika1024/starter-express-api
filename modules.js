import user from './user.js'
import post from './sells.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const login = async ( req, res ) => {
    try {
     const profile = await user.findOne({email: req.body.email});
     if (!profile) {
        return res.status(401).json({
            code: 401
        })
    }
    const availible = await bcrypt.compare(req.body.password, profile.passwordHash);
    if (!availible) {
        return res.status(401).json({
            code: 401
        })
    }
    const decoded = jwt.verify(req.body.code, "wellfinesecretkeyforpoststogether")
    if(decoded.code != "wellfine.reboot.technology.org"){
        return res.status(401).json({
            code: 401
        })
    }
    res.json({
        code: 200 
    })
    } catch (err) {
        console.log(err)
        res.status(401).json({
            code: 401
        })
    }
}
export const reg = async ( req, res ) => {
    try {
        const salt = await bcrypt.genSalt(14);
        const password = await bcrypt.hash(req.body.password, salt)
        const doc = new user({
            fullName: req.body.fullName,
            email: req.body.email,
            number: req.body.fullName,
            passwordHash: password,
        })
        const newUser = await doc.save()
    res.json({
        ...newUser 
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
        const doc = new post({
            name: req.body.name,
            text: req.body.text,
            countSee: 0
        })

        const postCtr = await doc.save();

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
export const search = async (req,res)=>{
try{    
    const textId = req.params.text
    let search = await post.find({name:  { "$regex": textId, "$options": "i" }}).sort({ countSee: -1 }).exec()
    res.status(200).json({
        ...search
    })
}catch (err) {
    console.log(err)
    res.status(500).json({
        message: 'Server error',
    })
}
}
