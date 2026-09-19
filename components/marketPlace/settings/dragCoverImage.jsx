import React, { useCallback, useState } from "react";

export const useDragCoverImage = (params = {}) => {
  const [imagePosition, setImagePosition] = useState({
    lastY: 0,
    y: params.initialY ?? "0px",
  });

  const handleMouseMove = useCallback((e) => {
    setImagePosition((prev) => {
      let diff = e.clientY - prev.lastY;

      let prevY;

      try {
        prevY = parseInt(prev.y.replace("px", ""));
      } catch {
        prevY = 0;
      }
      const newY = prevY + diff;
      return {
        ...prev,
        lastY: e.clientY,
        // newY > 0 ? 0: newY >= -500 ? -500 : newY
        y: `${newY > 0 ? 0 : newY <= -300 ? -300 : newY}px`,
      };
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (e) => {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "move";
      document.body.style.userSelect = "none";
      setImagePosition((prev) => ({
        ...prev,
        lastY: e.clientY,
      }));
    },
    [handleMouseMove, handleMouseUp]
  );

  const handleSetImagePosition = useCallback((y) => {
    setImagePosition((prev) => ({
      ...prev,
      y,
    }));
  }, []);

  return {
    imagePosition: imagePosition.y,
    setImagePosition: handleSetImagePosition,
    handleMouseDown,
  };
};
