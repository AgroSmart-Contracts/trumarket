import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import classNames from "classnames";
import { toast } from "react-toastify";

import Input from "src/components/common/input";
import { useAppDispatch, useAppSelector } from "src/lib/hooks";
import { selectShipmentAgreementState, setShipmentAgreementState } from "src/store/createShipmentAgreementSlice";
import Button from "src/components/common/button";
import { milestones } from "src/lib/static";
import { CurrencyFormatter, calculateTranchPercentageSum } from "src/lib/helpers";
import { IPaymentValuesForm } from "src/interfaces/shipment";
import FieldTitle from "src/components/common/input/field-title";

import ExtendedNextButton from "./extended-next-button";
import PaymentTranche from "./payment-tranch-table";
interface PaymentValueProps {
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedIndex: number;
  isBuyer: boolean;
}

type ExtendInterface<T, U extends string> = T & Record<U, string>;

type ExtendedPaymentValuesForm = ExtendInterface<IPaymentValuesForm, (typeof milestones)[number]["value"]>;

const PaymentValues: React.FC<PaymentValueProps> = ({ setSelectedIndex, selectedIndex, isBuyer }) => {
  const dispatch = useAppDispatch();
  const shipmentFormData = useAppSelector(selectShipmentAgreementState);
  const [sumError, setSumError] = useState(false);

  const defaultValues = {
    quantity: shipmentFormData.quantity,
    offerUnitPrice: shipmentFormData.offerUnitPrice,
    production_and_fields: shipmentFormData.production_and_fields,
    packaging_and_process: shipmentFormData.packaging_and_process,
    finished_product_and_storage: shipmentFormData.finished_product_and_storage,
    transport_to_port_of_origin: shipmentFormData.transport_to_port_of_origin,
    port_of_origin: shipmentFormData.port_of_origin,
    transit: shipmentFormData.transit,
    port_of_destination: shipmentFormData.port_of_destination,
    investmentAmountPercentage: shipmentFormData.investmentAmountPercentage || "100",
  };
  const [formValues, setFormValues] = useState<any>(defaultValues);
  const paymentTranchPercentage = calculateTranchPercentageSum(formValues, [
    "quantity",
    "offerUnitPrice",
    "investmentAmountPercentage",
  ]);
  const validPercentageValue = paymentTranchPercentage < 100 || paymentTranchPercentage > 100;
  const {
    handleSubmit,
    register,
    control,
    getValues,
    watch,
    formState: { errors },
  } = useForm<ExtendedPaymentValuesForm>({
    defaultValues,
  });

  const handleNextStep = async (data: ExtendedPaymentValuesForm) => {
    Object.keys(data).map((key) => {
      dispatch(
        setShipmentAgreementState({
          field: key,
          value: data[key as keyof ExtendedPaymentValuesForm],
        }),
      );
    });
    if (validPercentageValue) {
      toast.error("Percentage value must be 100%");
    } else {
      setSelectedIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name, type }) => setFormValues(value));
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (validPercentageValue) {
      setSumError(true);
    } else {
      setSumError(false);
    }
  }, [paymentTranchPercentage]);

  return (
    <form onSubmit={handleSubmit(handleNextStep)}>
      <div className="flex flex-col gap-[40px]">
        <div className="flex flex-col gap-[12px]">
          <div className="flex flex-col gap-[5px]">
            <FieldTitle>
              How many units are you {isBuyer ? "buying" : "selling"}?{" "}
              <span className="font-medium">({shipmentFormData.presentation})</span>
            </FieldTitle>
            <Input
              name="quantity"
              classOverrides="!bg-[#ff000000]"
              placeholder={`Units to ${isBuyer ? "buy" : "sell"}`}
              register={register("quantity", {
                required: "field is required!",
              })}
              type="number"
              step="0.01"
              hasError={Boolean(errors.quantity)}
              errors={errors}
            />
          </div>
          <div className="flex flex-col gap-[5px]">
            <FieldTitle>
              Price per unit <span className="font-medium">({shipmentFormData.presentation})</span>
            </FieldTitle>
            <Input
              name="offerUnitPrice"
              classOverrides="!bg-[#ff000000]"
              placeholder="Price per unit"
              register={register("offerUnitPrice", {
                required: "field is required!",
              })}
              step="0.01"
              type="number"
              hasError={Boolean(errors.offerUnitPrice)}
              placeHolderRight="USD"
              errors={errors}
            />
          </div>
          <div className="relative">
            <FieldTitle classOverrides="mb-[5px]">Payment tranches at the end of the milestones</FieldTitle>
            <PaymentTranche milestones={milestones} register={register} />
            {sumError ? (
              <p className="mt-[4px] text-[13px] text-tm-danger">
                The sum must be <span className="notranslate ml-[1px]">100</span>%
              </p>
            ) : null}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[13px]  font-normal leading-[1.2em]">
              Total agreement value :{" "}
              <span className="notranslate font-bold text-tm-black-80">
                {CurrencyFormatter(Number(watch("quantity") || 0) * Number(watch("offerUnitPrice") || 0)) || "-"}
              </span>{" "}
            </p>
            <p
              className={classNames(" text-[13px] font-normal text-tm-black-80", {
                "text-tm-danger": validPercentageValue,
                "text-tm-black-80": paymentTranchPercentage === 100,
              })}
            >
              Total:{" "}
              <span className="notranslate">
                {calculateTranchPercentageSum(formValues, [
                  "quantity",
                  "offerUnitPrice",
                  "investmentAmountPercentage",
                ]) || "0"}
              </span>
              %
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[13px]  font-normal leading-[1.2em]">
              Investment amount :{" "}
              <span className="notranslate font-bold text-tm-black-80">
                {CurrencyFormatter(
                  Number(watch("quantity") || 0) *
                    Number(watch("offerUnitPrice") || 0) *
                    (Number(watch("investmentAmountPercentage") || 0) / 100),
                ) || "-"}
              </span>{" "}
            </p>
            <div className="flex items-center gap-2">
              <Input
                name="investmentAmountPercentage"
                classOverrides="!bg-[#ff000000]"
                placeholder="Investment Amount Percentage"
                register={register("investmentAmountPercentage", {
                  required: "field is required!",
                })}
                hasError={Boolean(errors.investmentAmountPercentage)}
                errors={errors}
                type="range"
                min="0"
                max="100"
                step="1"
              />
              <span>{Number(watch("investmentAmountPercentage"))} %</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[30px] flex gap-[10px]">
        <div className="!w-auto">
          <Button onClick={() => setSelectedIndex((prev) => prev - 1)}>
            <ChevronLeftIcon />
          </Button>
        </div>
        <ExtendedNextButton />
      </div>
    </form>
  );
};

export default PaymentValues;
