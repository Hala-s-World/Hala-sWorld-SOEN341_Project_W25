import { useState } from "react";
import AddChannel from "../assets/components/AddChannel";
import InvitesList from "../assets/components/InvitesList";


const DashboardHome = () => {

        const [isModalOpen, setIsModalOpen] = useState(false);
        const toggleModal = () => {
            setIsModalOpen(!isModalOpen);
        };
    

    return (
        <div className="main">
            <div className="channels-container">
            <div className="add-channel" onClick={toggleModal}>Add a private channel</div>
                {isModalOpen && (
                    <div className="modal-overlay" onClick={toggleModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3>Add New Channel</h3>
                            <AddChannel />
                            <button onClick={toggleModal} className="close-btn">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
                <InvitesList/>
            </div>
        </div>
    )
}

export default DashboardHome;