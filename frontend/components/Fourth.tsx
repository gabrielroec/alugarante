import React from "react";
import { Button } from "./ui/button";

const Fourth = () => {
  return (
    <div className="bg-[#87A644] py-16 rounded-t-[40px]">
      <div className="container">
        <h1 className="text-4xl font-bold mb-3 text-center text-white">
          Escolha a <span className="text-[#003853]">Alu</span>
          <span className="text-white">garante</span> e Administre seu Imóvel <br></br>com Tranquilidade
        </h1>
        <p className="text-base mb-6  text-center  max-lg:mx-auto text-white">
          Na Alugarante, entendemos as suas necessidades e oferecemos uma solução completa e sem complicações. Com<br></br> nossa tecnologia
          e equipe especializada, garantimos o pagamento do seu aluguel, proporcionando a segurança<br></br> que você precisa para
          administrar seu imóvel diretamente.
        </p>
        <Button className="text-white w-full py-8 bg-[#024059] mt-4">Fazer cotação</Button>
      </div>
    </div>
  );
};

export default Fourth;
