import React from "react";
import classNames from "classnames";

import Button from "../../button";

export interface ModalContentProps {
  modalMainTitle?: string;
  modalSubTitle?: string;
  children?: React.ReactNode;
  primaryOptionText: string;
  secondaryOptionText: string;
  primaryOptionAction: () => void;
  secondaryOptionAction: () => void;
  primaryOptionLoading?: boolean;
  secondaryOptionLoading?: boolean;
  wrapperContainerClassOverrides?: string;
}

const ModalContent: React.FC<ModalContentProps> = ({
  modalMainTitle,
  modalSubTitle,
  children,
  primaryOptionAction,
  secondaryOptionAction,
  primaryOptionText,
  secondaryOptionText,
  primaryOptionLoading,
  secondaryOptionLoading,
  wrapperContainerClassOverrides,
}) => {
  return (
    <div className={classNames("w-full", wrapperContainerClassOverrides)}>
      <div className="flex flex-col gap-[10px] px-[30px] pb-[20px] pt-[30px] text-center">
        {modalMainTitle ? (
          <p className="text-[15px] font-bold leading-[1.2em] tracking-normal text-tm-black-80">{modalMainTitle}</p>
        ) : null}
        {modalSubTitle ? (
          <p className="text-normal text-[13px] leading-[1.2em] tracking-normal">{modalSubTitle}</p>
        ) : null}
        {children}
      </div>
      <div className="h-[1px] w-full bg-tm-black-20"></div>
      <div className="flex items-center gap-[10px] px-[30px] pb-[30px] pt-[20px]">
        {primaryOptionText ? (
          <Button onClick={primaryOptionAction} loading={primaryOptionLoading} disabled={primaryOptionLoading}>
            <p className="text-[14px] font-bold capitalize leading-[1.2em] text-tm-white">{primaryOptionText}</p>
          </Button>
        ) : null}

        <Button onClick={secondaryOptionAction} loading={secondaryOptionLoading} disabled={secondaryOptionLoading}>
          <p className="whitespace-nowrap text-[14px] font-bold leading-[1.2em] text-tm-white">{secondaryOptionText}</p>
        </Button>
      </div>
    </div>
  );
};

export default ModalContent;
