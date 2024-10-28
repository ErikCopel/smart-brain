import React from "react";


const Navigation = ({ onRouteChange, isSignedIn }) => {
    return (
        <nav style={{display: "flex", justifyContent: "flex-end"}}>
            <p>Sign out</p>
        </nav>
    );
}

export default Navigation;