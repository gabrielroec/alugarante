"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import logo from "../../assets/logo.svg";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const LoginAdmin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (email == "" || password == "") {
      toast({
        variant: "destructive",
        title: "Ops! Alguma coisa deu errador!",
        description: "Verifique se você preencheu os campos corretamente",
      });
      return;
    }
    console.log("Formulário enviado com sucesso!", { email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAF5]">
      <div className="w-full max-w-lg px-8 py-[100px] space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-10">
          <Image src={logo} alt="Logo" className="mx-auto mb-10 h-12" />
          <h2 className="text-2xl font-bold">Login.</h2>
          <p className="mt-2 text-sm text-gray-600">Bem-vindo de volta! Faça o seu login para acessar o dashboard!</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input id="email" type="email" placeholder="Digite o seu email aqui" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="relative">
          <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Senha
          </Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha aqui"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="absolute top-[30px] right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        <div className="flex justify-end !mt-0">
          <Link href="#" className="text-sm text-gray-400 hover:underline">
            Esqueci a minha senha
          </Link>
        </div>

        <Button className="w-full py-8 mt-4 text-white bg-blue-900 rounded-lg" onClick={handleSubmit}>
          Entrar
        </Button>
      </div>
    </div>
  );
};

export default LoginAdmin;
