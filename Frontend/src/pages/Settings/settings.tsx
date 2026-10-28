import { fetchWithAuth } from "@/function/api";
import { supabase } from "@/supabaseClient";
import {
    AlertTriangle,
    Camera,
    CheckCircle,
    ExternalLink,
    Eye,
    EyeOff,
    FileText,
    Loader2,
    Lock,
    LogOut,
    Shield,
    Trash2,
    User,
    XCircle,
} from "lucide-react";
import React, { useEffect, useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./settings.css";

interface UserProfile {
    id?: string;
    name: string;
    username: string;
    avatar_url?: string;
}

type NotificationType = "success" | "error";

interface NotificationState {
    type: NotificationType;
    message: string;
}

export default function Settings() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState<UserProfile>({ name: "", username: "", avatar_url: "" });
    const [nameInput, setNameInput] = useState("");

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    const [profileNotice, setProfileNotice] = useState<NotificationState | null>(null);
    const [passwordNotice, setPasswordNotice] = useState<NotificationState | null>(null);
    const [deleteNotice, setDeleteNotice] = useState<NotificationState | null>(null);

    useEffect(() => {
        if (profileNotice) {
            const timer = setTimeout(() => setProfileNotice(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [profileNotice]);

    useEffect(() => {
        if (passwordNotice) {
            const timer = setTimeout(() => setPasswordNotice(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [passwordNotice]);

    useEffect(() => {
        if (deleteNotice) {
            const timer = setTimeout(() => setDeleteNotice(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [deleteNotice]);

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoadingProfile(true);
            try {
                const response = await fetchWithAuth("/panel/dashboard");
                if (!response.ok) throw new Error("Impossible de charger les informations");

                const data = await response.json();
                const userData: UserProfile = {
                    id: data.user?.id,
                    name: data.user?.name || "",
                    username: data.user?.username || "",
                    avatar_url: data.user?.avatar_url || "",
                };

                setProfile(userData);
                setNameInput(userData.name);
            } catch (err: any) {
                setProfileNotice({ type: "error", message: err.message || "Erreur." });
            } finally {
                setIsLoadingProfile(false);
            }
        };
        fetchUserData();
    }, []);

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) return;

            setIsUploadingAvatar(true);
            setProfileNotice(null);

            const fileExt = file.name.split(".").pop() || "jpg";
            const userId = profile.id || "user";
            const fileName = `${userId}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file);
            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
            const publicUrl = urlData.publicUrl;

            const response = await fetchWithAuth("/auth/me/avatar", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ avatar_url: publicUrl }),
            });

            if (!response.ok) throw new Error("Erreur lors de la mise à jour en base.");

            setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
            setProfileNotice({ type: "success", message: "Photo de profil mise à jour avec succès." });

            window.dispatchEvent(new Event("refreshPanel"));
        } catch (error) {
            console.error("Erreur upload:", error);
            setProfileNotice({ type: "error", message: "Impossible de mettre à jour l'image." });
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleProfileSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        setProfileNotice(null);
        setIsUpdatingProfile(true);

        try {
            const response = await fetchWithAuth("/auth/me", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: nameInput }),
            });
            const resData = await response.json();
            if (!response.ok) throw new Error(resData.detail || "Erreur lors de la mise à jour.");

            setProfile(prev => ({ ...prev, name: nameInput }));
            setProfileNotice({ type: "success", message: "Modifications enregistrées." });
            window.dispatchEvent(new Event("refreshPanel"));
        } catch (err: any) {
            setProfileNotice({ type: "error", message: err.message || "Erreur serveur." });
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        setPasswordNotice(null);

        if (newPassword !== confirmPassword) {
            setPasswordNotice({ type: "error", message: "Les mots de passe ne correspondent pas." });
            return;
        }
        setIsUpdatingPassword(true);

        try {
            const response = await fetchWithAuth("/auth/me/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
            });
            const resData = await response.json();
            if (!response.ok) throw new Error(resData.detail || "Erreur lors de la mise à jour.");

            setPasswordNotice({ type: "success", message: "Mot de passe mis à jour avec succès." });
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            setPasswordNotice({ type: "error", message: err.message || "Erreur serveur." });
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmationText !== "SUPPRIMER") return;
        setDeleteNotice(null);
        setIsDeletingAccount(true);

        try {
            const response = await fetchWithAuth("/auth/me", { method: "DELETE" });
            if (!response.ok) {
                const resData = await response.json();
                throw new Error(resData.detail || "Échec de la suppression.");
            }
            navigate("/login");
        } catch (err: any) {
            setDeleteNotice({ type: "error", message: err.message || "Erreur serveur." });
            setIsDeletingAccount(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetchWithAuth("/auth/logout", { method: "POST" });

            localStorage.clear();
            sessionStorage.clear();

            window.location.href = "/login";
        } catch (error) {
            console.error("Erreur de déconnexion", error);
        }
    };
    return (
        <div className="settings-container">
            <div className="settings-wrapper">
                <header className="settings-header">
                    <h1>Paramètres</h1>
                    <p>Gérez vos informations personnelles, votre sécurité et vos préférences.</p>
                </header>

                <div className="settings-grid">
                    <section className="settings-card">
                        <div className="card-header">
                            <User className="card-icon" />
                            <h2>Profil</h2>
                        </div>

                        {profileNotice && (
                            <div className={`notice-banner ${profileNotice.type}`}>
                                {profileNotice.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
                                <span>{profileNotice.message}</span>
                            </div>
                        )}

                        {isLoadingProfile ? (
                            <div className="card-loading">
                                <Loader2 className="spinner" size={24} />
                            </div>
                        ) : (
                            <form onSubmit={handleProfileSubmit} className="settings-form">
                                <div className="avatar-section">
                                    <label htmlFor="settings-avatar-upload" className="avatar-label">
                                        <input
                                            type="file"
                                            id="settings-avatar-upload"
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            onChange={handleAvatarUpload}
                                            disabled={isUploadingAvatar}
                                        />
                                        <div className="avatar-wrapper">
                                            {isUploadingAvatar ? (
                                                <Loader2 className="spinner" size={24} color="#9501d9" />
                                            ) : profile.avatar_url ? (
                                                <img src={profile.avatar_url} alt="Avatar" className="avatar-img" />
                                            ) : (
                                                <div className="avatar-placeholder">
                                                    {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                                                </div>
                                            )}
                                        </div>
                                        {!isUploadingAvatar && (
                                            <div className="avatar-hover-overlay">
                                                <Camera size={20} />
                                            </div>
                                        )}
                                    </label>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="name">Nom</label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="form-input"
                                        value={nameInput}
                                        onChange={e => setNameInput(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="username">Pseudo (non modifiable)</label>
                                    <input
                                        id="username"
                                        type="text"
                                        className="form-input read-only"
                                        value={profile.username}
                                        readOnly
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary" disabled={isUpdatingProfile}>
                                    {isUpdatingProfile ? (
                                        <Loader2 className="spinner" size={18} />
                                    ) : (
                                        "Enregistrer les modifications"
                                    )}
                                </button>
                            </form>
                        )}
                    </section>

                    <section className="settings-card">
                        <div className="card-header">
                            <Lock className="card-icon" />
                            <h2>Sécurité</h2>
                        </div>

                        {passwordNotice && (
                            <div className={`notice-banner ${passwordNotice.type}`}>
                                {passwordNotice.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
                                <span>{passwordNotice.message}</span>
                            </div>
                        )}

                        <form onSubmit={handlePasswordSubmit} className="settings-form">
                            <div className="form-group">
                                <label htmlFor="oldPassword">Ancien mot de passe</label>
                                <div className="password-input-container">
                                    <input
                                        id="oldPassword"
                                        type={showOldPassword ? "text" : "password"}
                                        className="form-input"
                                        value={oldPassword}
                                        onChange={e => setOldPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password-btn"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                    >
                                        {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="newPassword">Nouveau mot de passe</label>
                                <div className="password-input-container">
                                    <input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        className="form-input"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password-btn"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
                                <div className="password-input-container">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="form-input"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password-btn"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={isUpdatingPassword}>
                                {isUpdatingPassword ? (
                                    <Loader2 className="spinner" size={18} />
                                ) : (
                                    "Mettre à jour le mot de passe"
                                )}
                            </button>
                        </form>
                    </section>

                    <section className="settings-card full-width">
                        <div className="card-header">
                            <Shield className="card-icon" />
                            <h2>Légal & Confidentialité</h2>
                        </div>

                        <div className="legal-content">
                            <div className="ethics-banner">
                                <p>
                                    Rakib ne vend pas vos données, n'affiche aucune publicité et respecte votre vie
                                    privée.
                                </p>
                            </div>

                            <div className="legal-links">
                                <a
                                    href="/legal#mentions"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="legal-link-btn"
                                >
                                    <FileText size={18} />
                                    <span>Mentions légales</span>
                                    <ExternalLink size={14} className="external-icon" />
                                </a>
                                <a
                                    href="/legal#privacy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="legal-link-btn"
                                >
                                    <FileText size={18} />
                                    <span>Politique de confidentialité</span>
                                    <ExternalLink size={14} className="external-icon" />
                                </a>
                                <a
                                    href="/legal#cgu"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="legal-link-btn"
                                >
                                    <FileText size={18} />
                                    <span>Conditions Générales d'Utilisation</span>
                                    <ExternalLink size={14} className="external-icon" />
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* NOUVELLE SECTION : SESSION */}
                    <section className="settings-card full-width">
                        <div className="card-header">
                            <LogOut className="card-icon" />
                            <h2>Session</h2>
                        </div>
                        <div className="session-content">
                            <p className="session-text">
                                Déconnectez-vous de votre compte Rakib sur cet appareil. Vous devrez vous reconnecter
                                pour accéder à vos objectifs.
                            </p>
                            <button type="button" className="btn btn-secondary" onClick={handleLogout}>
                                <LogOut size={18} />
                                <span>Se déconnecter</span>
                            </button>
                        </div>
                    </section>

                    <section className="settings-card full-width danger-card">
                        <div className="card-header">
                            <AlertTriangle className="card-icon danger-icon" />
                            <h2 className="danger-title">Zone de Danger</h2>
                        </div>

                        <div className="danger-content">
                            <p className="danger-text">
                                La suppression de votre compte est définitive. Toutes vos données (XP, objectifs,
                                journal) seront effacées.
                            </p>
                            <button type="button" className="btn btn-danger" onClick={() => setIsDeleteModalOpen(true)}>
                                <Trash2 size={18} />
                                <span>Supprimer mon compte</span>
                            </button>
                        </div>
                    </section>
                </div>
            </div>

            {isDeleteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <div className="modal-header">
                            <AlertTriangle className="danger-icon" size={24} />
                            <h3>Confirmer la suppression</h3>
                        </div>

                        {deleteNotice && (
                            <div className={`notice-banner ${deleteNotice.type}`}>
                                <XCircle size={18} />
                                <span>{deleteNotice.message}</span>
                            </div>
                        )}

                        <p className="modal-text">
                            Cette action est irréversible. Pour confirmer, veuillez saisir <strong>SUPPRIMER</strong>{" "}
                            ci-dessous.
                        </p>

                        <input
                            type="text"
                            className="form-input modal-input"
                            placeholder="SUPPRIMER"
                            value={deleteConfirmationText}
                            onChange={e => setDeleteConfirmationText(e.target.value)}
                        />

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setDeleteConfirmationText("");
                                    setDeleteNotice(null);
                                }}
                                disabled={isDeletingAccount}
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                disabled={deleteConfirmationText !== "SUPPRIMER" || isDeletingAccount}
                                onClick={handleDeleteAccount}
                            >
                                {isDeletingAccount ? (
                                    <Loader2 className="spinner" size={18} />
                                ) : (
                                    "Confirmer la suppression"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
