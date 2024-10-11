"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.svg";
import dashboardIcon from "../assets/dashboard.svg";
import clientsIcon from "../assets/clientes.svg";

const Sidebar = () => {
  const [currentPath, setCurrentPath] = useState("");

  // Executa apenas no cliente para obter o pathname
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  return (
    <div className="w-[20%] max-lg:w-[25%] h-screen bg-white border-r border-[f5f5f5]">
      <div className="p-4">
        <Image src={logo} alt="Alugarante Logo" width={150} height={50} />
      </div>
      <nav className="mt-8">
        <ul className="px-4 flex flex-col gap-4">
          <li>
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 text-gray-700 rounded-md ${
                currentPath === "/dashboard" ? "bg-[#E7EDDA] " : "hover:bg-[#E7EDDA]"
              }`}
            >
              <div
                className={`flex items-center justify-center  rounded-md p-3 ${
                  currentPath === "/dashboard" ? "bg-[#87A644]" : "bg-[#F5F5F5]"
                }`}
              >
                <Image src={dashboardIcon} alt="Dashboard" width={20} height={20} />
              </div>
              <p className={`${currentPath === "/dashboard" ? "text-[#87A644]" : ""}`}>Início</p>
            </Link>
          </li>
          <li>
            <Link
              href="/clientes"
              className={`flex items-center gap-2 rounded-md text-gray-700 ${
                currentPath === "/clientes" ? "bg-[#D4E0C9]" : "hover:bg-[#E7EDDA]"
              }`}
            >
              <div
                className={`flex items-center justify-center  rounded-md p-3 ${
                  currentPath === "/clientes" ? "bg-[#87A644]" : "bg-[#F5F5F5]"
                }`}
              >
                <Image
                  src={clientsIcon}
                  alt="Clientes"
                  width={20}
                  height={20}
                  className={`${currentPath === "/clientes" ? "brightness-200" : ""}`}
                />
              </div>
              <p className={`${currentPath === "/clientes" ? "text-[#87A644]" : ""}`}>Lista de clientes</p>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
