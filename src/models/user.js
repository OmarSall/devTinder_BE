const mongoose = require("mongoose");
const validator = require("validator")
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator(value) {
                return validator.isEmail(value);
            },
            message: "Invalid email address"
        }

    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate: {
            validator(value) {
                if (!["male", "female", "others"].includes(value)) {
                    throw new Error("Gender data is not valid")
                }
            },
            message: "Invalid gender"
        }
    },
    photoUrl: {
        type: String,
        default: "https://img.magnific.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=1000",
        validate: {
            validator(value) {
                return validator.isURL(value);
            },
            message: "Invalid photo URL"
        }
    },
    about: {
        type: String,
        default: "This is a default value about the user!",
    },
    skills: {
        type: [String],
        validate: {
            validator(skills) {
                if (skills.length > 20) {
                    return false;
                }

                const uniqueSkills = new Set(
                    skills.map((skill) => skill.toLowerCase().trim())
                );

                return uniqueSkills.size === skills.length;
            },
            message: "Maximum 20 skills allowed or duplicate skills detected"
        }
    }
}, {
    timestamps: true
})

// this will not work with an arrow function
// creating userSchema methods

userSchema.methods.getJWT = async function () {
    const  user = this;

    const token = await jwt.sign(
        { _id: user._id },
        secretKey,
        { expiresIn: "1d" }
    );
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
}

const userModel = mongoose.model("User", userSchema);

module.exports = userModel