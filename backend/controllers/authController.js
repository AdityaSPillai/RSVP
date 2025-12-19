import UserModel from "../schema/userSchema.js";
import { hashPassword, comparePassword } from "../helpers/authHelper.js"
import JWT from "jsonwebtoken"

export const SignupController = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
        } = req.body;

        // Basic validations
        if (!name) return res.status(400).send({ success: false, message: "Name is Required" });
        if (!email) return res.status(400).send({ success: false, message: "Email is Required" });
        if (!password) return res.status(400).send({ success: false, message: "Password is Required" });

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: "Already existing user",
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user object with only relevant fields
        const userData = {
            name,
            email,
            password: hashedPassword,
        };

        const user = new UserModel(userData);
        await user.save();

        res.status(201).send({
            success: true,
            message: "Successfully added new user to the database",
            user,
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Unable to add new User",
            error: error.message,
        });
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.error("email and password is Requireed");
        }

        const user = await UserModel.findOne({ email: email });
        if (!user) {
            console.log("Unable to find user");
            res.status(404).send({
                success: false,
                message: "Unable to find the user with the given email"
            })
            return;
        }

        const isMatch = await comparePassword(password, user.password)

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = JWT.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).send({
            success: true,
            message: "User found succesfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                location: user.location,
                profileImage: user.profileImage
            },
            token
        })
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message,
        });
    }
}



export const getSingleUserController = async (req, res) => {
    try {

        const { id } = req.params;
        if (!id) return res.status(400).send({ success: false, message: "userId is Required" });

        const user = await UserModel.findById(id);
        if (!user) return res.status(404).send({ succes: false, message: "Unable to find the requested user " });

        res.status(200).send({
            succes: true,
            message: "Succesfully found the user",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                location: user.location,
                profileImage: user.profileImage
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Unable to get the requested user",
            error
        })
    }
}

export const deleteUserController = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        if (user.role === "owner") {
            return res.status(403).send({
                success: false,
                message: "Owner cannot be deleted",
            });
        }

        await UserModel.findByIdAndDelete(id);

        res.status(200).send({
            success: true,
            message: "Employee deleted successfully",
            user,
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Unable to delete the user",
            error,
        });
    }
}

export const updateProfileController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, location, profileImage } = req.body;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        if (name !== undefined) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (req.body.location) {
            user.location = {
                state: req.body.location.state || "",
                country: req.body.location.country || "",
                pincode: req.body.location.pincode || ""
            };
        }

        if (profileImage === "") {
            user.profileImage = null;
        } else if (req.file) {
            user.profileImage = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        }

        await user.save();

        res.status(200).send({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                location: user.location,
                profileImage: user.profileImage
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error updating profile",
            error: error.message
        });
    }
};

export const resetPasswordController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).send({
                success: false,
                message: "Both passwords are required"
            });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await comparePassword(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: "Current password is incorrect"
            });
        }

        user.password = await hashPassword(newPassword);
        await user.save();

        res.status(200).send({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error resetting password",
            error: error.message
        });
    }
};