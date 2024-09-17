"use client"; // Este componente é um Client Component

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import "../styles/globals.css";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <ToastProvider>
            {children}
            <Toaster />
          </ToastProvider>
        </Provider>
      </body>
    </html>
  );
}
