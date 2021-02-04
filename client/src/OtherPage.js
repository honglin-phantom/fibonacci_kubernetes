import React from 'react'; 
import { Link } from 'react-router-dom';

// export functional component 
const OtherPage = () => {
    // jsx script syntax 
    return (
        <div>
            I'm some other page 
            <Link to="/">
                Home Page
            </Link>
        </div>
    ); 
}

export default OtherPage; 