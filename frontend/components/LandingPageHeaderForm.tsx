import React, { Fragment } from "react";
import logo from "../assets/logo.svg";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

const LandingPageHeaderForm = () => {
  return (
    <Fragment>
      <div className="py-5 bg-[#D4DFBC]">
        <div className="container flex items-center justify-between">
          <Image src={logo} alt="logo" />
          <Link className="bg-[#87A644] hover:bg-[#7a973c] px-8 py-4 rounded-2xl text-white" href="/">
            Voltar para a home
          </Link>
        </div>
      </div>
      <div className="bg-[#E7EDDA] py-5">
        <div className="container text-center">
          <h1 className="font-bold text-xl">
            Agora só precisamos de <br></br>mais algumas informações
          </h1>
        </div>
      </div>
    </Fragment>
  );
};

export default LandingPageHeaderForm;
