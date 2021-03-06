import React, { useState } from "react";

export const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  const toggle = () => {
    setIsShowing(!isShowing);
    return !isShowing;
  };

  return {
    isShowing,
    toggle,
  };
};
