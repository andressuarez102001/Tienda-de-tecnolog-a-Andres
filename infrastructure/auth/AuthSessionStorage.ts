/**
 * Responsabilidad única: persistencia de la sesión en localStorage.
 * Separado de BrowserAuthSession para que el cambio de mecanismo de
 * almacenamiento (cookie, in-memory, etc.) no toque la lógica de sesión.
 */
export class AuthSessionStorage {
  isAuthenticatedAdmin(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true' && localStorage.getItem('userRole') === 'admin';
  }

  save(role: 'admin' | 'cliente'): void {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);
  }

  clear(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
  }
}