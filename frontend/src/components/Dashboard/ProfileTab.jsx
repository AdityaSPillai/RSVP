import { useState, useEffect } from "react";
import "../../styles/ProfileTab.css";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const ProfileTab = () => {
    const { auth, updateAuthUser } = useAuth();
    const user = auth.user;

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        location: {
            state: "",
            country: "",
            pincode: ""
        }
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(user?.profileImage || null);

    const [loading, setLoading] = useState(false);
    const [isImageDirty, setIsImageDirty] = useState(false);
    const [removeProfileImage, setRemoveProfileImage] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
                location: {
                    state: user.location?.state || "",
                    country: user.location?.country || "",
                    pincode: user.location?.pincode || ""
                }
            });

            setImagePreview(user.profileImage || null);
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("location.")) {
            const key = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                location: {
                    ...prev.location,
                    [key]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setProfileImage(file);
        setImagePreview(URL.createObjectURL(file));

        setRemoveProfileImage(false);
        setIsImageDirty(true);
    };

    const handleRemoveImage = () => {
        setProfileImage(null);
        setImagePreview(null);

        setRemoveProfileImage(true);
        setIsImageDirty(true);
    };

    const handleProfileUpdate = async () => {
        try {
            setLoading(true);

            const data = new FormData();
            data.append("name", formData.name);
            data.append("phone", formData.phone);
            data.append("location[state]", formData.location.state);
            data.append("location[country]", formData.location.country);
            data.append("location[pincode]", formData.location.pincode);

            if (removeProfileImage) {
                data.append("profileImage", "");
            } else if (profileImage) {
                data.append("profileImage", profileImage);
            }

            const res = await api.put("/auth/profile/update", data);

            if (res.data.success) {
                updateAuthUser(res.data.user);
                alert("Profile updated successfully");
                setIsImageDirty(false);
                setRemoveProfileImage(false);
                setProfileImage(null);
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords do not match");
        }
        setLoading(true);

        try {
            const res = await api.put("/auth/profile/reset-password", {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            if (!res.data.success) {
                alert(res.data.message);
                console.log(res);
                return;
            }
            alert("Password updated successfully");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (error) {
            console.log(error);
            alert(error?.response?.data?.message || "Failed to update password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container" >
            <h2 className="profile-heading" > My Profile </h2>

            {/* AVATAR */}
            <div className="avatar-section" >
                <img
                    src={
                        imagePreview ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user?.name || "User"
                        )}`
                    }
                    alt="Profile"
                    className="profile-avatar"
                />

                <div className="avatar-actions-inline">
                    <label className="avatar-upload-btn">
                        Change Photo
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                        />
                    </label>

                    <button
                        type="button"
                        className="remove-image-btn"
                        onClick={handleRemoveImage}
                        disabled={!imagePreview}
                    >
                        Remove Photo
                    </button>

                    {isImageDirty && (
                        <button
                            type="button"
                            className="profile-btn-save-image"
                            onClick={handleProfileUpdate}
                            disabled={loading}
                        >
                            Save
                        </button>
                    )}
                </div>
            </div>

            {/* PROFILE INFO */}
            <div className="profile-card-wrapper">
                <div className="profile-card" >
                    <h3>Personal Information </h3>

                    < input
                        className="profile-input"
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <input
                        className="profile-input disabled"
                        type="email"
                        value={user?.email || ""
                        }
                        disabled
                    />

                    <input
                        className="profile-input"
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    <div className="location-input-group">
                        <input
                            className="profile-input"
                            type="text"
                            name="location.state"
                            placeholder="State"
                            value={formData.location.state}
                            onChange={handleChange}
                        />

                        <input
                            className="profile-input"
                            type="text"
                            name="location.country"
                            placeholder="Country"
                            value={formData.location.country}
                            onChange={handleChange}
                        />

                        <input
                            className="profile-input"
                            type="number"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            name="location.pincode"
                            placeholder="Pincode"
                            value={formData.location.pincode}
                            onChange={handleChange}
                            maxLength={6}
                        />
                    </div>

                    <button
                        className="profile-btn-primary"
                        onClick={handleProfileUpdate}
                        disabled={loading}
                    >
                        Save Changes
                    </button>
                </div>

                {/* PASSWORD RESET */}
                <div className="profile-card" >
                    <h3>Reset Password </h3>
                    <form>
                        < input
                            className="profile-input"
                            type="password"
                            placeholder="Current Password"
                            autoComplete="current-password"
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                                setPasswordData(prev => ({
                                    ...prev,
                                    currentPassword: e.target.value
                                }))
                            }
                        />

                        < input
                            className="profile-input"
                            type="password"
                            placeholder="New Password"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                                setPasswordData(prev => ({
                                    ...prev,
                                    newPassword: e.target.value
                                }))
                            }
                        />

                        < input
                            className="profile-input"
                            type="password"
                            placeholder="Confirm New Password"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                                setPasswordData(prev => ({
                                    ...prev,
                                    confirmPassword: e.target.value
                                }))
                            }
                        />

                        < button
                            className="profile-btn-secondary"
                            onClick={handlePasswordReset}
                            disabled={loading}
                        >
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;