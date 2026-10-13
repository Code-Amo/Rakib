import pic from "@/assets/ichigo.jpg";
import { SquarePen, UserRoundPlus } from "lucide-react";
import "./header.css";
export default function Panel() {
    return (
        <div className="panel-container">
            <button className="add-friends">
                <UserRoundPlus />
            </button>
            <button className="modify-button">
                <SquarePen />
            </button>
            <div className="profile-container">
                <div className="profile-wrapper">
                    <button className="profile-image">
                        <img src={pic} alt="Photo de profil" className="profil-pic" />
                    </button>
                    <span className="online"></span>
                </div>
                <h1 className="username">Keisei</h1>
                <p className="name">Momo</p>
            </div>
            <button className="trophy">Trophées</button>
        </div>
    );
}
