export default function Navbar() {
  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-blue-600">
          TecnoStore
        </h1>

        <div className="flex gap-6">
          <a href="/" className="hover:text-blue-600">
            Inicio
          </a>

          <a href="/productos" className="hover:text-blue-600">
            Productos
          </a>

          <a href="/contacto" className="hover:text-blue-600">
            Contacto
          </a>
        </div>

      </div>
    </nav>
  );
}