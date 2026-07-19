// src/modules/chat/io.js
const Message = require("./chat.model");

const initializeChatSockets = async (io) => {
    console.log("🚀 Socket.io Layer: Event listeners registered successfully!");
    io.on('connection', (socket) => {
        console.log(`Socket Connected: ${socket.id}`);

        // 1 Entering a department Chat Room
        socket.on('join_dept', ({ departmentId, user }) => {
            if (!departmentId) return;

            socket.join(departmentId)
            console.log(`${user.name} joined room: ${departmentId}`)
        })

        //2. Handing new message
        socket.on('send_message', async (data) => {
            console.log(`Message from ${socket.id}:`, data);
            const { departmentId, senderType, senderId, senderName, message } = data;
            if (!departmentId || !message.trim()) return;

            try {
                // STEP: 1
                // save the message
                const newMsg = await Message.create({
                    departmentId,
                    senderType,
                    senderId,
                    senderName,
                    message,
                })

                // STEP: 2 Broadcast the message in a department
                io.to(departmentId).emit('receive_message', newMsg);
            } catch (error) {
                console.error('Error saving or broadcasting socket message:', error);
            }
        });

        socket.on("typing", ({departmentId, username, isTyping}) => {
            if (!departmentId) return;
            socket.to(departmentId).emit('user_typing', { username, isTyping })
        })

        socket.on('leave_dept', ({ departmentId }) => {
            if (!departmentId) return;
            socket.leave(departmentId);
            console.log(`🚪 Socket left room: ${departmentId}`);
        })
        socket.on('disconnect', () => {
            console.log(`🛑 Socket disconnected: ${socket.id}`);
        });
    })
}

module.exports = initializeChatSockets;
