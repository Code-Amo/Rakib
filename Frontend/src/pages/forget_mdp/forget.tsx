import "./forget.css";
interface Props {
    onNavigate: (page: "login" | "register" | "forget" | "new_mdp" | "verification") => void;
}
export default function Login({ onNavigate }: Props) {
    return (
        <div className="login-card-f">
            <form className="login-form-f">
                <h1 className="title-f">Récupération</h1>
                <h2 className="subtitle-f">Nous enverrons un mail avec votre code</h2>
                <h2 className="subtitle-f">de vérification.</h2>
                <div className="form-group-f">
                    <input className="input-f" type="email" placeholder="Recevoir le code" />
                </div>
                {onNavigate && (
                    <button type="button" className="btn-submit-f" onClick={() => onNavigate("verification")}>
                        Confirmer
                    </button>
                )}
                {onNavigate && (
                    <button type="button" className="btn-switch-f" onClick={() => onNavigate("login")}>
                        Retour
                    </button>
                )}
            </form>
        </div>
    );
}
