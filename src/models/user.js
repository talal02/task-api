const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        requireed: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if(value.search('password') !== -1){
                throw new Error('Password should not contain (password) keyword')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'author'
})

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign( { _id:user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.methods.toJSON = function() {
    const user = this
    const userProfile = user.toObject()

    delete userProfile.password
    delete userProfile.tokens
    delete userProfile.avatar

    return userProfile
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne( { email } )

    if(!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    } 

    return user
}

// Hash the password
userSchema.pre('save', async function(next){
    const user = this
     
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany( { author: user._id } )
    next()
})

const User = mongoose.model('User', userSchema)


module.exports = User