import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../store/auth';

const SocketContext = createContext({
    socket: null,
    online: false,
    joinOrderRoom: () => { },
    leaveOrderRoom: () => { },
    updateLocation: () => { }
});

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [online, setOnline] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const newSocket = io('http://localhost:5000', {
                autoConnect: true,
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5,
            });

            setSocket(newSocket);
            setOnline(true);

            // Join appropriate rooms based on user role
            if (user.role === 'admin') {
                newSocket.emit('join_room', { room: 'admin_room' });
            } else if (user.role === 'delivery') {
                newSocket.emit('join_room', { room: `delivery_${user.id}` });
            } else if (user.role === 'user') {
                // Customer will join order-specific rooms when tracking
            }

            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
                setOnline(true);
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
                setOnline(false);
            });

            return () => {
                newSocket.disconnect();
                setSocket(null);
                setOnline(false);
            };
        }
    }, [user]);

    // Join order room for tracking
    const joinOrderRoom = (orderId) => {
        if (socket) {
            socket.emit('join_room', { room: `order_${orderId}` });
        }
    };

    // Leave order room
    const leaveOrderRoom = (orderId) => {
        if (socket) {
            socket.emit('leave_room', { room: `order_${orderId}` });
        }
    };

    // Update delivery boy location
    const updateLocation = (data) => {
        if (socket) {
            socket.emit('update_location', data);
        }
    };

    const value = {
        socket,
        online,
        joinOrderRoom,
        leaveOrderRoom,
        updateLocation,
    };

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
