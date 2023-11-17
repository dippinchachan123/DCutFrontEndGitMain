export const userColumns = () => [
    { field: "id", headerName: "K No.", width: 70 },
    {
      field: "name",
      headerName: "Name",
      width: 230,
    },
    {
      field: "pieces",
      headerName: "Pieces",
      width: 100,
    },
    {
      field: "weight",
      headerName: "Weight",
      width: 230,
      renderCell : (params) => {
        return (<div>
          <span>{(params.row.weight - params.row.cutsWeight).toFixed(2)}</span>
          <span style={
            {marginLeft : '50px',
            'background-color': 'rgba(255, 0, 0, 0.05)',
            'color' : 'crimson',
            'fontSize': '16px'
            }}>
            /{params.row.weight}
          </span> 
        </div>)
      }
    },
    
    {
        field: "size",
        headerName: "Size",
        width: 100,
        renderCell : (params) => {
          return params.row.size.toFixed(2)
        }
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

  //temporary data
