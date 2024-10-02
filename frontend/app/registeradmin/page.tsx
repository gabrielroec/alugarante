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
import api from "@/services/api";

const RegisterUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isAdmin, setIsAdmin] = useState("não");
  const [foto, setFoto] = useState(null);
  const { toast } = useToast();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!nome || !telefone || !email || !senha || !foto || !isAdmin) {
      toast({
        variant: "destructive",
        title: "Ops! Algo deu errado!",
        description: "Verifique se você preencheu todos os campos.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("telefone", telefone);
    formData.append("email", email);
    formData.append("senha", senha);
    formData.append("isAdmin", isAdmin);
    formData.append("foto", foto);

    try {
      const response = await api.post("/users/register", formData);

      toast({
        variant: "default",
        title: "Sucesso!",
        description: "Conta criada com sucesso.",
      });

      // Redirecionar ou limpar o formulário
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: "Erro ao criar nova conta, certifique-se que preencheu todos os campos.",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAF5]">
      <div className="w-full max-w-lg px-8 py-[100px] space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-10">
          <Image src={logo} alt="Logo" className="mx-auto mb-10 h-12" />
          <h2 className="text-2xl font-bold">Registro.</h2>
          <p className="mt-2 text-sm text-gray-600">Crie uma conta para acessar o dashboard!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <Label htmlFor="nome" className="block text-sm font-medium text-gray-700">
              Nome
            </Label>
            <Input id="nome" type="text" placeholder="Digite o seu nome completo" value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
              Telefone
            </Label>
            <Input
              id="telefone"
              type="text"
              placeholder="Digite o seu telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input id="email" type="email" placeholder="Digite o seu email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="relative">
            <Label htmlFor="senha" className="block text-sm font-medium text-gray-700">
              Senha
            </Label>
            <Input
              id="senha"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <div
              className="absolute top-[30px] right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <div>
            <Label htmlFor="isAdmin" className="block text-sm font-medium text-gray-700">
              É administrador?
            </Label>
            <select
              id="isAdmin"
              value={isAdmin}
              onChange={(e) => setIsAdmin(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-900 focus:ring focus:ring-blue-900 focus:ring-opacity-50"
            >
              <option value="não">Não</option>
              <option value="sim">Sim</option>
            </select>
          </div>

          <div>
            <Label htmlFor="foto" className="block text-sm font-medium text-gray-700">
              Foto
            </Label>
            <input
              id="foto"
              name="foto"
              type="file"
              accept="image/*"
              onChange={(e) => {
                console.log("Arquivo selecionado:", e.target.files[0]);
                setFoto(e.target.files[0]);
              }}
            />
          </div>

          <Button type="submit" className="w-full py-8 mt-4 text-white bg-blue-900 rounded-lg">
            Registrar
          </Button>

          <div className="flex justify-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/loginadmin" className="text-blue-900 hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
