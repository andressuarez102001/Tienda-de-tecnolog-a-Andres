import { AuthenticationService } from '@/application/store/AuthenticationService';
import { CatalogService } from '@/application/store/CatalogService';
import { browserAuthSession } from '@/infrastructure/auth/BrowserAuthSession';
import { InMemoryAuthenticationGateway } from '@/infrastructure/auth/InMemoryAuthenticationGateway';
import { InMemoryProductRepository } from '@/infrastructure/store/InMemoryProductRepository';

/**
 * Raíz de composición. Son singletons de módulo: nunca se crean desde un
 * render, efecto o callback de React.
 */
const productRepository = new InMemoryProductRepository();
const authenticationGateway = new InMemoryAuthenticationGateway();

export const catalogService = new CatalogService(productRepository);
export const authenticationService = new AuthenticationService(authenticationGateway, browserAuthSession);
