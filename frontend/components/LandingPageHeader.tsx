import React from "react";
import logo from "../assets/logo.svg";
import Image from "next/image";
import { Button } from "./ui/button";

const LandingPageHeader = () => {
  return (
    <div className="container flex items-center justify-between py-5">
      <Image src={logo} alt="logo" />
      <Button className="bg-[#87A644] hover:bg-[#7a973c] px-8 py-6 rounded-2xl">Fazer cotação</Button>
    </div>
  );
};

export default LandingPageHeader;
