import type { AuthSession } from '@/domain/store/contracts';
import { StoreUser } from '@/domain/store/entities';

export class BrowserAuthSession implements AuthSession {
  private static readonly changeEvent = 'auth-session-change';
  private adminSnapshot = false;

  /** Referencias estables para useSyncExternalStore; evita resuscripciones por render. */
  readonly subscribeToChanges = (listener: () => void): (() => void) => this.subscribe(listener);
  readonly getAdminSnapshot = (): boolean => this.adminSnapshot;

  private refreshSnapshot(): void {
    this.adminSnapshot = localStorage.getItem('isAuthenticated') === 'true' && localStorage.getItem('userRole') === 'admin';
  }

  currentUser(): StoreUser | undefined {
    this.refreshSnapshot();
    return this.adminSnapshot ? new StoreUser('admin@tecnostore.com', 'admin') : undefined;
  }

  isAdmin(): boolean {
    this.refreshSnapshot();
    return this.adminSnapshot;
  }

  subscribe(listener: () => void): () => void {
    const notifySubscriber = (): void => {
      this.refreshSnapshot();
      // React compara el booleano primitivo; notificar no puede crear un ciclo.
      listener();
    };
    this.refreshSnapshot();
    window.addEventListener('storage', notifySubscriber);
    window.addEventListener(BrowserAuthSession.changeEvent, notifySubscriber);
    return () => {
      window.removeEventListener('storage', notifySubscriber);
      window.removeEventListener(BrowserAuthSession.changeEvent, notifySubscriber);
    };
  }

  notifyChange(): void {
    window.dispatchEvent(new Event(BrowserAuthSession.changeEvent));
  }

  start(user: StoreUser): void {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', user.isAdministrator() ? 'admin' : 'cliente');
    this.notifyChange();
  }

  end(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    this.notifyChange();
  }

  logout(): void { this.end(); }
}

export const browserAuthSession = new BrowserAuthSession();
