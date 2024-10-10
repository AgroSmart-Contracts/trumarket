import React from "react";

import Container from "src/components/common/container";
import StepCounter from "src/components/common/step-counter";

import LoginEmail from "./login-email";
import AllProviders from "./all-providers";

interface LoginFlowProps {}

const LoginFlow: React.FC<LoginFlowProps> = () => {
  return (
    <div className="flex w-full justify-center pt-[60px] md:pt-[108px]">
      <div className="flex w-full flex-col items-center  overflow-x-hidden">
        <div className="pb-[40px]">
          <h1 className="text-[26px] font-bold leading-[1.2em] tracking-normal text-tm-black-80">Sign In</h1>
        </div>
        <Container>
          <div className="mx-auto w-full max-w-[480px]">
            <div className="rounded-tl-[4px] rounded-tr-[4px]  bg-tm-gray-light p-[30px]">
              <LoginEmail />
            </div>
            <div className="h-[1px] w-full rounded-[4px] bg-tm-black-20"></div>
            <div className="rounded-bl-[4px] rounded-br-[4px] bg-tm-gray-light px-[30px] pb-[30px] pt-[20px]">
              <p className="pb-[14px] text-center text-[13px] leading-[1.2em] text-tm-black-80 opacity-80">
                Or Sign in with
              </p>
              <AllProviders />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default LoginFlow;
