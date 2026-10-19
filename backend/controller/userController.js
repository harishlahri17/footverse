const UserDetails = require("../model/userDetails");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;

        // Check password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                Success: false,
                Message: "Password and Confirm Password do not match",
            });
        }

        // Check if user already exists
        const existingUser = await UserDetails.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                Success: false,
                Message: "User already exists with this email",
            });
        }

        //hashed password
        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = new UserDetails({
            fullName: fullName,
            email: email,
            password: hashedPassword,
            role: "user",
        });
        const saveData = await userData.save();

        // JWT token generate
        const token = jwt.sign(
            { id: saveData.id, role: saveData.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" },
        )
        res.status(201).json({
            Success: true,
            Message: "User added Successfully !",
            Data: saveData,
            token: token,
        });

    } catch (error) {
        res.status(500).json({
            Success: false,
            Message: error.message,
        });
    }
}


const userProfile = async (req, res) => {
    try {
        // req.user contains { id, role } from authMiddleware
        const userId = req.user.id;

        // Find student by ID, exclude password, populate branch name
        const user = await UserDetails.findById(userId).select("-password")

        if (!user) {
            return res.status(404).json({ Success: false, Message: "user not found" });
        }

        return res.status(200).json({ Success: true, user });
    } catch (error) {
        console.error(`Error from the student profile route: ${error}`);
        return res.status(500).json({ Success: false, Message: "Server Error" });
    }
};


const updateUser = async (req, res) => {
    try {
        const id = req.user.id;
        const { fullName, email, phone, state, district, city, postOffice, area, pinCode, dob, gender, bio, image, addresses } = req.body;

        let updateData = {};
        if (fullName !== undefined) updateData.fullName = fullName;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (state !== undefined) updateData.state = state;
        if (district !== undefined) updateData.district = district;
        if (city !== undefined) updateData.city = city;
        if (postOffice !== undefined) updateData.postOffice = postOffice;
        if (area !== undefined) updateData.area = area;
        if (pinCode !== undefined) updateData.pinCode = pinCode;
        if (dob !== undefined) updateData.dob = dob;
        if (gender !== undefined) updateData.gender = gender;
        if (bio !== undefined) updateData.bio = bio;
        if (image !== undefined) updateData.image = image;
        if (addresses !== undefined) updateData.addresses = addresses;

        const updatedUser = await UserDetails.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
        return res.status(200).json({
            Success: true,
            Message: "Profile updated successfully",
            user: updatedUser
        });
    }
    catch (error) {
        return res.status(500).json({
            Success: false,
            Message: error.message
        });
    }

}

const verifyPassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword } = req.body;

        const user = await userDetails.findById(userId);
        if (!user) {
            return res.status(404).json({ Success: false, Message: "User not found" });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ Success: false, Message: "Current password does't match" });
        }
        return res.status(200).json({ Success: true, Message: "Password verified" });
    }
    catch (error) {
        return res.status(500).json({ Success: false, Message: error.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ Success: false, Message: "Passwords do not match" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await UserDetails.findByIdAndUpdate(userId, { password: hashedPassword });

        return res.status(200).json({ Success: true, Message: "Password updated successfully" });
    } catch (error) {
        return res.status(500).json({ Success: false, Message: error.message });
    }
};


module.exports = { createUser, userProfile, updateUser, verifyPassword, updatePassword };