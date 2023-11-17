import React from 'react';
import './InfoBox.scss'; // You can create a CSS file for styling

function DataTableInfoBox({ infoData }) {
  return (
    <div className="info-box">
      {infoData.map((item, index) => (
        <div className="info-item" key={index}>
          <div className="info-label">{item.label} : {item.value}</div>
        </div>
      ))}
    </div>
  );
}

export default DataTableInfoBox;
