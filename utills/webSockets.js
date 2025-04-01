import { Server } from "socket.io";

let io;

export const initializeWebSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("joinAuction", (auctionId) => {
            socket.join(auctionId);
            console.log(`User joined auction room: ${auctionId}`);
        });
        
        socket.on("leaveAuction", (auctionId) => {
            socket.leave(auctionId);
            console.log(`User left auction room: ${auctionId}`);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io has not been initialized!");
    }
    return io;
};