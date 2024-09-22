const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const registerSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
    },
    email: {
        type: Array,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
});

registerSchema.pre("save", async function (next) {
    const register = this;

    if (!register.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(register.password, salt);
        register.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }  
});

registerSchema.methods.generateToken = async function () {
    try {
        const token= jwt.sign(
            {
                userId: this._id.toString(),
                email: this.email,
                isAdmin: this.isAdmin,
            },

            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "10d",
            }
        )
        this.tokens= this.tokens.concat({token})
        await this.save()
        return token;
    } catch (error) {
        console.error(error);
    }
}


const Register = mongoose.model('Register', registerSchema);

module.exports = Register;
