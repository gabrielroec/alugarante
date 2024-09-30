"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Importação correta
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import api from "@/services/api";
import { EyeOff, Eye } from "lucide-react";
import Image from "next/image";
import logo from "../../assets/logo.svg";

const LoginAdmin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState(""); // Altere para 'senha' para corresponder ao backend
  const { toast } = useToast();
  const router = useRouter(); // Uso correto do useRouter

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !senha) {
      toast({
        variant: "destructive",
        title: "Ops! Algo deu errado!",
        description: "Verifique se você preencheu todos os campos corretamente.",
      });
      return;
    }

    try {
      const response = await api.post("/users/login", { email, senha });
      const { token, user } = response.data;

      // Armazene o token e os dados do usuário no localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast({
        variant: "default",
        title: "Sucesso!",
        description: "Login realizado com sucesso.",
      });

      // Redirecionar para o dashboard ou outra página protegida
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: error.response?.data?.message || "Erro desconhecido.",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAF5]">
      <div className="w-full max-w-lg px-8 py-[100px] space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-10">
          <Image src={logo} alt="Logo" className="mx-auto mb-10 h-12" />
          <h2 className="text-2xl font-bold">Login.</h2>
          <p className="mt-2 text-sm text-gray-600">Bem-vindo de volta! Faça o seu login para acessar o dashboard!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </Label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Digite o seu email aqui"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-class" // Substitua por suas classes de estilo
            />
          </div>

          <div className="relative">
            <Label htmlFor="senha" className="block text-sm font-medium text-gray-700">
              Senha
            </Label>
            <input
              id="senha"
              name="senha"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha aqui"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="input-class" // Substitua por suas classes de estilo
            />
            <div
              className="absolute top-[30px] right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <div className="flex justify-end !mt-0">
            <Link href="#" className="text-sm text-gray-400 hover:underline">
              Esqueci a minha senha
            </Link>
          </div>

          <Button type="submit" className="w-full py-8 mt-4 text-white bg-blue-900 rounded-lg">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;
