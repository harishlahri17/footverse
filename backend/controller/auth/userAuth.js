const userDetails = require("../../model/userDetails");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userDetails.findOne({ email });
        if (!user) {
            return res.status(400).json({ Success: false, Message: "Invalid Email Or User not exist !" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ Success: false, Message: "Invalid Password !" });
        }

        // JWT token generate
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" },
            user,
        )

        return res.status(200).json({
            Success: true,
            Message: "User login successfully !",
            token: token,
            role: user.role,
        });
    } catch (error) {
        return res.status(500).json({ Success: false, Message: error.message });
    }
}

module.exports = { loginUser };
