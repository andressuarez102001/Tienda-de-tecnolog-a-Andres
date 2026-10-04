from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'evidencia_frontend'
ASSETS = OUT / 'recursos'
OUTPUT = OUT / 'Evidencia_2_Desarrollo_del_Frontend.docx'
OUT.mkdir(exist_ok=True)

def set_font(run, name='Aptos', size=None, bold=None, color=None):
    run.font.name = name
    run._element.rPr.rFonts.set(qn('w:ascii'), name)
    run._element.rPr.rFonts.set(qn('w:hAnsi'), name)
    if size: run.font.size = Pt(size)
    if bold is not None: run.bold = bold
    if color: run.font.color.rgb = RGBColor(*color)

def shade(cell, color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd'); shd.set(qn('w:fill'), color); tcPr.append(shd)

def borders(table):
    tblPr = table._tbl.tblPr
    borders = OxmlElement('w:tblBorders')
    for edge in ('top','left','bottom','right','insideH','insideV'):
        tag = OxmlElement(f'w:{edge}'); tag.set(qn('w:val'),'single'); tag.set(qn('w:sz'),'6'); tag.set(qn('w:color'),'D9D9D9'); borders.append(tag)
    tblPr.append(borders)

def set_cell_margins(cell, top=110, start=110, bottom=110, end=110):
    tc = cell._tc; tcPr = tc.get_or_add_tcPr(); tcMar = tcPr.first_child_found_in('w:tcMar')
    if tcMar is None: tcMar = OxmlElement('w:tcMar'); tcPr.append(tcMar)
    for m,v in [('top',top),('start',start),('bottom',bottom),('end',end)]:
        node = tcMar.find(qn(f'w:{m}'))
        if node is None: node = OxmlElement(f'w:{m}'); tcMar.append(node)
        node.set(qn('w:w'),str(v)); node.set(qn('w:type'),'dxa')

def normal_p(doc, text='', size=10.5, space_after=7):
    p = doc.add_paragraph(); p.paragraph_format.space_after = Pt(space_after); p.paragraph_format.line_spacing = 1.15
    r = p.add_run(text); set_font(r, size=size); return p

def heading(doc, text, level=1):
    p = doc.add_paragraph(style=f'Heading {level}'); p.paragraph_format.space_before = Pt(16 if level == 1 else 10); p.paragraph_format.space_after = Pt(7)
    r = p.add_run(text); set_font(r, size=15 if level == 1 else 12, bold=True, color=(0,0,0)); return p

def figure(doc, path, caption, width=6.35):
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_before = Pt(3); p.paragraph_format.space_after = Pt(3)
    p.add_run().add_picture(str(path), width=Inches(width))
    c = doc.add_paragraph(); c.alignment = WD_ALIGN_PARAGRAPH.CENTER; c.paragraph_format.space_after = Pt(9)
    r = c.add_run(caption); set_font(r, size=9, color=(90,90,90)); r.italic = True

def code_image(name, code):
    path = ASSETS / name
    font = ImageFont.truetype('C:/Windows/Fonts/consola.ttf', 20)
    lines = code.splitlines()
    width = max(len(line) for line in lines) * 12 + 125
    height = len(lines) * 31 + 42
    image = Image.new('RGB', (width, height), '#282a36')
    draw = ImageDraw.Draw(image)
    for i, line in enumerate(lines, 1):
        y = 18 + (i - 1) * 31
        draw.text((16, y), f'{i:>2}', font=font, fill='#7f849c')
        draw.text((76, y), line, font=font, fill='#f8f8f2')
    image.save(path)
    return path

home_code = '''const CATEGORIES: CategoryItem[] = [
  { emoji: "🔌", name: "Cargadores", slug: "/cargadores" },
  { emoji: "🔋", name: "Power Banks", slug: "/productos-top" },
  { emoji: "📱", name: "Fundas", slug: "/home-iphone" },
];

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#08080a] text-white">
      <section className="flex flex-col items-center text-center">
        <h1>El estándar superior para tus dispositivos.</h1>
        <Link href="/productos-top">Explorar Catálogo TOP</Link>
      </section>
      {CATEGORIES.map((category) => (
        <Link key={category.name} href={category.slug}>
          {category.emoji} {category.name}
        </Link>
      ))}
    </main>
  );
}'''

service_code = '''const productRepository = new InMemoryProductRepository();
const authenticationGateway = new InMemoryAuthenticationGateway();

export const catalogService = new CatalogService(productRepository);
export const authenticationService = new AuthenticationService(
  authenticationGateway,
  browserAuthSession,
);
export const priceFormatter = new PriceFormatter();
export const whatsappLinkBuilder = new WhatsAppLinkBuilder(priceFormatter);'''

detail_code = '''const [imagenActiva, setImagenActiva] = useState(0);
const [colorSeleccionado, setColorSeleccionado] = useState(0);
const [cantidad, setCantidad] = useState(1);

const producto = catalogService.getProduct(idProducto) ?? DEFAULT_PRODUCT;
const precioTotal = producto.calculateTotal(cantidad);
const whatsappPurchaseLink = whatsappLinkBuilder.createPurchaseLink(
  producto, cantidad, colorNombre, MI_TELEFONO,
);

<button onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}>
  +
</button>
<a href={whatsappPurchaseLink} target="_blank" rel="noopener noreferrer">
  Comprar ahora por WhatsApp / PSE
</a>'''

img_home = code_image('codigo_inicio.png', home_code)
img_services = code_image('codigo_servicios.png', service_code)
img_detail = code_image('codigo_detalle.png', detail_code)

doc = Document()
section = doc.sections[0]
section.top_margin = Inches(.72); section.bottom_margin = Inches(.7); section.left_margin = Inches(.8); section.right_margin = Inches(.8)

styles = doc.styles
styles['Normal'].font.name = 'Aptos'; styles['Normal']._element.rPr.rFonts.set(qn('w:ascii'),'Aptos'); styles['Normal'].font.size = Pt(10.5)
for name in ['Title','Heading 1','Heading 2']:
    styles[name].font.name='Aptos'; styles[name]._element.rPr.rFonts.set(qn('w:ascii'),'Aptos'); styles[name].font.color.rgb=RGBColor(0,0,0)

# Cover
p=doc.add_paragraph(); p.paragraph_format.space_before=Pt(80); p.alignment=WD_ALIGN_PARAGRAPH.CENTER
r=p.add_run('Evidencia 2'); set_font(r,size=15,bold=True,color=(0,102,51))
p=doc.add_paragraph(style='Title'); p.alignment=WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after=Pt(14)
r=p.add_run('Desarrollo del Frontend'); set_font(r,size=29,bold=True,color=(0,0,0))
p=doc.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after=Pt(32)
r=p.add_run('Proyecto Tienda de Tecnología ShenzhenStock'); set_font(r,size=15,color=(55,55,55))
for text in ['Tecnología en análisis: Next.js, React, TypeScript y Tailwind CSS', 'Fecha: 29 de septiembre de 2026']:
    p=doc.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.CENTER; r=p.add_run(text); set_font(r,size=11,color=(70,70,70))
doc.add_page_break()

heading(doc,'1. Descripción de la evidencia')
normal_p(doc,'Este documento presenta la evidencia del desarrollo frontend del proyecto Tienda de Tecnología ShenzhenStock. Se muestran la estructura de componentes, los servicios de presentación y las interfaces renderizadas en el navegador. El resultado es una tienda web responsiva enfocada en la consulta de productos y la compra por medio de WhatsApp.')
heading(doc,'2. Enlace al repositorio')
p=normal_p(doc,space_after=11); r=p.add_run('Repositorio público: '); set_font(r,bold=True); r=p.add_run('https://github.com/andressuarez102001/Tienda-de-tecnolog-a-Andres'); set_font(r,color=(0,72,160)); r.underline=True
heading(doc,'3. Tecnologías utilizadas')
t=doc.add_table(rows=1, cols=2); t.alignment=WD_TABLE_ALIGNMENT.CENTER; t.autofit=False; borders(t)
t.columns[0].width=Inches(1.55); t.columns[1].width=Inches(4.85)
for i,txt in enumerate(['Tecnología','Uso en el proyecto']):
    cell=t.rows[0].cells[i]; shade(cell,'1F4E78'); set_cell_margins(cell); cell.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
    rr=cell.paragraphs[0].add_run(txt); set_font(rr,size=10,bold=True,color=(255,255,255))
for a,b in [('Next.js 16','Framework React para las rutas, el renderizado y la estructura de la aplicación.'),('React 19','Componentes interactivos, estados del detalle de producto y formulario de acceso.'),('TypeScript','Tipado de datos y servicios para una base de código más mantenible.'),('Tailwind CSS 4','Diseño visual responsivo, tema oscuro, gradientes y componentes tipo glassmorphism.'),('WhatsApp','Canal de contacto y compra mediante enlaces wa.me generados por el frontend.')]:
    cells=t.add_row().cells
    for c,txt in zip(cells,[a,b]):
        set_cell_margins(c); c.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
        rr=c.paragraphs[0].add_run(txt); set_font(rr,size=9.5)
normal_p(doc,'La aplicación no utiliza un backend ni una base de datos: el catálogo se construye con datos locales y los servicios separan la lógica de productos, precios, autenticación simulada y enlaces de compra.',space_after=3)

doc.add_page_break()
heading(doc,'4. Fragmentos de código relevantes')
heading(doc,'4.1 Página principal y navegación por categorías',2)
figure(doc,img_home,'Figura 1. Fragmento de app/page.tsx: definición de categorías y componente Home.',6.3)
normal_p(doc,'El componente Home concentra la pantalla de inicio. La constante CATEGORIES guarda los datos de las categorías y el método map los transforma en enlaces reutilizables. Next.js Link permite navegar entre rutas internas sin recargar toda la página. Las clases de Tailwind CSS construyen el diseño oscuro y adaptativo.')
heading(doc,'4.2 Servicios del catálogo y de la presentación',2)
figure(doc,img_services,'Figura 2. Fragmento de application/store/createStoreServices.ts: composición de servicios.',6.25)
normal_p(doc,'Este archivo centraliza los servicios que consumen las páginas: catalogService consulta y crea productos; authenticationService administra el acceso simulado; priceFormatter presenta los valores en COP; y whatsappLinkBuilder genera los enlaces de compra. Esta separación evita duplicar lógica en cada componente visual.')

doc.add_page_break()
heading(doc,'4.3 Interactividad de la ficha de producto',2)
figure(doc,img_detail,'Figura 3. Fragmento de app/producto/[id]/page.tsx: estados y enlace de compra.',6.25)
normal_p(doc,'La ficha de producto es un componente cliente porque administra estados con useState. El usuario puede cambiar la imagen, el color y la cantidad. El precio se recalcula a partir de la cantidad y el botón construye un enlace de WhatsApp con el producto seleccionado, respetando el stock disponible.')
heading(doc,'5. Capturas de las interfaces renderizadas')
normal_p(doc,'Las siguientes capturas se obtuvieron al ejecutar el proyecto localmente en el navegador. Demuestran la interfaz construida a partir de los componentes descritos.')

doc.add_page_break()
heading(doc,'5.1 Página de inicio')
figure(doc,ASSETS/'inicio.png','Figura 4. Página principal con hero, beneficios y accesos a categorías.',6.35)
normal_p(doc,'La página de inicio presenta la propuesta de valor, un acceso visible al catálogo, contacto por WhatsApp y categorías de productos. El diseño conserva la identidad oscura del proyecto y distribuye el contenido para pantallas grandes y pequeñas.')

doc.add_page_break()
heading(doc,'5.2 Catálogo de productos destacados')
figure(doc,ASSETS/'productos_top.png','Figura 5. Ruta /productos-top con tarjetas de productos disponibles.',6.35)
normal_p(doc,'El catálogo organiza los productos en una cuadrícula de tarjetas. Cada tarjeta muestra imagen, categoría, disponibilidad, descripción, precio formateado en pesos colombianos y la acción de compra. La cuadrícula se ajusta mediante breakpoints de Tailwind CSS.')

doc.add_page_break()
heading(doc,'5.3 Detalle de producto')
figure(doc,ASSETS/'detalle_producto.png','Figura 6. Ruta dinámica /producto/funda-iphone-17.',6.35)
normal_p(doc,'La ruta dinámica muestra una galería, detalles del producto, selector de acabado, cantidad y precio total. La interacción combina datos del catálogo y estados de React para actualizar la experiencia antes de enviar la consulta de compra a WhatsApp.')
heading(doc,'6. Conclusión')
normal_p(doc,'El frontend implementa una experiencia de tienda tecnológica completa para navegación, exploración de categorías, consulta de productos y generación de solicitudes de compra. La arquitectura por componentes y servicios facilita mantener el código, mientras que Next.js, React, TypeScript y Tailwind CSS permiten una interfaz moderna, responsiva y coherente con el prototipo.')

# Footer page number
for sec in doc.sections:
    f=sec.footer.paragraphs[0]; f.alignment=WD_ALIGN_PARAGRAPH.CENTER
    rr=f.add_run('Evidencia 2 - Desarrollo del Frontend'); set_font(rr,size=8,color=(100,100,100))

doc.core_properties.title='Evidencia 2 Desarrollo del Frontend'
doc.core_properties.subject='Evidencia de frontend del proyecto Tienda de Tecnología ShenzhenStock'
doc.core_properties.author='Andres Suarez'
doc.save(OUTPUT)
print(OUTPUT)
