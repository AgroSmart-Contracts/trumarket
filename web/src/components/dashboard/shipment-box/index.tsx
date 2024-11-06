import React, { useState } from "react";
import { useRouter } from "next/router";
import moment from "moment";
import Link from "next/link";

import { AccountTypeEnum, IMilestoneDetails, MilestoneEnum } from "src/interfaces/global";
import ShipmentInfo from "src/components/common/shipment-info";
import { useUserInfo } from "src/lib/hooks/useUserInfo";
import { getCountryCode, hasDocsWithLength } from "src/lib/helpers";
import { AgreementPartyInfo, DealStatus, ShippingDetails } from "src/interfaces/shipment";

import ShipmentBoxImage from "./shipment-box-image";
import ShipmentBoxHeader from "./shipment-box-header";
import ShipmentBoxFooter from "./shipment-box-footer";
import HorizontalMilestones from "./horizontal-milestones";

interface ShipmentBoxProps {
  shipment: ShippingDetails;
  status: DealStatus;
  notStarted: boolean;
  isNew: boolean;
  newDocuments: boolean;
  supplierEmails: AgreementPartyInfo[];
  buyerEmails: AgreementPartyInfo[];
}

const ShipmentBox: React.FC<ShipmentBoxProps> = ({
  shipment,
  status,
  notStarted,
  isNew,
  newDocuments,
  supplierEmails,
  buyerEmails,
}) => {
  const router = useRouter();
  const { accountType, userInfo } = useUserInfo();
  const isBuyer = accountType === AccountTypeEnum.BUYER;
  const [active, setActive] = useState<boolean>(false);
  const actionButtonText = status === DealStatus.Proposal ? "Review the agreement" : "Details";

  const link =
    status === DealStatus.Confirmed || status === DealStatus.Finished
      ? `/dashboard/shipment-details/${shipment.id}`
      : `/dashboard/agreement-details/${shipment.id}`;

  const handleNavigate = () => {
    router.push(link);
  };

  const generateMilestoneStatus = () => {
    //check if milestone is on first stage and has document uploaded
    if (shipment.currentMilestone === MilestoneEnum.M && !hasDocsWithLength(shipment.milestones)) {
      return undefined;
    } else {
      return shipment.currentMilestone;
    }
  };

  const detectIfDealIsUnseenByCurrentUser = () => {
    //only for buyers
    if (isBuyer) {
      const status = buyerEmails.find((buyer) => buyer.id === userInfo?.user?.id)?.new;
      return status as boolean;
    }
    return false;
  };

  return (
    <div className="rounded-[5px] bg-tm-white">
      <div className="flex">
        {/* <div className="max-w-[190px]">
          <div className="p-[10px]">
            <ShipmentBoxImage />
          </div>
        </div> */}
        <div className="flex-1 flex-col">
          <Link href={link}>
            <ShipmentBoxHeader
              entityTitle={shipment.name}
              entityId={shipment.id}
              notStarted={notStarted}
              isNew={detectIfDealIsUnseenByCurrentUser()}
              supplierEmails={supplierEmails}
              buyerEmails={buyerEmails}
              newDocuments={newDocuments}
              accountType={accountType}
              status={status}
              userId={userInfo?.user?.id}
              active={active}
              milestones={shipment.milestones}
              currentMilestone={shipment.currentMilestone}
            />
            <div className="px-[20px] py-[28px]">
              <div className="flex items-center px-[40px]">
                <div className="flex  justify-end text-right">
                  <ShipmentInfo
                    title={`${shipment.portOfOrigin}, ${shipment.origin}`}
                    value={`${moment(shipment.shippingStartDate).format("DD.MM.YYYY")}`}
                    titleClassOverrides="text-left"
                    countryCode={getCountryCode(shipment.origin)}
                    subValue="ETD"
                    showFlag
                  />
                </div>
                <div className="flex-1">
                  <HorizontalMilestones
                    status={generateMilestoneStatus()}
                    milestones={shipment.milestones}
                    isBuyer={isBuyer}
                    hasNewDocuments={shipment.newDocuments!}
                    transport={shipment.transport!}
                    setActive={setActive}
                  />
                </div>
                <ShipmentInfo
                  title={`${shipment.portOfDestination}, ${shipment.destination}`}
                  value={`${moment(shipment.expectedShippingEndDate).format("DD.MM.YYYY")}`}
                  countryCode={getCountryCode(shipment.destination)}
                  valueClassOverrides="flex-row-reverse"
                  titleClassOverrides="text-right"
                  subValue="ETA"
                  showFlag
                />
              </div>
            </div>
          </Link>
          <div className="border-t border-t-tm-black-20">
            <ShipmentBoxFooter
              accountType={accountType}
              emailInfo={(isBuyer ? shipment.suppliers : shipment.buyers) || ""}
              value={shipment.totalValue}
              contract={`${shipment.contractId}` || "0"}
              actionButtonText={actionButtonText}
              entityId={shipment.id}
              action={() => handleNavigate()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentBox;
