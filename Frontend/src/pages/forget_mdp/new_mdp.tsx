import "./new_mdp.css";
interface Props {
    onNavigate: (page: "login" | "register" | "forget") => void;
}
export default function Login({ onNavigate }: Props) {
    return (
        <div className="login-card-new_mdp">
            <form className="login-form-new_mdp">
                <h1 className="title-new_mdp">Récupération</h1>
                <p className="subtitle-new_mdp">Définissez votre nouveau mot de passe.</p>
                <div className="form-group-new_mdp">
                    <input className="input-new_mdp" type="password" placeholder="Nouveau mot de passe " />
                </div>
                <div className="form-group">
                    <input
                        className="input-new_mdp"
                        type="password"
                        placeholder="Confirmer votre nouveau mot de passe"
                    />
                </div>
                {onNavigate && (
                    <button type="button" className="btn-submit-new_mdp" onClick={() => onNavigate("login")}>
                        Confirmer
                    </button>
                )}
                {onNavigate && (
                    <button type="button" className="btn-switch-new_mdp" onClick={() => onNavigate("forget")}>
                        Retour
                    </button>
                )}
            </form>
        </div>
    );
}
