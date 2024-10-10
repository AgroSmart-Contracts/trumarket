import { useRouter } from "next/router";
import React, { useState } from "react";

import InformationRow from "src/components/common/information-row";
import InformationRowDivider from "src/components/common/information-row/information-row-divider";
import { AccountTypeEnum, ITransportType } from "src/interfaces/global";
import { CurrencyFormatter } from "src/lib/helpers";
import { useAppSelector } from "src/lib/hooks";
import { useUserInfo } from "src/lib/hooks/useUserInfo";
import { selectShipmentAgreementState } from "src/store/createShipmentAgreementSlice";

import EnterAddressee from "./enter-addressee";
import OriginAndDestination from "./origin-and-destination";
import PaymentValues from "./payment-values";
import ProductDetails from "./product-details";
import VerticalLinearStepper from "./stepper/stepper";
import SubmitAgreement from "./submit-agreement";
import CompanyData from "./company-data";

interface CreateShipment {}

const CreateShipment: React.FC<CreateShipment> = () => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const shipmentFormData: any = useAppSelector(selectShipmentAgreementState);
  const { accountType } = useUserInfo();
  const isBuyer = accountType === AccountTypeEnum.BUYER;

  const steps = [
    {
      label: "Product",
      subLabel: (
        <p>
          What do you want <br /> {isBuyer ? "to buy" : "to sell"}?
        </p>
      ),
      nodeToRender: <ProductDetails setSelectedIndex={setSelectedIndex} selectedIndex={selectedIndex} />,
      filledValues: (
        <div className="flex">
          <InformationRow label="Product:" underlined={false} value={shipmentFormData.name} />
          <InformationRowDivider />
          <InformationRow label="Variety:" underlined={false} value={shipmentFormData.variety} />
          <InformationRowDivider />
          <InformationRow label="Quality:" underlined={false} value={shipmentFormData.quality?.label} />
          <InformationRowDivider />
          <InformationRow label="Presentation:" underlined={false} value={shipmentFormData.presentation} />
        </div>
      ),
    },
    {
      label: "Values",
      subLabel: (
        <p>
          The value of the <br /> agreement
        </p>
      ),
      nodeToRender: (
        <PaymentValues isBuyer={isBuyer} setSelectedIndex={setSelectedIndex} selectedIndex={selectedIndex} />
      ),
      filledValues: (
        <div className="flex">
          <InformationRow label="Amount:" underlined={false} value={shipmentFormData.quantity} />
          <InformationRowDivider />
          <InformationRow
            label="Price:"
            underlined={false}
            value={CurrencyFormatter(shipmentFormData.offerUnitPrice)}
          />
          <InformationRowDivider />
          <InformationRow
            label="Total:"
            underlined={false}
            value={CurrencyFormatter(shipmentFormData.quantity * shipmentFormData.offerUnitPrice)}
          />
        </div>
      ),
    },
    {
      label: "Where and when",
      subLabel: (
        <p>
          Tell us about your <br /> timeline
        </p>
      ),
      nodeToRender: <OriginAndDestination setSelectedIndex={setSelectedIndex} selectedIndex={selectedIndex} />,
      filledValues: (
        <div className="flex">
          <InformationRow
            label="From:"
            underlined={false}
            value={`${shipmentFormData.port_origin},${shipmentFormData.origin?.label}`}
          />
          <InformationRowDivider />
          <InformationRow
            label="To:"
            underlined={false}
            value={`${shipmentFormData.port_destination},${shipmentFormData.destination?.label}`}
          />
          <InformationRowDivider />
          <InformationRow label="Date:" underlined={false} value={shipmentFormData.shippingStartDate} />
          <InformationRowDivider />
          <InformationRow
            label="Transport:"
            underlined={false}
            value={shipmentFormData.transport === ITransportType.BY_AIR ? "By Air" : "Sea Freight"}
          />
        </div>
      ),
    },
    {
      label: "Your Data",
      subLabel: (
        <p>
          Enter your company <br /> data
        </p>
      ),
      hint: (
        <span>
          All participants have to confirm this agreement. They will be authorized to manage the milestones. <br />
          <span>
            If any of the e-mails does not have an account in the platform, we will send him an e-mail invitation.
          </span>
        </span>
      ),
      nodeToRender: <CompanyData setSelectedIndex={setSelectedIndex} selectedIndex={selectedIndex} />,
      filledValues: (
        <div className="flex">
          <InformationRow label="Company Name:" underlined={false} value={`${shipmentFormData.companyName}`} />
          <InformationRowDivider />
          <InformationRow label="Country:" underlined={false} value={`${shipmentFormData.country?.label}`} />
          <InformationRowDivider />
          <InformationRow label="Tax ID:" underlined={false} value={shipmentFormData.taxId} />
          <InformationRowDivider />
          <InformationRow
            label="Participants:"
            underlined={false}
            value={shipmentFormData?.participants
              ?.map((participant: { label: string; value: string }) => participant.label)
              ?.join(", ")}
          />
        </div>
      ),
    },
    {
      label: isBuyer ? "Supplier" : "Buyer",
      subLabel: (
        <span>
          Enter the {isBuyer ? "supplier" : "buyer"}&apos;s <br /> company data
        </span>
      ),
      hint: `If the ${isBuyer ? "supplier" : "buyer"} doesn't have an account in the platform, we will send him an e-mail invitation.`,
      nodeToRender: (
        <EnterAddressee selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} accountType={accountType} />
      ),
      filledValues: (
        <div className="flex">
          <InformationRow
            label="Email address(es):"
            underlined={false}
            value={shipmentFormData?.addresseeParticipants
              ?.map((participant: { label: string; value: string }) => participant.label)
              ?.join(", ")}
          />
          <InformationRowDivider />
          <InformationRow label="Company Name" underlined={false} value={`${shipmentFormData.addresseeCompanyName}`} />
          <InformationRowDivider />
          <InformationRow label="Tax ID:" underlined={false} value={`${shipmentFormData.addresseeTaxId}`} />
          <InformationRowDivider />
          <InformationRow
            label="Country :"
            underlined={false}
            value={`${shipmentFormData.addresseeCountry?.label || ""}`}
          />
        </div>
      ),
    },
    {
      label: "Summary",
      subLabel: (
        <p>
          Review the form data and <br /> confirm the <br /> agreement
        </p>
      ),
      hint: "After your confirmation, the smart contract will be created and you will be able to track/manage the shipment.",
      nodeToRender: <SubmitAgreement selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />,
    },
  ];

  return (
    <div>
      <VerticalLinearStepper steps={steps} selectedIndex={selectedIndex} />
    </div>
  );
};

export default CreateShipment;
