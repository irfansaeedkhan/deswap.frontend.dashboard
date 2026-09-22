import React from "react";

/** White on #E44757 is ~3.9:1 (fails WCAG AA). #D63C4C is ~4.56:1. */
const ACCESSIBLE_BRAND_RED = "#D63C4C";

function accessibleBackground(backgroundColor) {
  if (typeof backgroundColor !== "string") return backgroundColor;
  if (backgroundColor.replace(/\s/g, "").toLowerCase() === "#e44757") {
    return ACCESSIBLE_BRAND_RED;
  }
  return backgroundColor;
}

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
  fontSize,
  fontWeight,
}) => {
  const resolvedBackground = accessibleBackground(backgroundColor);
  const resolvedColor =
    color ||
    (resolvedBackground === ACCESSIBLE_BRAND_RED ? "#FFFFFF" : undefined);

  return (
    <button
      type="button"
      disabled={disabled}
      className={`SimpleButton ${!disabled && "btnHoverEffectOutline"} ${
        className ? className : ""
      }`}
      onClick={onClick}
      style={{
        color: resolvedColor,
        backgroundColor: resolvedBackground,
        outlineColor: outlineColor,
        maxWidth: maxWidth,
        padding: padding,
        position: "relative",
        zIndex: 5,
        cursor: "pointer",
        fontSize: fontSize,
        fontWeight: fontWeight,
      }}
    >
      {text}
    </button>
  );
};

export default SimpleButton;
