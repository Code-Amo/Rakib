import pic from "@/assets/ichigo.jpg";
import { SquarePen, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import Add from "../Add/add";
import "./header.css";
export default function Panel() {
    const [isAddOpen, setIsAddOpen] = useState(false);
    return (
        <div className="panel-container">
            <button className="add-friends" onClick={() => setIsAddOpen(!isAddOpen)}>
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
            {isAddOpen && <Add onClose={() => setIsAddOpen(false)} />}
        </div>
    );
}
