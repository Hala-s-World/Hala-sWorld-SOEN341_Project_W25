import React from 'react';
import { FaCalendarAlt, FaComment, FaHome, FaFileAlt, FaCog } from 'react-icons/fa';
import "../styles/sidebar.css"

export default function SideBar() {
    return (
        <div className="sidebar">
            <div className="user-profile">
                <div className="user-picture-container">
                    <img className="user-picture" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ0FpBg5Myb9CQ-bQpFou9BY9JXoRG6208_Q&s" />
                </div>
                <div className="user-name">
                    Shayaan
                </div>
            </div>
            <div className="elements-container">
                <div className="sidebar-element"><FaHome className='sidebar-icon'/> Home</div>
                <div className="sidebar-element"><FaComment className='sidebar-icon'/> Chat</div>
                <div className="sidebar-element"><FaCalendarAlt className='sidebar-icon'/> Calendar</div>
                <div className="sidebar-element"><FaFileAlt className='sidebar-icon'/> Documents</div>
                <div className="sidebar-element"><FaCog className='sidebar-icon'/> Settings</div>
            </div>
        </div>
    )
}