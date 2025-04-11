import { useState } from "react";
import AddChannel from "../assets/components/AddChannel";
import InvitesList from "../assets/components/InvitesList";
import "../assets/styles/dashboard.css";
import "../assets/styles/channelmanager.css";

const DashboardHome = () => {

        const [isModalOpen, setIsModalOpen] = useState(false);
        const toggleModal = () => {
            setIsModalOpen(!isModalOpen);
        };
    

    return (
        <div className="main">
            <div className="channels-container">
            <div className="channels-title-your-channels">Invitations</div>
                <InvitesList/>
            </div>
        </div>
    )
}

export default DashboardHome;