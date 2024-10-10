import React from "react";

import Deals from "src/components/admin/deals";
import Container from "src/components/common/container";

interface AdminProps {}

const Admin: React.FC<AdminProps> = () => {
  return (
    <Container>
      <div className="flex flex-col gap-[10px]">
        <Deals />
      </div>
    </Container>
  );
};

export default Admin;
