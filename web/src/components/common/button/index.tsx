import classNames from "classnames";
import React from "react";

import Loading from "../loading";

export enum ButtonVariants {
  FILLED_DARK = "filled_dark",
  FILLED_WHITE = "filled_white",
  FILLED_GRAY = "filled_gray",
  FILLED_GREEN = "filled_green",
  FILLED_BLUE = "filled_blue",
  FILLED_RED = "filled_red",
  FILLED_YELLOW = "filled_yellow",
  FILLED_DANGER = "filled_danger",
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  classOverrides?: string;
  variant?: ButtonVariants;
  loading?: boolean;
  innerClassOverrides?: string;
}

const Button: React.FC<ButtonProps> = ({
  loading,
  classOverrides,
  innerClassOverrides,
  children,
  variant = ButtonVariants.FILLED_DARK,
  ...rest
}) => {
  const buttonVariants = {
    filled_dark: "bg-tm-black-80 text-tm-white",
    filled_white: "bg-tm-white font-bold text-tm-black-80 px-[20px]",
    filled_gray: "bg-tm-black-20",
    filled_green: "bg-tm-green",
    filled_blue: "bg-tm-blue-secondary",
    filled_red: "bg-tm-red",
    filled_yellow: "bg-tm-yellow",
    filled_danger: "bg-tm-danger",
  };

  const variantScheme = buttonVariants[variant];

  return (
    <button
      className={classNames(
        classOverrides,
        variantScheme,
        "w-full rounded-[4px] px-[15px] py-[10px] transition-transform hover:opacity-90 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70",
      )}
      {...rest}
    >
      <div className={classNames("relative flex items-center justify-center gap-[20px]", innerClassOverrides)}>
        {children}
        {loading ? <Loading classOverrides="!h-[18px] !text-[10px] !w-[18px] !fill-tm-white" /> : null}
      </div>
    </button>
  );
};

export default Button;
