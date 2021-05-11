/** @jsx jsx */
import React, { useState, useEffect, useRef } from "react";
import { jsx, css } from "@emotion/react";
import moment from "moment";
import { ReactSVG } from "react-svg";
import { notesCss, headerContainerCss } from "./styles";
import { colors } from "../../../../styles/theme";
import { INotesProps } from "../../../../types/notes";
import { Note } from "./Note";

const textCss = css`
  background: rgba(13, 71, 116, 0.04);
  border: 1px solid #dae6f0;
  box-sizing: border-box;
  border-radius: 2px;
  line-height: 16px;
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 1.4rem;
  colors: ${colors.brandPrimary};
  width: 300px;
  padding: 5px;
`;

const textlimitCss = css`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  div {
    font-family: Montserrat;
    font-style: normal;
    font-weight: normal;
    font-size: 1.2rem;
    line-height: 15px;
    display: flex;
    align-items: center;
    text-align: right;
    color: ${colors.formInputBg};
  }
`;

const buttonContainerCss = css`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
  .cancel {
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 1.4rem;
    line-height: 17px;
    text-transform: uppercase;
    background: transparent;
    color: ${colors.formInputBg};
    border: 0;
    padding: 1rem;
    margin-left: 1rem;
  }

  .add {
    background: linear-gradient(270deg, ${colors.brandSecondary} 0%, ${colors.brandSecondary} 100%);
    border-radius: 3px;
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 1.4rem;
    line-height: 17px;
    text-align: center;
    text-transform: uppercase;
    color: ${colors.white};
    border: 0;
    padding: 1rem;
    margin-left: 1rem;
    &:disabled {
      background: ${colors.formControlBg};
      color: ${colors.disabled};
    }
  }
`;

const notesContainer = css`
  max-height: 500px;
  overflow: auto;
`;

export const Notes = ({ notes, handleAdd, toggle }: INotesProps) => {
  const [value, setValue] = useState<string>("");
  const notesRef = useRef(null);

  useEffect(() => {
    if (notesRef.current) {
      notesRef.current.scrollTop = notesRef.current.scrollHeight;
    }
  }, [notes]);
  return (
    <div style={{ padding: "1rem", margin: "0 1rem", maxWidth: "320px" }}>
      <div>
        <div css={headerContainerCss}>
          <ReactSVG css={notesCss} src="assets/media/icons/customers/header/subtract.svg" />
          <span>Add Note</span>
        </div>
        <textarea
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= 120) {
              setValue(e.target.value);
            } else {
              setValue(e.target.value.slice(0, 120));
            }
          }}
          css={textCss}
        />
        <div css={textlimitCss}>
          <div>{`${value.length}/120`}</div>
        </div>
      </div>
      <div css={buttonContainerCss}>
        <button className="cancel" onClick={() => toggle()}>
          CANCEL
        </button>
        <button
          onClick={() => {
            handleAdd({ content: value, datetime: moment().format() });
            setValue("");
          }}
          disabled={value.length === 0}
          className="add"
        >
          ADD
        </button>
      </div>
      <div ref={notesRef} css={notesContainer}>
        {notes.map((note, index) => {
          return <Note content={note.content} datetime={note.datetime} key={index} />;
        })}
      </div>
    </div>
  );
};
