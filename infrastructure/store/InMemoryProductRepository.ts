import type { ProductRepository } from '@/domain/store/contracts';
import { StorefrontProduct, type StorefrontProductData } from '@/domain/store/entities';

const DETAIL_PRODUCTS: ReadonlyArray<StorefrontProductData> = [
  { id: 'funda-iphone-17', name: 'Funda iPhone 17 Pro Max con MagSafe', category: 'Fundas & Protección', price: 25000, stock: 10, imageSrc: '/FUNDA-IPHONE-17.jpg', description: 'Diseñada para complementar tu dispositivo. Su acabado exterior de silicona resulta muy agradable al tacto y el interior está forrado de suave microfibra para proteger tu iPhone.' },
  { id: 'funda-iphone-14-roja', name: 'Funda iPhone 14 Roja MagSafe', category: 'Fundas & Protección', price: 20000, stock: 30, imageSrc: '/FUNDA-IPHONE-14-ROJA.jpg', description: 'Silicona líquida de primera calidad con tecnología de absorción de impactos y alineación magnética perfecta.' },
  { id: 'cargador-iphone', name: 'Adaptador de Corriente USB-C de 20W', category: 'Cargadores & Energía', price: 45000, stock: 120, imageSrc: '/CARGADOR-IPHONE.jpg', description: 'Carga ultrarrápida e inteligente diseñada para cargar tu iPhone de 0 a 50% en solo 30 minutos.' },
];

export class InMemoryProductRepository implements ProductRepository {
  private readonly products = new Map(DETAIL_PRODUCTS.map((data) => [data.id, new StorefrontProduct(data)]));
  findById(id: string): StorefrontProduct | undefined { return this.products.get(id); }
}
