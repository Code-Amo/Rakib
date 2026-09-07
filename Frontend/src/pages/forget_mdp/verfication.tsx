import "./verification.css";
interface Props {
    onNavigate: (page: "login" | "register" | "forget" | "new_mdp") => void;
}
export default function Login({ onNavigate }: Props) {
    return (
        <div className="login-card-verfication">
            <form className="login-form-verfication">
                <h1 className="title-verfication">Récupération</h1>
                <h2 className="subtitle-verfication">Entrez le code reçu.</h2>
                <h2 className="subtitle-verfication">Vérifier vos spams ou votre e-mail.</h2>
                <div className="form-group-verfication">
                    <input className="input-verification" type="password" placeholder="123456" />
                </div>
                {onNavigate && (
                    <button type="button" className="btn-submit-verfication" onClick={() => onNavigate("new_mdp")}>
                        Confirmer
                    </button>
                )}
                {onNavigate && (
                    <button type="button" className="btn-switch-verfication" onClick={() => onNavigate("forget")}>
                        Changer l'e-mail
                    </button>
                )}
            </form>
        </div>
    );
}
