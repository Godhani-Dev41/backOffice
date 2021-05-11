/** @jsx jsx */

import React, { useEffect, useState } from "react";
import { jsx, css } from "@emotion/react";
import { colors } from "../../../../styles/theme";
import { FormPart } from "../../utils/formPart";
import { FrameContainer } from "../../utils/FrameContainer";

const container = css`
  width: 50%;
  margin: 2rem auto;
`;

const wrapper = css`
  display: flex;
  flex-wrap: wrap;
`;

export const Memebership = () => {
  return (
    <div css={container}>
      <FrameContainer title="Family premium">
        <div css={wrapper}>
          <FormPart width={35} margin={0} label="membership type" value="Fix" />
          <FormPart width={35} margin={0} label="price" value="$1200" />
          <FormPart width={35} margin={0} label="membership starts" value="Nov 16, 2021" />
          <FormPart width={35} margin={0} label="membership ends" value="Jul 5, 2021" />
        </div>
      </FrameContainer>
      <FrameContainer title="vip plus plus">
        <div css={wrapper}>
          <FormPart width={35} margin={0} label="membership type" value="Fix" />
          <FormPart width={35} margin={0} label="price" value="$1200" />
          <FormPart width={35} margin={0} label="membership starts" value="Nov 16, 2021" />
          <FormPart width={35} margin={0} label="membership ends" value="Jul 5, 2021" />
        </div>
      </FrameContainer>
    </div>
  );
};
