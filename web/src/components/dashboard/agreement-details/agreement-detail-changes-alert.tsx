import React from "react";
import { toast } from "react-toastify";

import Button from "src/components/common/button";

interface AgreementDetailChangesAlertProps {
  changesCount: number;
  submitFormAction?: () => void;
  loading?: boolean;
  resetFormAction?: () => void;
}

const AgreementDetailChangesAlert: React.FC<AgreementDetailChangesAlertProps> = ({
  changesCount,
  submitFormAction,
  loading,
  resetFormAction,
}) => {
  return (
    <div className="rounded-[4px] bg-tm-yellow p-[16px]">
      <div className="flex flex-col gap-[14px]">
        <div className="flex flex-col gap-[4px]">
          <p className="text-[13px] font-bold leading-[1em] tracking-normal text-tm-black-80">
            You have ({changesCount}) unsubmitted changes.
          </p>
          <p
            onClick={() => {
              resetFormAction?.();
              toast.success("Agreement changes reset.");
            }}
            className="cursor-pointer text-[12px] leading-[1em] text-tm-black-80 underline"
          >
            Reset form
          </p>
        </div>
        <Button onClick={() => submitFormAction?.()} loading={loading} disabled={loading}>
          <p className="text-[13px] font-bold leading-[1.2em] tracking-normal">Submit changes</p>
        </Button>
      </div>
    </div>
  );
};

export default AgreementDetailChangesAlert;
