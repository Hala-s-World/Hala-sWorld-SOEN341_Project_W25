import React from 'react';
import logo from '../media/cat.jpg';

function Banner(){
    return (
        <div className="banner">
            <img src={logo} alt="logo" style={{width: '300px', height: 'auto'}} />
            <h1>C H A T H A V E N</h1>
        </div>
    );
}

export default Banner; 