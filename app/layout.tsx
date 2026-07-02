// app/layout.tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css"; // Estilos globales de Tailwind

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // SOLUCIÓN 1: Le metemos bg-black a la etiqueta html para blindar el fondo de los navegadores móviles
    <html lang="es" className="bg-black">
      {/* SOLUCIÓN 2: Añadimos bg-black por seguridad también en el body */}
      <body className="bg-black text-white min-h-screen flex flex-col justify-between antialiased">
        
        {/* El Navbar se renderiza de forma global aquí arriba */}
        <Navbar />
        
        {/* SOLUCIÓN 3: Forzamos bg-black en el contenedor que envuelve todas tus pantallas */}
        <div className="flex-grow bg-black">
          {children} {/* Aquí Next.js inyectará dinámicamente el Home o el Login */}
        </div>

        <Footer />
      </body>
    </html>
  );
}