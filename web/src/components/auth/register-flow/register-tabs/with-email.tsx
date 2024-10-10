import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import classNames from "classnames";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { ADAPTER_STATUS } from "@web3auth/single-factor-auth";

import Button from "src/components/common/button";
import { CheckBox } from "src/components/common/checkbox";
import Input from "src/components/common/input";
import VerificationInputComponent from "src/components/common/verification-input";
import { useWeb3AuthContext } from "src/context/web3-auth-context";
import { checkWeb3AuthInstance, handleOTP, parseToken, uiConsole, handleRequestAuth0JWT } from "src/lib/helpers";
import { EmailSteps } from "src/interfaces/global";
import { useModal } from "src/context/modal-context";
import { AuthTMModalView } from "src/pages";
import { useAppDispatch, useAppSelector } from "src/lib/hooks";
import { selectIsTermsAndConditionsChecked, setTermsAndConditionsChecked } from "src/store/UiSlice";

import OTPInputWrapper from "../../otp-input-wrapper";

interface WithEmailProps {}

const WithEmail: React.FC<WithEmailProps> = () => {
  const { openModal } = useModal();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isTermsAndConditionChecked = useAppSelector(selectIsTermsAndConditionsChecked);
  const { web3authSfa, setIsLoggingIn, setIsLoggedIn, getUserInfo, isLoggingIn, setJWT, init } = useWeb3AuthContext();
  const { getIdTokenClaims, loginWithRedirect } = useAuth0();
  const [emailRegisterStep, setEmailRegisterStep] = useState<EmailSteps>(EmailSteps.STEP_1);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [verificationCodeLoading, setVerificationCodeLoading] = useState(false);
  const [confirmationLoading, setConfirmationLoading] = useState(false);

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

  const handleConfirm = async (OTPcode: string) => {
    setConfirmationLoading(true);
    await handleRequestAuth0JWT(getValues("email"), OTPcode as string, handleAccount);
    setConfirmationLoading(false);
  };

  const handleAccount = async (auth0Jwt: string) => {
    await init();
    // trying logging in with the Single Factor Auth SDK
    try {
      checkWeb3AuthInstance(web3authSfa);

      setIsLoggingIn(true);

      const { email } = parseToken(auth0Jwt);

      const subVerifierInfoArray = [
        {
          verifier: "auth0-passwordless",
          idToken: auth0Jwt!,
        },
      ];

      await web3authSfa.connect({
        verifier: "trumarket-w3a-auth0-2",
        verifierId: email,
        idToken: auth0Jwt,
        subVerifierInfoArray,
      });

      const jwt = await web3authSfa.authenticateUser();

      if (web3authSfa.status === ADAPTER_STATUS.CONNECTED) {
        window.location.href = `/account-type?web3authToken=${jwt.idToken}&auth0Token=${auth0Jwt}`;
      }

      setIsLoggedIn(true);
    } catch (err) {
      // Single Factor Auth SDK throws an error if the user has already enabled MFA
      // One can use the Web3AuthNoModal SDK to handle this case
      console.error(err);
    } finally {
      setIsLoggingIn(true);
    }
  };

  return (
    <div>
      {emailRegisterStep === EmailSteps.STEP_1 ? (
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <p className="text-tm-theme-text mb-[5px] text-[13px] leading-[1.2em] tracking-normal">Email address</p>
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
                    "text-tm-theme-text": !errors.terms,
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
          <Button loading={verificationCodeLoading} disabled={verificationCodeLoading}>
            <p>Send me an email with code</p>
          </Button>
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
              loading={isLoggingIn || confirmationLoading}
              onClick={() => handleConfirm(verificationCode)}
              disabled={verificationCode?.length !== 6 || isLoggingIn || confirmationLoading}
            >
              <p>Confirm</p>
            </Button>
          </div>
        </div>
      )}
      {/* <button onClick={() => router.push("/test2")}>sss</button> */}
    </div>
  );
};

export default WithEmail;
