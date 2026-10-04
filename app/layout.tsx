import type { ReactNode } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ServiciosProvider } from '@/presentation/ServiciosProvider';
import './globals.css';

/**
 * El proveedor envuelve toda la aplicación porque los servicios se construyen
 * una única vez (composition root) y se inyectan por contexto, en lugar de
 * que cada componente importe un singleton.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="bg-black">
      <body className="bg-black text-white min-h-screen flex flex-col justify-between antialiased">
        <ServiciosProvider>
          <Navbar />
          <div className="flex-grow bg-black">{children}</div>
          <Footer />
        </ServiciosProvider>
      </body>
    </html>
  );
}