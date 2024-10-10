import React from "react";

interface ShipmentDetailsHeaderProps {
  productName?: string;
  shipmentNumber?: string;
}

const ShipmentDetailsHeader: React.FC<ShipmentDetailsHeaderProps> = ({ productName, shipmentNumber }) => {
  return (
    <div className="px-[30px]">
      <div className="flex items-center gap-[15px] text-[26px]  leading-[1.2em] tracking-normal text-tm-black-80">
        <h1 className="font-bold">{productName}</h1>
        {/* <p className="font-light">#{shipmentNumber}</p> */}
      </div>
    </div>
  );
};

export default ShipmentDetailsHeader;
