import { AuthenticationService } from '@/application/store/AuthenticationService';
import { CatalogService } from '@/application/store/CatalogService';
import { PriceFormatter } from '@/presentation/store/PriceFormatter';
import { WhatsAppLinkBuilder } from '@/presentation/store/WhatsAppLinkBuilder';
import { browserAuthSession } from '@/infrastructure/auth/BrowserAuthSession';
import { InMemoryAuthenticationGateway } from '@/infrastructure/auth/InMemoryAuthenticationGateway';
import { InMemoryProductRepository } from '@/infrastructure/store/InMemoryProductRepository';


const productRepository = new InMemoryProductRepository();
const authenticationGateway = new InMemoryAuthenticationGateway();

export const catalogService = new CatalogService(productRepository);
export const authenticationService = new AuthenticationService(authenticationGateway, browserAuthSession);
export const priceFormatter = new PriceFormatter();
export const whatsappLinkBuilder = new WhatsAppLinkBuilder(priceFormatter);