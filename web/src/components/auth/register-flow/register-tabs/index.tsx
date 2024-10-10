/* eslint-disable*/
import React, { useState } from "react";
import TabView from "src/components/common/tab-view";

import WithEmail from "./with-email";
import { WithSocial } from "./with-social";
import WithWeb3Wallet from "./with-web3-wallet";

interface RegisterTabProps {}

const RegisterTab: React.FC<RegisterTabProps> = () => {
  const tabHeaders = ["Email Code", "Social Login", "Web3 Wallet"];

  return (
    <div className="w-full">
      <TabView tabHeaders={tabHeaders} tabContent={[<WithEmail />, <WithSocial />, <WithWeb3Wallet />]} />
    </div>
  );
};

export default RegisterTab;
