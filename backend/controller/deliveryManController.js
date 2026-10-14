const DeliveryMan = require("../model/deliveryManModel");
const userDetails = require("../model/userDetails");
const bcrypt = require("bcrypt");


const addDeliveryMan = async (req, res) => {
    try {
        const { fullName, email, phone, password, vehicleType, vehicleNumber, model, licenseNumber,
            salary, commissionPerOrder, assignedCity, assignedAreas, assignedPincodes } = req.body;

        // Check if email already exists
        const existingUser = await userDetails.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                Success: false,
                Message: "Email already exists."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user account
        const user = await userDetails.create({
            fullName: fullName,
            email: email,
            phone: phone,
            password: hashedPassword,
            role: "delivery"
        });

        const areaArray = Array.isArray(assignedAreas) ? assignedAreas : [assignedAreas];
        const pincodeArray = Array.isArray(assignedPincodes) ? assignedPincodes : [assignedPincodes];

        const deliveryManData = new DeliveryMan({
            userId: user._id,
            vehicleDetails: {
                vehicleType: vehicleType,
                vehicleNumber: vehicleNumber,
                model: model,
            },
            licenseNumber: licenseNumber,
            salary: salary || 0,
            commissionPerOrder: commissionPerOrder || 0,
            assignedCity: assignedCity,
            assignedAreas: areaArray,
            assignedPincodes: pincodeArray,
        })

        const saveData = await deliveryManData.save();
        res.status(200).json({
            Success: true,
            Message: "Delivery man added successfully !",
            Data: saveData
        });
    } catch (error) {
        res.status(500).json({
            Success: false,
            Message: error.message
        });
    }
}

const getDeliveryMan = async (req, res) => {
    try {
        const list = await DeliveryMan.find({}).populate("userId", "fullName email phone role");
        return res.status(200).json({
            Success: true,
            Message: " Delivery Man fetched successfullly !",
            list: list,
        });
    } catch (error) {
        return res.status(500).json({
            Success: false,
            Message: error.message
        })
    }
}

const getSingleDeliveryMan = async (req, res) => {
    try {
        const { id } = req.params;
        const deliveryMan = await DeliveryMan.findById(id).populate("userId", "fullName email phone role");

        if (!deliveryMan) {
            return res.status(404).json({ Success: false, Message: "Delivery man not found" });
        }
        return res.status(200).json({ Success: true, deliveryMan });

    } catch (error) {
        return res.status(500).json({ Success: false, Message: error.message });
    }
};

const updateDeliveryMan = async (req, res) => {
    try {
        const { id } = req.params;
        const deliveryMan = await DeliveryMan.findById(id);

        if (!deliveryMan) {
            return res.status(404).json({
                Success: false,
                Message: "Delivery man not found"
            });
        }
        const { fullName, email, phone, vehicleType, vehicleNumber, model, licenseNumber,
            salary, commissionPerOrder, assignedCity, assignedAreas, assignedPincodes } = req.body;

        // User update
        let userUpdate = {
            fullName: fullName,
            email: email,
            phone: phone,
        };
        // delivery update
        let DeliveryUpdate = {
            vehicleDetails: {
                vehicleType: vehicleType,
                vehicleNumber: vehicleNumber,
                model: model,
            },
            licenseNumber: licenseNumber,
            salary: salary || 0,
            commissionPerOrder: commissionPerOrder || 0,
            assignedCity: assignedCity,
            assignedAreas: assignedAreas,
            assignedPincodes: assignedPincodes,
        }

        await userDetails.findByIdAndUpdate(deliveryMan.userId, userUpdate, { new: true });

        await DeliveryMan.findByIdAndUpdate(id, DeliveryUpdate, { new: true });

        res.status(200).json({
            Success: true,
            Message: "Delivery man updated succefully",
        });
    } catch (error) {
        return res.status(500).json({ Success: false, Message: error.message });
    }
}


// Get delivery boy profile details by associated  in delivery dashboard 
const getDeliveryManPofile = async (req, res) => {
    try {
        const userId = req.user.id;
        let profile = await DeliveryMan.findOne({ userId }).populate("userId", "fullName email phone role");

        if (!profile) {
            const user = await userDetails.findById(userId);
            if (user && user.role === "delivery") {
                // Auto-create a default placeholder profile
                await DeliveryMan.create({
                    userId,
                    vehicleDetails: {
                        vehicleType: "Bike",
                        vehicleNumber: "TBD",
                        model: "TBD"
                    },
                    licenseNumber: "TBD",
                    salary: 0,
                    commissionPerOrder: 30,
                    assignedCity: "Raipur",
                    assignedAreas: [],
                    assignedPincodes: []
                });
                profile = await DeliveryMan.findOne({ userId }).populate("userId", "fullName email phone role");
            } else {
                return res.status(404).json({ Success: false, Message: "Profile not found" });
            }
        }
        res.status(200).json({ Success: true, data: profile });
    } catch (error) {
        res.status(500).json({ Success: false, Message: error.message });
    }
};

module.exports = { addDeliveryMan, getDeliveryMan, getSingleDeliveryMan, updateDeliveryMan ,getDeliveryManPofile};