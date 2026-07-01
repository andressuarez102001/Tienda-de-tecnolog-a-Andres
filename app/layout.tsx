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
    <html lang="es">
      <body className="bg-black text-white min-h-screen flex flex-col justify-between">
        {/* El Navbar se renderiza de forma global aquí arriba */}
        <Navbar />
        
        <div className="flex-grow">
          {children} {/* Aquí Next.js inyectará dinámicamente el Home o el Login */}
        </div>

        <Footer />
      </body>
    </html>
  );
}