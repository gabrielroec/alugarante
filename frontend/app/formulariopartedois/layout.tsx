import { Suspense } from "react";

export default function FormularioLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div>Carregando formulário...</div>}>{children}</Suspense>;
}
