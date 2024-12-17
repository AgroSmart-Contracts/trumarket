import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import Deals from "src/components/admin/deals";
import Users from "src/components/admin/users";
import Container from "src/components/common/container";
import { AdminService } from "src/controller/AdminAPI.service";

interface AdminProps {}

const Admin: React.FC<AdminProps> = () => {
  const { pathname } = useRouter();
  const {
    data: users,
    isLoading: isDealsDataLoading,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["get-users"],
    queryFn: () => AdminService.getUsers(),
    placeholderData: {
      data: [],
    },
  });

  return (
    <Container>
      <div className="flex flex-col gap-[10px]">
        <div className="flex gap-[10px]">
          <Link
            href="/admin"
            className={`hover:text-tm-black rounded px-4 py-2  ${pathname === "/admin" ? "text-tm-black" : "text-tm-blue"}`}
          >
            Agreements
          </Link>
          <Link
            href="/admin/users"
            className={`hover:text-tm-black rounded px-4 py-2  ${pathname === "/admin/users" ? "text-tm-black" : "text-tm-blue"}`}
          >
            Users
          </Link>
        </div>

        <Users />
      </div>
    </Container>
  );
};

export default Admin;
