import React from 'react';
import Tilt from 'react-parallax-tilt';
import Brain from './Brain.png';
import './Logo.css';

const Logo = () => {
    return (
			<div className = "ma4 mt0">
					<Tilt className="parallax-effect fb w-10 br2" perspective={500}>
						<div className="inner-element pa4">
							<img style={{paddingTop:'5px'}} alt='logo' src={Brain} />
						</div>
					</Tilt>
			</div>
    )
}

export default Logo;