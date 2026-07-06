const mongoose = require("mongoose");
const validator = require("validator")
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

const userModel = mongoose.model("User", userSchema);

module.exports = userModel