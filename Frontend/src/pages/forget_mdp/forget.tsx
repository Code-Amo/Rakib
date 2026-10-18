import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./forget.css";

export default function Forget() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email.includes("@") || !email.includes(".")) {
            setErrorMessage("Veuillez saisir un e-mail valide (ex: nom@domaine.com)");
            return;
        }

        setErrorMessage("");

        try {
            const response = await fetch("http://127.0.0.1:8000/auth/forget", {
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
            <form className="login-form-f" onSubmit={handleSubmit} noValidate>
                <h1 className="title-f">Récupération</h1>
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
