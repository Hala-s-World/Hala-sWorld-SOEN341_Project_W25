import React from 'react';
import logo from '../media/cat.jpg';

function Banner(){
    return (
        <div className="banner">
            <img src={logo} alt="logo" style={{width: '150px', height: 'auto'}} />
            <h1 className="banner-title">C H A T H A V E N</h1>
        </div>
    );
}

export default Banner; 