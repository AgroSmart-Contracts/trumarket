import { CheckCircle } from "@phosphor-icons/react";
import React from "react";
import { useModal } from "src/context/modal-context";

interface ShipmentDetailsHeaderProps {
  productName?: string;
  shipmentNumber?: string;
  publish: () => void;
  isPublished?: boolean;
}

const ShipmentDetailsHeader: React.FC<ShipmentDetailsHeaderProps> = ({
  productName,
  shipmentNumber,
  publish,
  isPublished,
}) => {
  return (
    <div className="px-[30px]">
      <div className="flex items-center gap-[15px] text-[26px]  leading-[1.2em] tracking-normal text-tm-black-80">
        <h1 className="font-bold">{productName}</h1>
        {/* <p className="font-light">#{shipmentNumber}</p> */}
        {isPublished ? (
          <p className="flex items-center text-sm font-light text-tm-green">
            Published
            <span className="ml-2">
              <CheckCircle size={16} />
            </span>
          </p>
        ) : (
          <button
            onClick={() => {
              publish();
            }}
            className="rounded-md bg-tm-green px-2 py-1 text-sm text-tm-white"
          >
            Publish
          </button>
        )}
      </div>
    </div>
  );
};

export default ShipmentDetailsHeader;
