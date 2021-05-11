/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { Card, CardContent } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { DataGrid, ColDef, ValueGetterParams } from "@material-ui/data-grid";
import { membershipApi } from "../../../lib/api/membershipApi";
import { getDateYear, getDayMonth } from "../../../lib/dates";
import { useParams } from "react-router-dom";
import { Membership } from "../../../types/membership";
import { colors } from "app/react/styles/theme";

const cardContentCss = css`
  height: 550px;
`;

const dataGridCss = css`
  border: 0;
  color: ${colors.brandPrimary};
  &.MuiDataGrid-root {
    .MuiDataGrid-columnsContainer {
      border-bottom: 0;
      background-color: ${colors.formControlBg};
    }

    min-width: 1600px;
  }

  &.MuiDataGrid-root {
    .MuiDataGrid-columnSeparator {
      display: none;
    }
  }

  &.MuiDataGrid-root {
    .MuiTablePagination-root {
      background-color: white;
    }
  }

  .MuiToolbar-root {
    background-color: white;
    color: ${colors.brandPrimary};
  }
`;

const cardCss = css`
  &.MuiCard-root {
    overflow-x: auto;
  }
`;

export default function () {
  const { membershipId } = useParams();
  const [rows, setRows] = useState<Membership[]>([]);

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const columns: ColDef[] = [
    { field: "id", headerName: "ID", flex: 0.2 },
    {
      field: "fullName",
      headerName: "Customer Name",
      sortable: false,
      flex: 0.5,
      valueGetter: (params: ValueGetterParams) =>
        `${params.getValue("firstName") || ""} ${params.getValue("lastName") || ""}`,
    },
    { field: "tel", headerName: "Tel", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.5 },
    { field: "regDate", type: "date", headerName: "Registration Date", flex: 0.5 },
    {
      field: "price",
      headerName: "Price",
      flex: 0.2,
      valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
    },
    { field: "status", headerName: "Status", flex: 0.2 },
  ];

  useEffect(() => {
    (async () => {
      try {
        const tempData = [];
        const membershipData = await membershipApi.getMembersInMembership(membershipId);
        //const membershipData = await membershipApi.getMembersInMembership(1);
        membershipData.forEach((item) => {
          tempData.push({
            id: item.id,
            firstName: item.productUser.user.firstName,
            lastName: item.productUser.user.lastName,
            tel: item.productUser.user.phoneNumber,
            email: item.productUser.user.email,
            regDate: `${getDayMonth(item.createdAt + "")}, ${getDateYear(item.createdAt + "")}`,
            price: item.productUser.productPrice,
            status: item.productUser.paymentStatus,
          });
        });
        setRows(tempData);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div>
      <Card css={cardCss}>
        <CardContent css={cardContentCss}>
          <DataGrid rows={rows} columns={columns} pageSize={10} headerHeight={30} rowHeight={50} css={dataGridCss} />
        </CardContent>
      </Card>
    </div>
  );
}
