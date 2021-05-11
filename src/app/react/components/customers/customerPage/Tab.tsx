/** @jsx jsx */

import React, { useEffect, useState } from "react";
import { NavLink, Link, useParams, useHistory } from "react-router-dom";
import { jsx, css } from "@emotion/react";

interface Tab {
  title: string;
  link: string;
}

export const Tab = ({ title, link }: Tab) => {
  return (
    <NavLink
      className="link"
      isActive={(match, location) => {
        if (location.pathname.includes(link)) {
          return true;
        } else {
          return false;
        }
      }}
      to={link}
    >
      <div>{title}</div>
    </NavLink>
  );
};
