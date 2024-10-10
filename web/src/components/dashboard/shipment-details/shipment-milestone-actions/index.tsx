import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";

import MilestoneActionButton from "src/components/common/milestone-approval/milestone-action-button";
import MilestoneApprovalBox from "src/components/common/milestone-approval";
import { MilestoneApprovalStatus } from "src/interfaces/global";
import { IMilestoneStatusInfo } from "src/interfaces/shipment";
import { ButtonVariants } from "src/components/common/button";

interface MilestoneActionRendererProps {
  isBuyer: boolean;
  approvalStatus: MilestoneApprovalStatus;
  handleMilestoneAction: (
    milestoneStatusInfo: IMilestoneStatusInfo,
    successMessage: string,
    setLoader: React.Dispatch<React.SetStateAction<boolean>>,
  ) => Promise<void>;
  buyerHandleApproveMilestone: () => void;
  loading: boolean;
  rejectActionLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setRejectActionLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const MilestoneActionRenderer: React.FC<MilestoneActionRendererProps> = ({
  isBuyer,
  approvalStatus,
  handleMilestoneAction,
  loading,
  rejectActionLoading,
  buyerHandleApproveMilestone,
  setLoading,
  setRejectActionLoading,
}) => {
  if (!isBuyer && approvalStatus === MilestoneApprovalStatus.Pending) {
    return (
      <MilestoneApprovalBox
        buttonPlaceholderText={<span>Milestone approval</span>}
        childContainerClasses="!py-[5px] mt-[1px] !px-[4px]"
        milestoneBgColor="bg-tm-dark-secondary"
        toolTipText="Submit the approval request to ask the buyer to close the milestone."
        withOverlay={false}
      >
        <div className="flex gap-[6px] text-[12px] font-bold  text-tm-white">
          <MilestoneActionButton
            action={() =>
              handleMilestoneAction({ submitToReview: true }, "Milestone submitted successfully!", setLoading)
            }
            loading={loading}
          >
            <p>Submit Request</p>
          </MilestoneActionButton>
        </div>
      </MilestoneApprovalBox>
    );
  }

  if (!isBuyer && approvalStatus === MilestoneApprovalStatus.Submitted) {
    return (
      <MilestoneApprovalBox
        buttonPlaceholderText={<span>Milestone approval</span>}
        milestoneBgColor="bg-tm-blue"
        toolTipText="Buyer has been notified about your approval request. You will be notified when he confirms or denies the request."
      >
        <div className="mt-[3px] flex items-center gap-[6px] text-[12px] font-bold uppercase  text-tm-white">
          <p>Pending</p>
          <PendingIcon className="!h-[15px] !w-[15px]" />
        </div>
      </MilestoneApprovalBox>
    );
  }

  if (isBuyer && approvalStatus === MilestoneApprovalStatus.Pending) {
    return (
      <MilestoneApprovalBox
        buttonPlaceholderText={<span>Milestone approval</span>}
        milestoneBgColor="bg-tm-dark-secondary"
        toolTipText="You will be able to approve the milestone after the Supplier submits the approval request."
        withOverlay={false}
        childContainerClasses="bg-[#2D3E57]/30 rounded-[4px]"
      >
        <div className="flex items-center gap-[6px]  text-[12px]  font-bold text-tm-white">
          <p>Wait for supplier request</p>
          <PendingIcon className="!h-[15px] !w-[15px]" />
        </div>
      </MilestoneApprovalBox>
    );
  }

  if (isBuyer && approvalStatus === MilestoneApprovalStatus.Submitted) {
    return (
      <MilestoneApprovalBox
        buttonPlaceholderText={<span>Milestone approval</span>}
        childContainerClasses="!py-[5px] mt-[1px]"
        milestoneBgColor="bg-tm-yellow"
        withOverlay={false}
        toolTipText="Supplier asked you to approve this milestone. Approval will close it permanently and set it as done.After the denial, the supplier will be able to correct the submitted documents/media."
      >
        <div className="flex gap-[6px] text-[12px] font-bold  text-tm-white">
          <MilestoneActionButton
            action={() => handleMilestoneAction({ deny: true }, "Milestone  denied!", setRejectActionLoading)}
            loading={rejectActionLoading}
            variant={ButtonVariants.FILLED_RED}
          >
            <div className="flex items-center gap-[6px]">
              <p className="text-tm-white">Deny</p>
              <CancelIcon className="!h-[18px] !w-[18px] text-tm-white" />
            </div>
          </MilestoneActionButton>
          <MilestoneActionButton
            action={() => buyerHandleApproveMilestone()}
            loading={loading}
            variant={ButtonVariants.FILLED_GREEN}
          >
            <div className="flex items-center gap-[6px]">
              <p className="text-tm-white">Approve</p>
              {!loading ? <CheckCircleIcon className="!h-[18px] !w-[18px] text-tm-white" /> : null}
            </div>
          </MilestoneActionButton>
        </div>
      </MilestoneApprovalBox>
    );
  }

  if (!isBuyer && approvalStatus === MilestoneApprovalStatus.Denied) {
    return (
      <MilestoneApprovalBox
        buttonPlaceholderText={<span>Milestone approval</span>}
        childContainerClasses="!py-[5px] mt-[1px]"
        milestoneBgColor="bg-tm-red"
        toolTipText="Buyer denied to approve this milestone. Contact him about the reasons.After correcting the documents/media resubmit the request."
      >
        <div className="flex gap-[10px] text-[12px] font-bold  text-tm-white">
          <div className="flex items-center gap-[6px]">
            <p className="uppercase text-tm-white">Denied</p>
          </div>
          <div className="flex gap-[6px] text-[12px] font-bold  text-tm-white">
            <MilestoneActionButton
              action={() =>
                handleMilestoneAction({ submitToReview: true }, "Milestone resubmitted successfully!", setLoading)
              }
              loading={loading}
            >
              <p>Resubmit Request</p>
            </MilestoneActionButton>
          </div>
        </div>
      </MilestoneApprovalBox>
    );
  }

  if (isBuyer && approvalStatus === MilestoneApprovalStatus.Denied) {
    return (
      <MilestoneApprovalBox
        buttonPlaceholderText={<span>Milestone approval</span>}
        milestoneBgColor="bg-tm-dark-secondary"
        toolTipText="You denied to approve this milestone. Contact the supplier about the reasons. You will be notified when he corrects the submitted documents/media."
        withOverlay={false}
        childContainerClasses="bg-[#2D3E57]/30 rounded-[4px]"
      >
        <div className="flex items-center gap-[6px]  text-[12px]  font-bold text-tm-white">
          <p>Wait for supplier request</p>
          <PendingIcon className="!h-[15px] !w-[15px]" />
        </div>
      </MilestoneApprovalBox>
    );
  }

  if (approvalStatus === MilestoneApprovalStatus.Approved) {
    return (
      <MilestoneApprovalBox
        buttonPlaceholderText={<span>Milestone approval</span>}
        milestoneBgColor="bg-tm-green"
        toolTipText={`This milestone has been approved by the ${isBuyer ? "buyer" : "supplier"}`}
      >
        <div className="mt-[3px] flex items-center gap-[6px] text-[12px] font-bold  text-tm-white">
          <p>Approved</p>
          <CheckCircleIcon className="!h-[15px] !w-[15px]" />
        </div>
      </MilestoneApprovalBox>
    );
  }
};

export default MilestoneActionRenderer;
