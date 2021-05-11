/** @jsx jsx */

import React, { useState } from "react";
import { jsx, css } from "@emotion/react";
import { Editor } from "@tinymce/tinymce-react";

interface Props {
  initialValue?: string;
  handleChange?: (val: string) => void;
  max?: number;
  setLength?: (val: number) => void;
}
export const RichText = ({ initialValue = "", handleChange, max = 1000, setLength }: Props) => {
  const [isMaxReached, setMaxReached] = useState(false);

  return (
    <Editor
      initialValue={initialValue}
      init={{
        height: 300,
        menubar: false,
        statusbar: false,
        link_title: false,
        link_context_toolbar: true,
        plugins: ["advlist autolink lists link ", " paste wordcount "],
        toolbar: "bold italic underline | alignleft aligncenter " + "alignright | bullist numlist  link| ",
      }}
      // @ts-ignore
      onKeyDown={(e: KeyboardEvent) => {
        if (isMaxReached) {
          if (e.key !== "Backspace") {
            e.preventDefault();
          }
        }
      }}
      onEditorChange={(val, Editor) => {
        const wordcount = Editor.plugins.wordcount;
        const length = wordcount.body.getCharacterCount();

        if (setLength) {
          setLength(length);
        }
        if (length < max) {
          setMaxReached(false);
          if (handleChange) {
            handleChange(val);
          }
        } else {
          setMaxReached(true);
        }
      }}
    />
  );
};
