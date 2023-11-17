export const userColumns = () => [
    { field: "id", headerName: "Cut No.", width: 70 },
    {
      field: "pieces",
      headerName: "Pieces",
      width: 150,
    },
    {
      field: "weight",
      headerName: "Weight",
      width: 230,
    },
    {
        field: "size",
        headerName: "Size",
        width: 150,
    },
    {
        field: "remarks",
        headerName: "Remarks",
        width: 250,
        renderCell : (params)=> {
            return (
                <div className={`cellWithStatus PENDING`}>
                    {params.row.remarks}
                </div>
            )
        }
    },
    {
        field: "status",
        headerName: "Status",
        width: 160,
        renderCell: (params) => {
          return (
            <div className={`cellWithStatus ${params.row.status}`}>
              {params.row.status}
            </div>
          );
        },
      }
  ];

