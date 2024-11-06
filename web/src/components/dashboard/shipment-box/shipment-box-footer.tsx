import React from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Person } from "@phosphor-icons/react";

import Button, { ButtonVariants } from "src/components/common/button";
import { CurrencyFormatter, truncateContractAddress } from "src/lib/helpers";
import { AccountTypeEnum } from "src/interfaces/global";
import InformationRow from "src/components/common/information-row";
import InformationRowDivider from "src/components/common/information-row/information-row-divider";
import { AgreementPartyInfo } from "src/interfaces/shipment";
import MuiTooltip from "src/components/common/mui-tooltip";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useRouter } from "next/router";

interface ShipmentBoxFooterProps {
  accountType: AccountTypeEnum;
  emailInfo: AgreementPartyInfo[];
  value: number;
  contract: string;
  action: () => void;
  actionButtonText: string;
  entityId: string;
}

const ShipmentBoxFooter: React.FC<ShipmentBoxFooterProps> = ({
  accountType,
  emailInfo,
  value,
  contract,
  actionButtonText,
  action,
  entityId,
}) => {
  const router = useRouter();
  const isBuyer = accountType === AccountTypeEnum.BUYER;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex w-[70%]   items-center px-[20px] py-[19px]">
          <InformationRow
            label={isBuyer ? "Supplier:" : "Buyer:"}
            underlined={false}
            value={
              <MuiTooltip
                titleHidden={emailInfo?.length === 1}
                tooltipText={emailInfo
                  ?.slice(1)
                  ?.map((user) => user.email)
                  ?.join("\n")}
              >
                <p>{`${emailInfo?.[0]?.email} ${emailInfo.length > 1 ? `and ${emailInfo.length - 1} other` : ""} `}</p>
              </MuiTooltip>
            }
          />

          <InformationRowDivider />
          <InformationRow
            label="Value:"
            value={CurrencyFormatter(value)}
            showBoldValue={false}
            underlined={false}
            labelClassOverrides="opacity-80"
          />
          <InformationRowDivider />
          <InformationRow
            label="Identifier:"
            value={`#${entityId}` || "-"}
            showBoldValue={false}
            underlined={false}
            labelClassOverrides="opacity-80"
          />
        </div>
        <div className="flex w-[30%] justify-end gap-[10px] pr-[20px]">
          <Button
            classOverrides="!px-[20px]"
            variant={ButtonVariants.FILLED_BLUE}
            onClick={() => router.push("/dashboard/create-shipment?cloneShipmentId=" + entityId)}
          >
            <div className="flex items-center justify-between gap-[6px]">
              <p className="text-[13px] font-bold uppercase leading-[1.2em] tracking-normal !text-tm-white">
                Clone Shipment
              </p>
              <AddCircleIcon className="!h-[15px] !w-[15px] !fill-tm-white" />
            </div>
          </Button>
          <Button classOverrides="!py-[7px] !px-[12px] !min-w-[156px]" onClick={() => action()}>
            <div className="flex w-full items-center justify-between gap-[13px]">
              <p className="text-[13px] font-bold uppercase leading-[1em] text-tm-white">{actionButtonText}</p>
              <ArrowForwardIcon className="!h-[17px] !w-[17px]" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentBoxFooter;
