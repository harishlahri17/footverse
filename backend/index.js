const express = require("express");
const databseConnection = require("./databse");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

// database connection
databseConnection();
require("dotenv").config();



const app = express();
app.use(cors());
app.use(bodyParser.json());


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Attach io instance to app
app.set("io", io);

// Socket.io Real-time Event Handlers
io.on("connection", (socket) => {
    console.log(`⚡ Client connected to Socket.io: ${socket.id}`);

    // Join room based on role or orderId
    socket.on("join_room", (data) => {
        if (data.room) {
            socket.join(data.room);
            console.log(`Socket ${socket.id} joined room: ${data.room}`);
        }
    });

    // Real-time GPS location update from Delivery Boy
    socket.on("update_location", (data) => {
        // data contains: { deliveryBoyId, orderId, latitude, longitude, heading }
        console.log(`📡 GPS Update from Delivery Man ${data.deliveryManId}:`, data.latitude, data.longitude);
        
        // Broadcast to specific order room for customer live map
        if (data.orderId) {
            io.to(`order_${data.orderId}`).emit("location_broadcast", data);
        }
        
        // Broadcast to admin room for real-time monitoring dashboard
        io.to("admin_room").emit("delivery_location_update", data);
    });

    socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
});




const Port = process.env.PORT || 5000;
app.listen(Port, () => {
  // console.log("Server running on Port 5000");
   console.log(`🚀 Server running with Socket.io on Port ${Port}`);
});

app.get("/",(req,res) => {
    res.send("hello worls !");
});
 

const path = require("path");
app.use("/media/products", express.static(path.join(__dirname, "media/products"))); // serve file statically

const userRoutes = require("./routes/user"); //import routes
app.use("/api/user", userRoutes); // api for insert data in admin

const productRoutes = require("./routes/product.js"); //import routes
app.use("/api", productRoutes);//api for product

const cartRoutes = require("./routes/cart"); //import routes
app.use("/api", cartRoutes); //api for cart

const orderRoutes = require("./routes/order.js"); //import routes
app.use("/api", orderRoutes); //api for order

const deliveryManRoutes = require("./routes/deliveryMan.js"); 
app.use("/api", deliveryManRoutes);  //api for delivery man