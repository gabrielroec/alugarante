import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.svg";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white border-r border-[f5f5f5]">
      <div className="p-4">
        <Image src={logo} alt="Alugarante Logo" width={150} height={50} />
      </div>
      <nav className="mt-8">
        <ul>
          <li>
            <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Início
            </Link>
          </li>
          <li>
            <Link href="/clients" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Lista de Clientes
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
