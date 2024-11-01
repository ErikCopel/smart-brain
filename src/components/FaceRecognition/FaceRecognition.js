import React from "react";

const FaceRecognition = ({imageURL}) => {
    return (
        <div className="center pa3">
            <img src= {imageURL}
                    width="500px"
                    height="auto"
                    />
        </div>
    );
}

export default FaceRecognition;