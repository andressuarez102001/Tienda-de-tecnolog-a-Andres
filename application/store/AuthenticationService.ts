import type { AuthenticationGateway, AuthSession } from '@/domain/store/contracts';

export class AuthenticationService {
  constructor(private readonly gateway: AuthenticationGateway, private readonly session: AuthSession) {}

  signIn(email: string, password: string): boolean {
    const user = this.gateway.authenticate(email, password);
    if (!user || !user.isAdministrator()) return false;
    this.session.start(user);
    return true;
  }

  signOut(): void { this.session.end(); }
  isAdministrator(): boolean { return this.session.currentUser()?.isAdministrator() ?? false; }
}
