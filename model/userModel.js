const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String, 
            trim: true,
            required: [true, 'User name required'],
        }, 
        slug: {
            type: String, 
            lowercase: true,
        }, 
        email: {
            type: String, 
            required: [true, 'Email required'],
            unique: true,
            lowercase: true,
        },
        phone: String, 
        photo: String,
        password: {
            type: String,
            required: [true, 'Password requiredddd'],
            minlength: [8, 'Password must be at least 8 characters'],
        },
        hashedCode: String,
        hashedCodeExpires: Date,
        hashedCodeVerified: Boolean,
        role: {
            type: String,
            enum: ['user', 'admin', 'manager'],
            default: 'user',
        },
        active: {
            type: Boolean,
            default: true,
        },
        passwordChangeAt: Date,
        //! child reference (one to many).
        wishlist:[
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
            }
        ],
        addresses:[
            {
                id: { type: mongoose.Schema.Types.ObjectId }, //* Created Auto.
                alias: String,
                details: String,
                phone: String,
                city: String,
                postalcode: String,
            },
        ],
    }, 
    { timestamps: true }
);


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    //* Hashing the user password
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;