const socketIo = require("socket.io");
const userModel = require("./src/models/user.model");
const captainModel = require("./src/models/captain.model");
const rideModel = require("./src/models/ride.model");

let io;

// Initialize Socket.IO and attach it to the HTTP server
function initializeSocket(server) {
  io = socketIo(server, {
    // Allow frontend clients to connect to the Socket.IO server
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Listen for new client connections
  io.on("connection", (socket) => {
    // Listen for a client joining the Socket.IO connection

    socket.on("join", async (data) => {
      // Convert JSON string to object if necessary
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (error) {
          console.log("❌ Invalid JSON:", error.message);
          return;
        }
      }

      if (!data || typeof data !== "object") {
        console.log("❌ Invalid join data");
        return;
      }

      const { userId, userType } = data;

      if (!userId || !userType) {
        console.log("Missing userId or userType");
        return;
      }

      try {
        if (userType === "user") {
          const user = await userModel.findByIdAndUpdate(
            userId,
            { socketId: socket.id },
            { returnDocument: "after" },
          );

          if (!user) {
            console.log("User not found:", userId);
            return;
          }

          console.log("[Socket] User registered:", {
            userId: user._id.toString(),
            savedSocketId: user.socketId,
            currentSocketId: socket.id,
          });

          console.log("User socket ID updated");
        } else if (userType === "captain") {
          const captain = await captainModel.findByIdAndUpdate(
            userId,
            { socketId: socket.id },
            { returnDocument: "after" },
          );

          if (!captain) {
            console.log("Captain not found:", userId);
            return;
          }

          console.log("Captain socket ID updated");
        } else {
          console.log("Invalid userType:", userType);
        }
      } catch (error) {
        console.error("Error updating socket ID:", error);
      }
    });

    socket.on("update-location-captain", async (data) => {
      try {
        const payload = typeof data === "string" ? JSON.parse(data) : data;
        const { userId, location } = payload || {};

        const latitude = Number(
          location?.ltd ?? location?.lat ?? location?.latitude,
        );
        const longitude = Number(
          location?.lng ?? location?.lon ?? location?.longitude,
        );

        if (
          !userId ||
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude) ||
          latitude < -90 ||
          latitude > 90 ||
          longitude < -180 ||
          longitude > 180
        ) {
          return socket.emit("error", {
            message: "Invalid captain location payload.",
          });
        }

        const updatedCaptain = await captainModel.findByIdAndUpdate(
          userId,
          {
            location: {
              type: "Point",
              coordinates: [longitude, latitude],
              ltd: latitude,
              lng: longitude,
            },
          },
          { returnDocument: "after" },
        );

        if (!updatedCaptain) {
          return socket.emit("error", {
            message: "Captain not found.",
          });
        }

        // Keep the acknowledgement to the captain
        socket.emit("captain-location-updated", {
          success: true,
          location: {
            ltd: latitude,
            lng: longitude,
          },
        });

        // Find this captain's currently ongoing ride
        const activeRide = await rideModel
          .findOne({
            captain: userId,
            status: "ongoing",
          })
          .populate("user", "socketId");

        console.log("[Tracking] Captain ID:", userId);
        console.log("[Tracking] Active ride found:", !!activeRide);
        console.log("[Tracking] Passenger socket:", activeRide?.user?.socketId);

        if (activeRide?.user?.socketId) {
          console.log("[Tracking] Emitting location to passenger:", {
            socketId: activeRide.user.socketId,
            latitude,
            longitude,
          });

          console.log(
            "[Tracking] Connected passenger socket:",
            io.sockets.sockets.has(activeRide.user.socketId),
          );

          const passengerSocket = io.sockets.sockets.get(
            activeRide.user.socketId,
          );

          console.log("[Tracking] Event name:", "captain-location-update");
          console.log("[Tracking] Passenger socket exists:", !!passengerSocket);
          console.log(
            "[Tracking] Passenger socket connected:",
            passengerSocket?.connected,
          );

          if (passengerSocket?.connected) {
            passengerSocket.emit("captain-location-update", {
              captainId: userId,
              location: { ltd: latitude, lng: longitude },
            });

            console.log("[Tracking] Location event emitted directly");
          }
        }
      } catch (error) {
        console.error("Error updating captain location:", error.message);
        socket.emit("error", {
          message: "Unable to update captain location.",
        });
      }
    });

    // Listen for when a client disconnects
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

// Send a message/event to a specific connected client using their socket ID
function sendMessageToSocketId(socketId, message, eventName = "message") {
  if (io) {
    // Target the specific socket and emit the provided event name
    io.to(socketId).emit(eventName, message);
  } else {
    // Socket.IO must be initialized before sending messages
    console.log("Socket.io not initialized");
  }
}

module.exports = { initializeSocket, sendMessageToSocketId };
