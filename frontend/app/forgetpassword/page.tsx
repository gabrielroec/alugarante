"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import logo from "../../assets/logo.svg";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const PasswordRecovery = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (email === "") {
      toast({
        variant: "destructive",
        title: "Ops! Algo deu errado!",
        description: "Por favor, preencha o campo de email corretamente.",
      });
      return;
    }

    console.log("Link de recuperação enviado com sucesso!", { email });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAF5]">
      <div className="w-full max-w-lg px-8 py-[100px] space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-10">
          <Image src={logo} alt="Logo" className="mx-auto mb-10 h-12" />
          <h2 className="text-2xl font-bold">Recuperação de senha.</h2>
          <p className="mt-2 text-sm text-gray-600">Preencha os campos para resgatar a sua senha.</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input id="email" type="email" placeholder="Digite o seu email aqui" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <Button className="w-full py-8 mt-4 text-white bg-blue-900 rounded-lg" onClick={handleSubmit}>
          Enviar link de recuperação
        </Button>
      </div>
    </div>
  );
};

export default PasswordRecovery;
