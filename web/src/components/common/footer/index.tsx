import React from "react";

import Container from "../container";

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-tm-charcoal-blue">
      <Container>
        <div className="flex items-center justify-between  px-[30px] py-[20px] text-[12px] font-normal leading-[1.3em] tracking-normal text-tm-white ">
          <p>Trumarket @{new Date().getFullYear()}</p>
          <p>v 0.1.0</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
