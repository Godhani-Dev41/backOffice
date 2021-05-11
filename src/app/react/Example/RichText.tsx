/** @jsx jsx */

import React, { useState } from "react";
import { jsx, css } from "@emotion/react";
import { useModal } from "../hooks/useModal";
import { Modal } from "../components/shared/Modal";
import { TranslationEn } from "assets/i18n/en";
import { colors } from "../styles/theme";
import { RichText } from "../components/shared/RichText";

const container = css`
  padding: 8rem;
  font-size: 2rem;
  font-family:"Montserrat";
  color:${colors.brandPrimary};
  font-weight:bold;
}
`;

export const RichTextWrapper = () => {
  const { isShowing, toggle } = useModal();
  const [value, setValue] = useState("");
  const [counter, setCounter] = useState(0);
  return (
    <Modal isShowing={isShowing} toggle={toggle}>
      {`${counter}/50`}
      <RichText initialValue={"some initial value"} handleChange={setValue} setLength={setCounter} max={50} />
    </Modal>
  );
};
