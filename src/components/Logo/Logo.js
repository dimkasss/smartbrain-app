import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
    return (
        <div className='ma4 mt0' style={{display: 'flex', justifyContent: 'left'}}>
            <Tilt className='pa3'>
                <div style={{ height: '200px'}} className='pa3 bg'>
                    <img src={brain} alt='brain' width='150px'></img>
                </div>
            </Tilt>
        </div>
    )
}

export default Logo;