import React, { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import classNames from "classnames";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import Input from "src/components/common/input";
import Button, { ButtonVariants } from "src/components/common/button";
import { ShipmentService } from "src/controller/ShipmentAPI.service";
import { DealStatus } from "src/interfaces/shipment";
import { useUserInfo } from "src/lib/hooks/useUserInfo";
import { AccountTypeEnum } from "src/interfaces/global";

import ShipmentTabHeaders from "./shipment-tab-header";
import ActiveShipmentTabView from "./active-shipment-tab-view";
import PendingShipmentTabView from "./pending-shipment-tab-view";
import FinishedShipmentTabView from "./finished-shipment-tab-view";
import AllShipments from "./all-shipments";

interface TabViewProps {}

const ShipmentTabView: React.FC<TabViewProps> = () => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { accountType } = useUserInfo();
  const isBuyer = accountType === AccountTypeEnum.BUYER;

  // const dealStatus = {
  //   0: DealStatus.Confirmed,
  //   1: DealStatus.Proposal,
  //   2: DealStatus.Finished,
  // };

  //!! TODO it should be converted to single API call after there will be endpoint to fetch `Count` for each status
  const { data: confirmedShipmentList, isLoading: isConfirmedShipmentListLoading } = useQuery({
    queryKey: ["get-confirmed-shipments"],
    queryFn: () => ShipmentService.getShipments(DealStatus.Confirmed),
    initialData: [],
  });

  const { data: pendingShipmentList, isLoading: isPendingShipmentListLoading } = useQuery({
    queryKey: ["get-pending-shipments"],
    queryFn: () => ShipmentService.getShipments(DealStatus.Proposal),
    initialData: [],
  });

  const { data: finishedShipmentList, isLoading: isFinishedShipmentListLoading } = useQuery({
    queryKey: ["get-finished-shipments"],
    queryFn: () => ShipmentService.getShipments(DealStatus.Finished),
    initialData: [],
  });

  const dataLength =
    Number(confirmedShipmentList?.length) + Number(pendingShipmentList?.length) + Number(finishedShipmentList?.length);

  return (
    <Tab.Group defaultIndex={1} selectedIndex={selectedIndex} onChange={setSelectedIndex}>
      <Tab.List>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[10px] px-[30px] pb-[30px]">
            <ShipmentTabHeaders
              all={dataLength || 0}
              active={confirmedShipmentList?.length || 0}
              pending={pendingShipmentList?.length || 0}
              finished={finishedShipmentList?.length || 0}
            />
          </div>
          <div className="relative -top-[15px]">
            <Button
              classOverrides="!px-[20px]"
              variant={ButtonVariants.FILLED_BLUE}
              onClick={() => router.push("/dashboard/create-shipment")}
            >
              <div className="flex items-center justify-between gap-[6px]">
                <p className="text-[13px] font-bold uppercase leading-[1.2em] tracking-normal !text-tm-white">
                  New Shipment
                </p>
                <AddCircleIcon className="!h-[15px] !w-[15px] !fill-tm-white" />
              </div>
            </Button>
          </div>
        </div>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel className={classNames("rounded-[4px]  rounded-br-[4px] bg-[#ffffff80]  p-[20px]")}>
          <AllShipments
            isBuyer={isBuyer}
            shipmentData={[...confirmedShipmentList, ...pendingShipmentList, ...finishedShipmentList]}
            status={DealStatus.All}
            loading={isConfirmedShipmentListLoading || isPendingShipmentListLoading || isFinishedShipmentListLoading}
          />
        </Tab.Panel>
        <Tab.Panel className={classNames("rounded-[4px]  rounded-br-[4px] bg-[#ffffff80]  p-[20px]")}>
          <ActiveShipmentTabView isBuyer={isBuyer} shipmentData={confirmedShipmentList} status={DealStatus.Confirmed} />
        </Tab.Panel>
        <Tab.Panel className={classNames("rounded-[4px]  rounded-br-[4px]  bg-[#ffffff80]  p-[20px]")}>
          <PendingShipmentTabView isBuyer={isBuyer} shipmentData={pendingShipmentList} status={DealStatus.Proposal} />
        </Tab.Panel>
        <Tab.Panel className={classNames("rounded-[4px]  rounded-br-[4px] bg-[#ffffff80]  p-[20px]")}>
          <FinishedShipmentTabView isBuyer={isBuyer} shipmentData={finishedShipmentList} status={DealStatus.Finished} />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default ShipmentTabView;
