import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth0 } from "@auth0/auth0-react";

import Container from "src/components/common/container";
import StepCounter from "src/components/common/step-counter";

import RegisterTabs from "./register-tabs";

interface RegisterFlowProps {}

const RegisterFlow: React.FC<RegisterFlowProps> = () => {
  const { push, query } = useRouter();
  const { getIdTokenClaims } = useAuth0();

  const checkSocial = async () => {
    const resp = await getIdTokenClaims();

    if (resp?.__raw) {
      if (query.sign_in) {
        push(`/social/google?code=${resp?.__raw}&type=sign_in`);
      } else {
        push(`/social/google?code=${resp?.__raw}`);
      }
    }
  };

  useEffect(() => {
    if (query.code) {
      checkSocial();
    }
  }, [checkSocial, query]);

  return (
    <div className="flex w-full justify-center pt-[60px] md:pt-[90px]">
      <div className="flex w-full flex-col items-center  overflow-x-hidden">
        <div className="pb-[120px]">
          <h1 className="text-[26px] font-bold leading-[1.2em] tracking-normal text-tm-black-80">Create an account</h1>
        </div>
        <div className="relative -right-[20px] -top-[75px] w-full">
          <div className="absolute right-1/2">
            <StepCounter classOverrides="!bg-tm-white border border-tm-black-20 !h-[38px] !w-[46px]" invert />
          </div>
          <div className="absolute right-0  top-[18px] -z-20 h-[1px]  w-1/2 bg-tm-black-20"></div>
        </div>
        <Container>
          <div className="flex w-full flex-col  items-center gap-[30px]">
            <div>
              <p className="text-[15px] font-bold leading-[1.2] tracking-normal text-tm-black-80">
                Select authentication method
              </p>
            </div>
            <div className="mx-auto w-full max-w-[480px]">
              <RegisterTabs />
            </div>
            {/* <div className="text-center text-[13px] leading-[1.2em] tracking-normal text-[#00000099]">
              <p>We will automatically create Web3 wallet for you.</p>
              <p className="cursor-pointer underline ">Why do I need this?</p>
            </div> */}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default RegisterFlow;
