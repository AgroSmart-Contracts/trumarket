import React from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import classNames from "classnames";

import Button from "src/components/common/button";

interface ExtendedNextButtonProps {
  classnames?: string;
  disabled?: boolean;
}

const ExtendedNextButton: React.FC<ExtendedNextButtonProps> = ({ classnames = "!w-auto", disabled }) => {
  return (
    <Button classOverrides={classNames(classNames)} disabled={disabled}>
      <div className="flex items-center">
        <p>Next step</p>
        <ChevronRightIcon className="!w-[25px]" />
      </div>
    </Button>
  );
};

export default ExtendedNextButton;
