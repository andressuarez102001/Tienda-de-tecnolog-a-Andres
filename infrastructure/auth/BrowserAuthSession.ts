export class BrowserAuthSession {
  private static readonly changeEvent = 'auth-session-change';

  isAdmin(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true' && localStorage.getItem('userRole') === 'admin';
  }

  subscribe(listener: () => void): () => void {
    window.addEventListener('storage', listener);
    window.addEventListener(BrowserAuthSession.changeEvent, listener);
    return () => {
      window.removeEventListener('storage', listener);
      window.removeEventListener(BrowserAuthSession.changeEvent, listener);
    };
  }

  notifyChange(): void {
    window.dispatchEvent(new Event(BrowserAuthSession.changeEvent));
  }

  logout(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    this.notifyChange();
  }
}

export const browserAuthSession = new BrowserAuthSession();
