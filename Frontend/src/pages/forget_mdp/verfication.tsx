import { useState } from "react";
import "./verification.css";
interface Props {
    email?: string;
    onNavigate: (page: "login" | "register" | "forget" | "new_mdp") => void;
}
export default function Login({ email, onNavigate }: Props) {
    const [otp, setOtp] = useState(new Array(6).fill(""));

    const handleOtpChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.nextSibling && element.value !== "") {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };
    const handleResendCode = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                alert("Un nouveau code a été envoyé !");
            }
        } catch (error) {
            console.error("Erreur renvoi :", error);
        }
    };
    return (
        <div className="login-card-verfication">
            <form className="login-form-verfication">
                <h1 className="title-verfication">Récupération</h1>
                <p className="subtitle-verification">
                    Code envoyé à <span className="email-highlight">{email || "votre e-mail"}</span>
                </p>
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
                            onFocus={e => e.target.select()}
                        />
                    ))}
                </div>
                <div className="resend-box">
                    <span>Vous n'avez rien reçu ? </span>
                    <button type="button" className="btn-resend" onClick={handleResendCode}>
                        Renvoyer le code
                    </button>
                </div>
                {onNavigate && (
                    <button type="button" className="btn-submit-verfication" onClick={() => onNavigate("new_mdp")}>
                        Confirmer
                    </button>
                )}
                {onNavigate && (
                    <button type="button" className="btn-switch-verfication" onClick={() => onNavigate("forget")}>
                        Retour
                    </button>
                )}
            </form>
        </div>
    );
}
