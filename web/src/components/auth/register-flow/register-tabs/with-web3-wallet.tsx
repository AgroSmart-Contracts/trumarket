import { ADAPTER_STATUS, WALLET_ADAPTERS } from "@web3auth/base";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";

import Button from "src/components/common/button";
import { CheckBox } from "src/components/common/checkbox";
import Input from "src/components/common/input";
import { useModal } from "src/context/modal-context";
import { useWeb3AuthContext } from "src/context/web3-auth-context";
import { EmailSteps, WalletProviders } from "src/interfaces/global";
import { handleOTP, handleRequestAuth0JWT, uiConsole } from "src/lib/helpers";
import { useAppDispatch, useAppSelector } from "src/lib/hooks";
import { AuthTMModalView } from "src/pages";
import { selectIsTermsAndConditionsChecked, setTermsAndConditionsChecked } from "src/store/UiSlice";

import OTPInputWrapper from "../../otp-input-wrapper";

interface WithWeb3WalletProps { }

const WithWeb3Wallet: React.FC<WithWeb3WalletProps> = () => {
  const router = useRouter();
  const { openModal } = useModal();
  const dispatch = useAppDispatch();
  const isTermsAndConditionChecked = useAppSelector(selectIsTermsAndConditionsChecked);
  const { web3authPnPInstance, setJWT, initPnP } = useWeb3AuthContext();
  const [emailRegisterStep, setEmailRegisterStep] = useState<EmailSteps>(EmailSteps.STEP_1);
  const [walletProvider, setWalletProvider] = useState<WalletProviders | null>(null);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [verificationCodeLoading, setVerificationCodeLoading] = useState(false);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const {
    handleSubmit,
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<{ terms: boolean; email: string }>({
    defaultValues: {
      terms: isTermsAndConditionChecked,
    },
  });

  const handleSubmitForm = async (data: { terms: boolean; email: string }) => {
    setVerificationCodeLoading(true);
    await handleOTP(data.email, () => setEmailRegisterStep(EmailSteps.STEP_2));
    setVerificationCodeLoading(false);
  };

  const handleAccountWithMetamask = async (auth0Jwt: string) => {
    if (!web3authPnPInstance) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    try {
      setSignUpLoading(true);

      if (web3authPnPInstance.status === ADAPTER_STATUS.CONNECTED) {
        await web3authPnPInstance.logout();
      }

      try {
        await web3authPnPInstance.connectTo(WALLET_ADAPTERS.METAMASK);
      } catch (error) {
        console.warn('error', error)
      }
      const jwt = await web3authPnPInstance.authenticateUser();

      if (web3authPnPInstance.status === ADAPTER_STATUS.CONNECTED) {
        window.location.href = `/account-type?web3authToken=${jwt.idToken}&auth0Token=${auth0Jwt}`;
      }
    } catch (err) {
      uiConsole(err);
      await web3authPnPInstance.logout();
    } finally {
      setSignUpLoading(false);
    }
  };

  const handleAccountWithWalletConnect = async (auth0Jwt: string) => {
    if (!web3authPnPInstance) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    try {
      setSignUpLoading(true);

      if (web3authPnPInstance.status === ADAPTER_STATUS.CONNECTED) {
        await web3authPnPInstance.logout();
      }

      await web3authPnPInstance.connectTo(WALLET_ADAPTERS.WALLET_CONNECT_V2);
      const jwt = await web3authPnPInstance.authenticateUser();

      if (web3authPnPInstance.status === ADAPTER_STATUS.CONNECTED) {
        window.location.href = `/account-type?web3authToken=${jwt.idToken}&auth0Token=${auth0Jwt}`;
      }
    } catch (err) {
      uiConsole(err);
      await web3authPnPInstance.logout();
    } finally {
      setSignUpLoading(false);
    }
  };

  const handleConfirm = async (OTPCode: string) => {
    setConfirmationLoading(true);
    await handleRequestAuth0JWT(
      getValues("email"),
      OTPCode as string,
      walletProvider === WalletProviders.METAMASK ? handleAccountWithMetamask : handleAccountWithWalletConnect,
    );
    setConfirmationLoading(false);
  };

  return (
    <div>
      {emailRegisterStep === EmailSteps.STEP_1 ? (
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <p className="mb-[5px] text-[13px] leading-[1.2em] tracking-normal text-[#00000099]">Email address</p>
          <Input
            name="email"
            placeholder="Please provide email"
            register={register("email", {
              required: "Email field is required!",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Email format is invalid!",
              },
            })}
            errorMessageClass="!relative !left-0"
            hasError={Boolean(errors.email)}
            errors={errors}
          />
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            name="terms"
            render={({ field: { onChange, onBlur, value } }) => (
              <div className="mb-[20px] mt-[14px] flex items-center gap-[8px]">
                <CheckBox
                  id="terms"
                  checkBoxName="terms"
                  checkBoxValue={isTermsAndConditionChecked}
                  classes={classNames({
                    "text-tm-danger ": errors.terms,
                    "border-black": !errors.terms,
                  })}
                  setChecked={(checked) => {
                    dispatch(setTermsAndConditionsChecked({ state: checked }));
                    setValue("terms", checked, { shouldValidate: true });
                  }}
                />
                <p
                  className={classNames("text-[13px]", {
                    "text-tm-danger ": errors.terms,
                    "text-tm-black-80": !errors.terms,
                  })}
                >
                  I accept{" "}
                  <span
                    className="mr-[4px] cursor-pointer underline"
                    onClick={() => openModal(AuthTMModalView.TERMS_AND_CONDITIONS)}
                  >
                    Terms and Conditions
                  </span>
                  and
                  <span
                    className="ml-[4px] cursor-pointer underline"
                    onClick={() => openModal(AuthTMModalView.PRIVACY_POLICY)}
                  >
                    Privacy Policy
                  </span>
                </p>
              </div>
            )}
          />
          <div className="flex flex-wrap justify-between gap-[14px] md:flex-nowrap">
            <Button
              loading={walletProvider === WalletProviders.METAMASK && verificationCodeLoading}
              disabled={walletProvider === WalletProviders.METAMASK && verificationCodeLoading}
              onClick={() => setWalletProvider(WalletProviders.METAMASK)}
            >
              <div className="flex w-full items-center justify-between">
                <p className="text-[13px] font-semibold leading-[1.2em]">MetaMask</p>
                <Image height={25} width={25} src="/assets/metamask.png" alt="MetaMask" />
              </div>
            </Button>
            <Button
              loading={walletProvider === WalletProviders.WALLET_CONNECT && verificationCodeLoading}
              disabled={walletProvider === WalletProviders.WALLET_CONNECT && verificationCodeLoading}
              onClick={() => setWalletProvider(WalletProviders.WALLET_CONNECT)}
            >
              <div className="flex w-full items-center justify-between">
                <p className="text-[13px] font-semibold leading-[1.2em]">Wallet Connect</p>
                <Image height={25} width={25} src="/assets/walletconnect.png" alt="wallet-connect" />
              </div>
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-[14px]">
          <OTPInputWrapper
            email={getValues("email")}
            setVerificationCode={setVerificationCode}
            handleConfirm={handleConfirm}
            resend={() => handleSubmitForm({ terms: true, email: getValues("email") })}
            resendLoading={verificationCodeLoading}
            setEmailRegisterStep={setEmailRegisterStep}
          />
          <div className="mt-[11px] w-full">
            <Button
              loading={confirmationLoading || signUpLoading}
              onClick={() => handleConfirm(verificationCode)}
              disabled={verificationCode?.length !== 6 || confirmationLoading || signUpLoading}
            >
              <p>Confirm</p>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithWeb3Wallet;
