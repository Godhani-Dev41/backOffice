/** @jsx jsx */

import React, { FC } from "react";
import { jsx, css } from "@emotion/react";

const scrollWrapper = css`
  height: 500px;
  width: 80%;
  max-width: 800px;
  margin: 0 auto;
  padding-top: 2rem;
  flex-grow: 1;
  overflow-y: auto;
`;
const bodyCss = css`
  padding: 2rem;
  margin-bottom: 2rem;
  background: #fff;
  box-shadow: 0px 2px 22px rgba(21, 93, 148, 0.0749563);
`;

export const MiddleWhiteContainer: FC = ({ children }) => {
  return (
    <div className="scroller" css={scrollWrapper}>
      <div css={bodyCss}>{children}</div>
    </div>
  );
};
