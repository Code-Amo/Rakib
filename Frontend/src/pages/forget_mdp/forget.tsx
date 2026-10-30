import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./forget.css";

const API_URL = import.meta.env.VITE_API_URL || "/api";
export default function Forget() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!email.includes("@") || !email.includes(".")) {
            setErrorMessage("Veuillez saisir un e-mail valide (ex: nom@domaine.com)");
            return;
        }

        setErrorMessage("");

        try {
            const response = await fetch(`${API_URL}/auth/forget`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                navigate("/verification", { state: { email: email, flow: "forget" } });
            } else {
                setErrorMessage("L'adresse e-mail n'a pas pu être traitée.");
            }
        } catch (error) {
            console.error("Erreur serveur :", error);
            setErrorMessage("Erreur de connexion au serveur.");
        }
    };

    return (
        <div className="login-card-f">
            <div className="login-brand-f">
                <svg width="72" height="72" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 10 L52 28 L46 34 L32 21 L18 34 L12 28 Z" fill="#9501d9" />
                    <path d="M32 25 L52 43 L46 49 L32 36 L18 49 L12 43 Z" fill="#9501d9" />
                    <path d="M32 40 L52 58 L46 64 L32 51 L18 64 L12 58 Z" fill="#9501d9" />
                </svg>
                <h1 className="login-brand-text-f">Rakib</h1>
            </div>

            <form className="login-form-f" onSubmit={handleSubmit} noValidate>
                <h2 className="title-f">Récupération</h2>
                <p className="subtitle-f">Entrez votre e-mail pour recevoir un code de vérification.</p>

                <div className="form-group-f">
                    <input
                        className="input-f"
                        type="email"
                        placeholder="votre@email.com"
                        value={email}
                        onChange={e => {
                            setEmail(e.target.value);
                            if (errorMessage) setErrorMessage("");
                        }}
                    />
                    {errorMessage && <p className="error-msg-f">{errorMessage}</p>}
                </div>

                <button type="submit" className="btn-submit-f">
                    Envoyer le code
                </button>

                <button type="button" className="btn-switch-f" onClick={() => window.history.back()}>
                    Retour
                </button>
            </form>
        </div>
    );
}
