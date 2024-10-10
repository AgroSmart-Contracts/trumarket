import classNames from "classnames";
import React from "react";

import MuiTooltip from "../mui-tooltip";

interface MilestoneApprovalBoxProps {
  withOverlay?: boolean;
  milestoneBgColor: string;
  children: React.ReactNode;
  toolTipText?: string;
  buttonPlaceholderText: React.ReactNode;
  buttonPlaceholderIcon?: React.ReactNode;
  childContainerClasses?: string;
}

const MilestoneApprovalBox: React.FC<MilestoneApprovalBoxProps> = ({
  withOverlay = true,
  milestoneBgColor,
  children,
  toolTipText,
  buttonPlaceholderText,
  buttonPlaceholderIcon,
  childContainerClasses,
}) => {
  return (
    <div className=" inline-block rounded-[10px]">
      <div className="flex">
        <div className={classNames("h-full", toolTipText ? "cursor-pointer" : "pointer-events-none")}>
          <MuiTooltip tooltipText={toolTipText}>
            <div
              className={classNames(
                "flex  items-center gap-[10px] rounded-bl-[4px] rounded-tl-[4px] px-[16px]  py-[15px] text-[12px] font-semibold leading-[1.2em] text-tm-white",
                milestoneBgColor,
              )}
            >
              {buttonPlaceholderIcon}
              {buttonPlaceholderText}
            </div>
          </MuiTooltip>
        </div>
        <div
          className={classNames(
            "relative flex flex-1 items-center rounded-br-[4px] rounded-tr-[4px]",
            milestoneBgColor,
          )}
        >
          {withOverlay ? <div className="absolute h-full w-full rounded-[4px]  bg-tm-black-20"></div> : null}
          <div className={classNames("relative z-50 flex h-full items-center px-[14px]", childContainerClasses)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneApprovalBox;
