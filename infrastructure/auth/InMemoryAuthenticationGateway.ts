import type { AuthenticationGateway } from '@/domain/store/contracts';
import { StoreUser } from '@/domain/store/entities';

export class InMemoryAuthenticationGateway implements AuthenticationGateway {
  authenticate(email: string, password: string): StoreUser | undefined {
    return email === 'admin@tecnostore.com' && password === 'admin123' ? new StoreUser(email, 'admin') : undefined;
  }
}
