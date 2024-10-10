import { Empty } from "@phosphor-icons/react";
import React from "react";

interface NoDataProps {
  text?: string;
}

const NoData: React.FC<NoDataProps> = ({ text }) => {
  return (
    <div className="flex items-center justify-center py-[120px]">
      <div className="flex flex-col items-center gap-[15px]">
        <Empty size={50} weight="duotone" />
        <h1 className="text-[22px] font-bold leading-[1.2em] text-tm-black-80">{text}</h1>
      </div>
    </div>
  );
};

export default NoData;
