import React from "react";
import { Tab } from "@headlessui/react";
import classNames from "classnames";

import Badge from "src/components/common/badge";
interface ShipmentTabHeadersProps {
  active: number;
  pending: number;
  finished: number;
  all: number;
}

const ShipmentTabHeaders: React.FC<ShipmentTabHeadersProps> = ({ pending, active, finished, all }) => {
  return (
    <>
      <div className="rounded-[4px]">
        <Tab
          className={({ selected }) =>
            classNames(
              "rounded-bl-[4px] rounded-tl-[4px]  border-y border-l border-tm-black-20  px-[20px] py-[10px] text-[16px] uppercase leading-[1.2em] outline-none",
              {
                " !border-tm-black-80 bg-tm-black-80  font-bold   tracking-normal   text-tm-white": selected,
              },
            )
          }
        >
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center gap-[5px]">
              {/* <Badge background="bg-tm-purple" /> */}
              <p className="text-[12px] font-bold uppercase leading-[1.3em] tracking-normal">All</p>
            </div>
            <span className="text-[12px] font-semibold leading-[1.3em] tracking-normal">{all}</span>
          </div>
        </Tab>
        <Tab
          className={({ selected }) =>
            classNames(
              " border border-tm-black-20  px-[20px] py-[10px] text-[16px] uppercase leading-[1.2em] outline-none",
              {
                " !border-tm-black-80 bg-tm-black-80  font-bold   tracking-normal   text-tm-white": selected,
              },
            )
          }
        >
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center gap-[5px]">
              {/* <Badge background="bg-tm-purple" /> */}
              <p className="text-[12px] font-bold uppercase leading-[1.3em] tracking-normal">Active Shipments</p>
            </div>
            <span className="text-[12px] font-semibold leading-[1.3em] tracking-normal">{active}</span>
          </div>
        </Tab>
        <Tab
          className={({ selected }) =>
            classNames(
              "border-b border-r border-t border-tm-black-20 px-[20px] py-[10px] text-[16px] uppercase leading-[1.2em] outline-none",
              {
                " !border-tm-black-80 bg-tm-black-80  font-bold tracking-normal   text-tm-white": selected,
              },
            )
          }
        >
          <div className="flex items-center gap-[16px]">
            <div className="flex items-center gap-[5px]">
              {/* <Badge /> */}
              <p className="text-[12px] font-bold leading-[1.3em] tracking-normal">Pending</p>
            </div>
            <span className="text-[12px] font-semibold leading-[1.3em] tracking-normal">{pending}</span>
          </div>
        </Tab>
        <Tab
          className={({ selected }) =>
            classNames(
              "rounded-br-[4px] rounded-tr-[4px] border-y border-r border-tm-black-20 px-[20px] py-[10px] text-[16px] uppercase leading-[1.2em] outline-none",
              {
                "bg-tm-black-80 font-bold  leading-[1.2em] tracking-normal   text-tm-white": selected,
              },
            )
          }
        >
          <div className="flex items-center gap-[16px]">
            <div className="flex items-center gap-[5px]">
              {/* <Badge /> */}
              <p className="text-[12px] font-bold leading-[1.3em] tracking-normal">Finished</p>
            </div>
            <span className="text-[12px]  font-semibold leading-[1.3em] tracking-normal">{finished}</span>
          </div>
        </Tab>
      </div>
    </>
  );
};

export default ShipmentTabHeaders;
