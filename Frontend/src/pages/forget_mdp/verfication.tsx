import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./verification.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Verification() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";
    const flow = location.state?.flow || "register";

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleOtpChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.value !== "" && element.nextSibling) {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevSibling = e.currentTarget.previousSibling as HTMLInputElement;
            if (prevSibling) prevSibling.focus();
        }
    };

    const handleResendCode = async () => {
        setError(null);
        setSuccess(null);
        try {
            const endpoint = flow === "forget" ? `${API_URL}/auth/forget` : `${API_URL}/auth/resend-verification`;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setSuccess("Un nouveau code vous a été envoyé !");
                setTimeout(() => setSuccess(null), 4000);
            } else {
                setError("Impossible de renvoyer le code.");
            }
        } catch (error) {
            console.error("Erreur renvoi :", error);
            setError("Erreur serveur.");
        }
    };

    const handleVerifyCode = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        const code = otp.join("");

        if (code.length < 6) {
            setError("Veuillez remplir les 6 chiffres.");
            return;
        }

        const endpoint = flow === "forget" ? `${API_URL}/auth/verify-reset` : `${API_URL}/auth/verify-register`;

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code }),
            });
            const data = await response.json();

            if (response.ok) {
                if (flow === "forget") {
                    navigate("/new-mdp", { state: { email: email, reset_token: data.reset_token } });
                } else {
                    navigate("/home");
                }
            } else {
                setError("Code invalide ou expiré.");
            }
        } catch (error) {
            setError("Erreur de connexion au serveur.");
        }
    };

    return (
        <div className="login-card-verification">
            <div className="login-brand-verification">
                <svg width="72" height="72" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 10 L52 28 L46 34 L32 21 L18 34 L12 28 Z" fill="#9501d9" />
                    <path d="M32 25 L52 43 L46 49 L32 36 L18 49 L12 43 Z" fill="#9501d9" />
                    <path d="M32 40 L52 58 L46 64 L32 51 L18 64 L12 58 Z" fill="#9501d9" />
                </svg>
                <h1 className="login-brand-text-verification">Rakib</h1>
            </div>

            <form className="login-form-verification" onSubmit={handleVerifyCode}>
                <h2 className="title-verification">Vérification</h2>
                <p className="subtitle-verification">
                    Code envoyé à <span className="email-highlight">{email || "votre e-mail"}</span>
                </p>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <div className="otp-container">
                    {otp.map((data, index) => (
                        <input
                            className="input-otp"
                            type="text"
                            name="otp"
                            maxLength={1}
                            key={index}
                            value={data}
                            onChange={e => handleOtpChange(e.target, index)}
                            onKeyDown={e => handleOtpKeyDown(e, index)}
                            onFocus={e => e.target.select()}
                        />
                    ))}
                </div>

                <div className="resend-box">
                    <span>Vous n'avez rien reçu ?</span>
                    <button type="button" className="btn-resend" onClick={handleResendCode}>
                        Renvoyer le code
                    </button>
                </div>

                <button type="submit" className="btn-submit-verification">
                    Confirmer
                </button>

                <button type="button" className="btn-switch-verification" onClick={() => window.history.back()}>
                    Retour
                </button>
            </form>
        </div>
    );
}
