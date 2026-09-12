import type { StorefrontProduct, StoreUser } from './entities';

/** Puertos pequeños para que los casos de uso no dependan del navegador ni de una API concreta. */
export interface ProductRepository {
  findById(id: string): StorefrontProduct | undefined;
}

export interface AuthenticationGateway {
  authenticate(email: string, password: string): StoreUser | undefined;
}

export interface AuthSession {
  start(user: StoreUser): void;
  end(): void;
  currentUser(): StoreUser | undefined;
}
