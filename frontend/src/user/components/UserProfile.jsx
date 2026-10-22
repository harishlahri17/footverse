import React, { useEffect, useState } from 'react'
import { BaseUrl } from '../../axiosInstance';
import { useAuth } from '../../store/auth';
import { toast } from "react-toastify";

export default function UserProfile({ showProfileModal, setShowProfileModal }) {

    const [activeTab, setActiveTab] = useState("details");
    const [user, setUser] = useState(null);
    const { token } = useAuth();

    // Fetch user Profile data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await BaseUrl.get("/user/user-profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(data.user);

            } catch (error) {
                console.error("Error fetching student profile:", error.response?.data || error.message);
            }
        }
        if (token) fetchUser();
    }, [token])

    // Update user profile
    const handleEditInput = (e) => {
        const { id, value } = e.target;
        setUser((prev) => ({ ...prev, [id]: value }));
    }

    const updateProfile = async (e) => {
        e.preventDefault();
        try {
            const { data } = await BaseUrl.put("/user/update-profile", user,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (data.Success) {
                setUser(data.user);
                toast.success(data.Message);
                setActiveTab("details");
            }
        } catch (error) {
            toast.error(error?.response?.data?.Message || "Something went wrong");
        }
    }

    // Edit Password
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const handlePasswordInput = (e) => {
        const { id, value } = e.target;
        setPasswordData({ ...passwordData, [id]: value });
    };

    const [passwordVerified, setPasswordVerified] = useState(false);

    const verifyPassword = async () => {
        try {
            const { data } = await BaseUrl.post("/user/verify-password", { currentPassword: passwordData.currentPassword },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (data.Success) {
                toast.success(data.Message);
                setPasswordVerified(true);
            }
        } catch (error) {
            toast.error(error?.response?.data?.Message || "Verification failed");
        }
    };

    const updatePassword = async (e) => {
        e.preventDefault();
        try {
            const { data } = await BaseUrl.put("/user/update-password",
                {
                    newPassword: passwordData.newPassword,
                    confirmPassword: passwordData.confirmPassword
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (data.Success) {
                toast.success(data.Message);
                setPasswordVerified(false);
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
                setActiveTab("details");
            }
        } catch (error) {
            toast.error(error?.response?.data?.Message || "Something went wrong");
        }
    };

    const handleCloseModal = () => {
        // reset password verify
        setPasswordVerified(false);
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
        setActiveTab("details");
        setShowProfileModal(false);
    };

    return (
        <>
            {showProfileModal && (
                <div
                    className="custom-modal-overlay"
                    onClick={() => setShowProfileModal(false)}
                >
                    <div
                        className="custom-profile-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header-custom">
                            <h4>My Profile</h4>
                            <button
                                className="close-btn"
                                onClick={handleCloseModal}
                            >
                                ×
                            </button>
                        </div>
                        <div className="profile-toggle-buttons">
                            <button
                                className={activeTab === "details" ? "active-tab" : ""}
                                onClick={() => setActiveTab("details")}
                            >
                                Profile Details
                            </button>
                            <button
                                className={activeTab === "edit" ? "active-tab" : ""}
                                onClick={() => setActiveTab("edit")}
                            >
                                Edit Profile
                            </button>
                            <button
                                className={activeTab === "password" ? "active-tab" : ""}
                                onClick={() => setActiveTab("password")}
                            >
                                Change Password
                            </button>
                        </div>

                        <div className="profile-content">
                            {activeTab === "details" && (
                                <div>
                                    <h5>Profile Details</h5>
                                    <p><strong>Name:</strong> {user?.fullName}</p>
                                    <p><strong>Email:</strong> {user?.email}</p>
                                    <p><strong>Phone:</strong> {user?.phone}</p>
                                    <p><strong>Address:</strong> {user?.area}, Post: {user?.postOffice},
                                        {user?.city}, {user?.district}, {user?.state} {user?.pinCode}
                                    </p>
                                </div>
                            )}

                            {activeTab === "edit" && (

                                <form onSubmit={updateProfile}>
                                    <div className="row">
                                        <div className="col-sm-12 col-lg-6 mb-3">
                                            <label className="form-label fw-semibold">Full Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id='fullName'
                                                value={user?.fullName || ""}
                                                onChange={handleEditInput}
                                                placeholder="Enter full name"
                                                required
                                            />
                                        </div>
                                        <div className="col-sm-12 col-lg-6 mb-3">
                                            <label className="form-label fw-semibold">Email Address</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id='email'
                                                value={user?.email || ""}
                                                onChange={handleEditInput}
                                                placeholder="Enter email address"
                                                required
                                            />
                                        </div>
                                        <div className="col-sm-12 col-lg-6 mb-3">
                                            <label className="form-label fw-semibold">Phone Number</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id='phone'
                                                value={user?.phone || ""}
                                                onChange={handleEditInput}
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                        <div className="col-sm-12 col-lg-6 mb-3">
                                            <label className="form-label fw-semibold">Area / Apartment / Street / Landmark</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id='area'
                                                value={user?.area || ""}
                                                onChange={handleEditInput}
                                                placeholder="House/Flat No., Building, Street, Landmark"
                                            />
                                        </div>
                                        <div className="col-sm-12 col-lg-6 mb-3">
                                            <label className="form-label fw-semibold">Post Office</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id='postOffice'
                                                value={user?.postOffice || ""}
                                                onChange={handleEditInput}
                                                placeholder="Enter Post Office"
                                            />
                                        </div>
                                        <div className="col-sm-12 col-lg-6 mb-3">
                                            <label className="form-label fw-semibold">City / Town</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id='city'
                                                value={user?.city || ""}
                                                onChange={handleEditInput}
                                                placeholder="Enter City / Town"
                                            />
                                        </div>
                                        <div className="col-sm-12 col-lg-6 mb-3">
                                            <label className="form-label fw-semibold">District</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id='district'
                                                value={user?.district || ""}
                                                onChange={handleEditInput}
                                                placeholder="Enter District"
                                            />
                                        </div>
                                        <div className="col-sm-12 col-lg-6 mb-3">
                                            <label className="form-label fw-semibold">State</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id='state'
                                                value={user?.state || ""}
                                                onChange={handleEditInput}
                                                placeholder="Enter State"
                                            />
                                        </div>
                                        <div className="col-sm-12 col-lg-6 mb-3">
                                            <label className="form-label fw-semibold">PIN Code</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id='pinCode'
                                                value={user?.pinCode || ""}
                                                onChange={handleEditInput}
                                                placeholder="Enter 6-digit PIN code"
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-dark mt-3 w-100">Save Changes</button>
                                </form>
                            )}

                            {activeTab === "password" && (
                                <div>
                                    {!passwordVerified ? (
                                        <form onSubmit={verifyPassword}>
                                            <div className="mb-3">
                                                <label>Current Password</label>
                                                <input
                                                    type="password"
                                                    id="currentPassword"
                                                    className="form-control"
                                                    value={passwordData.currentPassword}
                                                    onChange={handlePasswordInput}
                                                />
                                            </div>
                                            <button className="btn btn-dark w-100" type='submit'>Verify Password</button>
                                        </form>
                                    ) : (
                                        <form onSubmit=''>
                                            <div className="mb-3">
                                                <label>New Password</label>
                                                <input
                                                    type="password"
                                                    id="newPassword"
                                                    className="form-control"
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordInput}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label>Confirm Password</label>
                                                <input
                                                    type="password"
                                                    id="confirmPassword"
                                                    className="form-control"
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordInput}
                                                />
                                            </div>
                                            <button className="btn btn-success w-100" type="submit">Update Password</button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
