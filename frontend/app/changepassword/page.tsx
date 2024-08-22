"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import logo from "../../assets/logo.svg";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (password === "" || confirmPassword === "") {
      toast({
        variant: "destructive",
        title: "Ops! Algo deu errado!",
        description: "Por favor, preencha todos os campos corretamente.",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não coincidem!",
        description: "As senhas digitadas não são iguais.",
      });
      return;
    }
    console.log("Senha trocada com sucesso!", { password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAF5]">
      <div className="w-full max-w-lg px-8 py-[100px] space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-10">
          <Image src={logo} alt="Logo" className="mx-auto mb-10 h-12" />
          <h2 className="text-2xl font-bold">Troque a sua senha.</h2>
          <p className="mt-2 text-sm text-gray-600">Agora você pode trocar a sua senha, preencha os campos abaixo.</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite a sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="absolute top-[30px] right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirme a sua senha
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme a sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div
                className="absolute top-[30px] right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>
        </div>

        <Button className="w-full py-8 mt-4 text-white bg-blue-900 rounded-lg" onClick={handleSubmit}>
          Trocar senha
        </Button>
      </div>
    </div>
  );
};

export default ChangePassword;
