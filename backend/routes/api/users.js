const express = require('express')
const { check, validationResult } = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const User = require('../../models/User')
const Profile = require('../../models/Profile')
const jwt = require('jsonwebtoken')
const config = require('config')
const normalize = require('normalize-url');
const auth = require('../../middleware/auth')
const upload = require('../../middleware/multer.middleware')
const cloudinary = require('cloudinary')
const router = express.Router()
const fs = require('fs/promises')
// @route     GET api/users
// @desc      Test Route
// @access    Public
router.post('/', upload.single('avatar'), async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }


    const { name, email, password } = req.body
    // console.log(req.body)
    try {
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ errors: [{ msg: "User already exists" }] })
        }

        let avatar = {
            public_id: email,
            secure_url:
                "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg",
        }

        if (req.file) {
            // console.log(req.file)
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path,
                    {
                        folder: "devconnector",
                        width: 250,
                        height: 250,
                        gravity: "faces",
                        crop: "fill",
                    })
                if (result) {
                    avatar.public_id = result.public_id
                    avatar.secure_url = result.secure_url
                    fs.rm(`uploads/${req.file.filename}`)
                }
            } catch (error) {
                res.send(error.message)
            }
        }

        user = new User({
            name,
            email,
            avatar,
            password
        })

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        await user.save()

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, process.env.JWT_SECRET,
            { expiresIn: '5 days' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            })

        // res.json({
        //     success: true,
        //     user
        // })

    } catch (error) {
        console.error(error.message)
        res.status(400).send('Server Error')
    }

})

router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: "user not found" })
        res.status(200).json({
            user
        })
    } catch (error) {
        console.log(error)
    }
})

module.exports = router