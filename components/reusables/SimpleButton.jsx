import React from "react";

const SimpleButton = ({
  color,
  text,
  onClick,
  maxWidth,
  backgroundColor,
  padding,
  disabled,
  outlineColor,
  className,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`SimpleButton ${!disabled && "btnHoverEffectOutline"} ${
        className ? className : ""
      }`}
      onClick={onClick}
      style={{
        color: color,
        backgroundColor: backgroundColor,
        outlineColor: outlineColor,
        //  borderRadius: radius,
        //  height,
        maxWidth: maxWidth,
        padding: padding,
        position: "relative",
        zIndex: 5,
        cursor: "pointer",
      }}
    >
      {text}
    </button>
  );
};

export default SimpleButton;
