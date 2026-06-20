const mongoose = require("mongoose");

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
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid email address: " + value);
                }
            }
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
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://img.magnific.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=1000",
        validate: {
            validate(value) {
                if (!validator.isURL(value)) {
                    throw new Error("Invalid photo URL: " + value);
                }
            }
        }
    },
    about: {
        type: String,
        default: "This is a default value about the user!",
    },
    skills: {
        type: [String],
        validate(skills) {
            if (skills.length > 20) {
                throw new Error("Maximum 20 skills allowed");
            }

            const uniqueSkills = new Set(
                skills.map((skill) => skill.toLowerCase().trim())
            );

            if (uniqueSkills.size !== skills.length) {
                throw new Error("Duplicate skills are not allowed");
            }
        }
    }
}, {
    timestamps: true
})

const userModel = mongoose.model("User", userSchema);

module.exports = userModel