import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import classNames from "classnames";

import Input from "src/components/common/input";

interface TabViewProps {
  tabHeaders: string[];
  tabContent: any[];
}

const TabView: React.FC<TabViewProps> = ({ tabHeaders, tabContent }) => {
  return (
    <Tab.Group>
      <Tab.List className="relative  flex justify-between">
        <div className="absolute bottom-0 right-[142px] h-[1px] w-[33px] bg-tm-black-20"></div>
        <div className="absolute bottom-0 left-[133px] h-[1px] w-[33px] bg-tm-black-20"></div>
        {tabHeaders.map((category, i) => (
          <Tab
            key={category}
            className={({ selected }) =>
              classNames(
                "rounded-tl-[4px] rounded-tr-[4px] border-x   border-t border-tm-black-20 px-[10px] py-[11px] text-[13px] outline-none md:px-[30px]",
                {
                  "bg-[#2D3E57]/5 font-bold  leading-[1.2em]  tracking-normal text-tm-black-80": selected,
                  "text-tm-theme-text border-b bg-tm-white font-bold": !selected,
                },
              )
            }
          >
            {category}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels>
        {tabContent.map((view, i) => (
          <Tab.Panel
            key={i}
            className={classNames(
              "rounded-bl-[4px] rounded-br-[4px] border-x border-b  border-tm-black-20 bg-[#2D3E57]/5 p-[30px]",
            )}
          >
            {view}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default TabView;
