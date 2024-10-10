import Head from "next/head";
import React from "react";

import Container from "src/components/common/container";
import ShipmentTabView from "src/components/dashboard/shipment-tab-view";
import { APP_NAME } from "src/constants";

interface DashboardMainProps {}

const DashboardMain: React.FC<DashboardMainProps> = () => {
  return (
    <>
      <Head>
        <title>{APP_NAME} - Dashboard</title>
      </Head>
      <div className="py-[50px]">
        <Container>
          <ShipmentTabView />
        </Container>
      </div>
    </>
  );
};

export default DashboardMain;
