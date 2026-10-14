import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from '../../admin/component/mui/AdminLayout';

export default function AdminProtectedRoutes({ children }) {

    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" />
    }

    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.role !== "admin") {
        return <Navigate to="/track-order" />
    }
    return <AdminLayout>{children}</AdminLayout>;

}