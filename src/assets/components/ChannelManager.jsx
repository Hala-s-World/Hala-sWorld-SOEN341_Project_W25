import React from "react";
import { FaPlus } from "react-icons/fa";
import { useActiveComponent } from "../../helper/activeComponent";
import "../styles/channelmanager.css"

export default function ChannelManager() {


    const {setActiveComponent} = useActiveComponent()

    const handleClick = (componentName) => {
        setActiveComponent(componentName);
    }


    return (
        <div className="sidebar-element" onClick={() => handleClick("Channel-Manager")}>
            {<div>
                <FaPlus className='sidebar-icon' />Add A channel
            </div>}
        </div>
    )
}