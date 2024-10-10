import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import { Envelope, EnvelopeOpen } from "@phosphor-icons/react";
import classNames from "classnames";
import Link from "next/link";
import * as React from "react";
import { ViewportList } from "react-viewport-list";

import { NotificationsService } from "src/controller/NotificationsAPI.service";
import { INotification } from "src/interfaces/notifications";
export default function NotificationMenu({
  children,
  notifications,
  refetch,
}: {
  children: React.ReactElement;
  notifications: INotification[];
  refetch: () => void;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const markNotificationAsSeen = async (id: string, dealId: string) => {
    await NotificationsService.markNotificationAsSeen(id, dealId);
    await refetch();
  };

  const ref = React.useRef<HTMLDivElement | null>(null);
  return (
    <React.Fragment>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        {children}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          zIndex: 99999,
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div ref={ref} className="scroll-container max-h-[400px] w-full min-w-[400px] max-w-[400px] overflow-y-auto">
          <ViewportList viewportRef={ref} items={notifications}>
            {(item) => (
              <Link onClick={() => markNotificationAsSeen(item.id, item.dealId)} href={item.redirectUrl}>
                <div
                  key={item.id}
                  className={classNames("item", {
                    "opacity-60": item.read,
                  })}
                >
                  <div className="flex cursor-pointer items-start gap-[10px] border-y border-y-tm-black-20 px-[20px] py-[10px] transition-transform duration-300 hover:bg-tm-black-20">
                    <div className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-full border border-tm-black-20">
                      {item.read ? (
                        <EnvelopeOpen size={32} weight="duotone" />
                      ) : (
                        <Envelope size={32} weight="duotone" />
                      )}
                    </div>
                    <div className="mt-[5px] flex flex-col gap-[4px]">
                      <p className="text-[14px] font-bold leading-[0.9em] tracking-normal">{item.subject}</p>
                      <p className="text-[13px] font-medium  leading-[1.2em] tracking-normal text-tm-black-80 opacity-80">
                        {item.message}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </ViewportList>
        </div>
      </Menu>
    </React.Fragment>
  );
}
