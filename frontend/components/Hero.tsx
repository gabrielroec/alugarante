"use client";
import { Fragment } from "react";
import heroImg from "@/assets/hero.svg";
import Image from "next/image";
import { Button } from "./ui/button";
const Hero = () => {
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
      <section className="bg-gradient-to-t from-[#F3F6ED] to-[#fff] py-16 max-md:flex-col relative rounded-[40px]">
        <div className="container mx-auto px-4 flex flex-col items-center md:flex-row">
          <div className="text-left w-1/2 max-md:w-full max-md:text-center">
            <h1 className="text-5xl font-bold mb-4 text-[#0D0D0D] max-md:text-3xl">
              Administre a locação do seu imóvel, nós garantimos o aluguel.
            </h1>
            <p className="text-base mb-6 text-[#0D0D0D] w-2/3 max-md:mx-auto max-md:texte-base">
              A Alugarante é especializada em fiança locatícia, oferecendo segurança e tranquilidade para proprietários que preferem uma
              gestão direta, sem intermediários.
            </p>
            <Button onClick={scrollToSecond} className="bg-[#87A644] hover:bg-[#7a973c] px-8 py-6 rounded-2xl">
              Faça uma cotação agora
            </Button>
          </div>
          <div className="mt-8 md:mt-0 md:w-1/2">
            <Image src={heroImg} alt="hero" />
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Hero;
