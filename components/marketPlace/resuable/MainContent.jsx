import React from "react";

function MainContent({ heading, subheading, content }) {
  return (
    <div className="collectionBox">
      <div className="nodataDetail created">
        <h4>{heading}</h4>
        <p>{subheading}</p>
        {content}
      </div>
    </div>
  );
}

export default MainContent;
