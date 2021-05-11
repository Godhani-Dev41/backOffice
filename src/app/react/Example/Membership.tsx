/** @jsx jsx */

import { Card, Typography } from "@material-ui/core";
import { VenuesService } from "app/shared/services/venues/venues.service";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { jsx, css } from "@emotion/react";
import { baseStore } from "../stores/baseStore";
import { useRecoilState, useRecoilValue } from "recoil";

export interface IMyComponentProps {
  facilityId: number;
  onClick?: () => void;
  venueService: VenuesService;
}

const cardCss = css`
  margin-left: 15%;
  height: 150px;
  width: 200px;
`;

const testCss = css`
  border: 1px solid black;
  background-color: green;
`;

// export const Memberships: FunctionComponent<IMyComponentProps> = (props: IMyComponentProps) => {
export const Membership = ({ venueService, facilityId, onClick }: IMyComponentProps) => {
  //const {counter: propsCounter, onClick, } = props;

  //const nameAndCounter = useRecoilValue(baseStore.nameAndCounter);

  const [nameAndCounter, setNameAndCounter] = useRecoilState(baseStore.nameAndCounter);

  const [facilityName, setFacilityName] = useState("loading");

  useEffect(() => {
    async function load() {
      const f = await venueService.getVenueById(253).toPromise();
      setFacilityName(f.data.name);
    }
    load();
  }, []);

  const handleClick = () => {
    const names = ["Father", "Mother", "Holly ghost"];
    let counter = nameAndCounter.counter + 1;
    counter = counter >= names.length ? 0 : counter;
    const name = names[counter];
    setNameAndCounter((state) => ({ ...state, counter, name }));

    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={`my-graph-component`}>
      <h1>this is already react !-- :) </h1>
      // @ts-ignore
      <div css={testCss} className={"comp-props"}>
        I'll try loading facility: {facilityId}
        <br />
        {/*        <Card css={cardCss}>
          <Typography>CARDS AND MATERIALS!</Typography>
        </Card>*/}
        <span onClick={handleClick} className={"increase-button"}>
          click event
        </span>
        <br />
        {facilityName}
        <br />
        name: {nameAndCounter.name}
        <br />
        counter: {nameAndCounter.counter}
      </div>
    </div>
  );
};
