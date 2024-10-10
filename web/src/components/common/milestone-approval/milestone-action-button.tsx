import React from "react";
import classNames from "classnames";

import Button, { ButtonVariants } from "../button";

interface MilestoneActionButtonProps {
  action: () => void;
  loading: boolean;
  children: React.ReactNode;
  variant?: ButtonVariants;
}

const MilestoneActionButton: React.FC<MilestoneActionButtonProps> = ({ action, loading, children, variant }) => {
  return (
    <>
      <Button
        loading={loading}
        disabled={loading}
        classOverrides={classNames("!py-[7px] !px-[20px] !text-[12px] !uppercase")}
        onClick={() => action()}
        innerClassOverrides="!gap-[6px]"
        variant={variant}
      >
        {children}
      </Button>
    </>
  );
};

export default MilestoneActionButton;
