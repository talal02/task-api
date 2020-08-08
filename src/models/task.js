const mongoose = require('mongoose')

const tashSchema = new mongoose.Schema({
    desc: {
        type: String,
        required: true,
        trim: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Task = mongoose.model( 'Task' , tashSchema)


module.exports = Task