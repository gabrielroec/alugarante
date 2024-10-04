"use client";
import React, { Fragment } from "react";
import FirstForm from "./FirstForm";
import HeroSecond from "@/assets/HeroSecond.svg";
import Image from "next/image";
import { Button } from "./ui/button";

const Second = () => {
  const scrollToSecond = () => {
    const secondElement = document.getElementById("second-section");
    if (secondElement) {
      secondElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  return (
    <Fragment>
      {/* Adicione o id que será usado para rolar até esta seção */}
      <div id="second-section" className="container shadow-2xl py-20 px-20 pb-0 rounded-3xl relative -top-10 bg-white max-md:px-4">
        <div className="bg-[#E7EDDA] py-20 px-16 rounded-3xl max-md:px-4 max-md:py-8">
          <h1 className="text-4xl font-bold text-center max-md:text-3xl">
            Plano <span className="text-[#003853]">Alu</span>
            <span className="text-[#87A644]">garante</span>
          </h1>
          <p className="text-center mt-2 max-md:text-base">Selecione suas opções abaixo</p>
          <FirstForm />
        </div>

        <section className="py-16 max-lg:flex-col relative pb-0">
          <div className="container mx-auto px-4 flex items-center gap-5 max-lg:flex-col">
            <div className="mt-8">
              <Image src={HeroSecond} alt="hero" />
            </div>
            <div className="text-left w-1/2 max-lg:w-full max-lg:text-center">
              <h1 className="text-4xl font-bold mb-3">
                Plano <span className="text-[#003853]">Alu</span>
                <span className="text-[#87A644] max-md:text-3xl">garante</span> é diferente de tudo que você já viu!
              </h1>
              <p className="text-base mb-6 text-[#0D0D0D] max-lg:mx-auto">
                A Alugarante é uma empresa inovadora que redefine a forma como os proprietários garantem a segurança de seus aluguéis.
                Inspirados por empresas de tecnologia como Netflix, Uber e Airbnb, oferecemos uma solução moderna e eficiente para
                proprietários que preferem administrar diretamente seus imóveis, sem intermediários.<br></br>
                <br></br> Proporcionamos uma garantia de aluguel acessível e confiável. Com a Alugarante, você contrata diretamente a fiança
                locatícia sem nenhum custo adicional para você. A contratação é simples e direta: você administra a locação do seu imóvel,
                enquanto a garantia é paga pelo inquilino.<br></br>
                <br></br> Além de garantir o pagamento do aluguel, oferecemos uma assessoria completa para que você possa realizar o
                contrato de locação com total segurança. Nossa equipe é altamente capacitada e possui um profundo conhecimento da Lei do
                Inquilinato, oferecendo suporte técnico e jurídico em todas as etapas da locação. Combinamos tecnologia e inovação para
                proporcionar a tranquilidade financeira que você precisa. Com a Alugarante, seu aluguel está garantido, enquanto você
                continua a administrar seu imóvel da forma que preferir, sem complicações e sem intermediários.
              </p>
            </div>
          </div>
          <Button
            onClick={scrollToSecond}
            className="bg-[#87A644] text-white px-6 py-9 rounded-lg hover:bg-green-600 mt-10 w-full relative top-7"
          >
            Faça uma cotação agora!
          </Button>
        </section>
      </div>
    </Fragment>
  );
};

export default Second;
