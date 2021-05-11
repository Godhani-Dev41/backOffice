import React, { useState, useEffect } from "react";

export const ItemsPerPageCalculator = (ref) => {
  const [itemsPerPage, setItemsPerPage] = useState<number>(0);
  const [maxHeight, setMaxHeight] = useState<number>(500);
  useEffect(() => {
    if (ref.current) {
      let totalHeight = ref.current.clientHeight;
      // padding: 2rem => 20px * 2 = 40
      // header 56px = 56
      // pagination 32px = 32
      let height = totalHeight - 138;
      setMaxHeight(totalHeight - 88);
      setItemsPerPage(Math.floor(height / 53));
    }
  }, [ref]);
  return { itemsPerPage, maxHeight };
};
