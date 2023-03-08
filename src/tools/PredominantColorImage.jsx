import React, { useState, useEffect } from "react";
import ColorThief from "colorthief";

function PredominantColorImage({ src }) {
  const [backgroundColor, setBackgroundColor] = useState("white");

  function handleImageLoad() {
    const colorThief = new ColorThief();
    const image = document.getElementById("background-image");
    const color = colorThief.getColor(image);
    setBackgroundColor(`rgb(${color.join(",")})`);
  }


  return (
    <div
      style={{
        backgroundImage: `url(${src})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor,
        width: "100vw",
        height: "100vh",
        display: "flex",
        backgroundSize: "contain",
        justifyContent: "center",
        alignItems: "center"
        
      }}
    >
      <img
        src={src}
        alt=""
        onLoad={handleImageLoad}
        id="background-image"
        style={{ display: "none" }}
        crossOrigin="anonymous"
      />
    </div>
  );
}

export default PredominantColorImage;
