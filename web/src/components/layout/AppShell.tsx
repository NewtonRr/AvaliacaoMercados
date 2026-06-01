import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

type AppShellVariant = 'kiosk' | 'manager';

interface AppShellProps {
  variant?: AppShellVariant;
  title?: string;
  children: ReactNode;
}

export function AppShell({ variant = 'kiosk', title, children }: AppShellProps) {
  const isManager = variant === 'manager';

  return (
    <div className={`app-shell app-shell--${variant}`}>
      <header className="app-shell__header">
        {title && <h1 className="app-shell__title">{title}</h1>}
      </header>
      <div className="app-shell__body">
        {isManager && (
          <nav className="app-shell__nav">
            <h2 className="app-shell__nav-title">Menu</h2>
            <ul className="app-shell__nav-list">
              <li>
                <NavLink
                  to="/manager"
                  className={({ isActive }) =>
                    `app-shell__nav-link${isActive ? ' app-shell__nav-link--active' : ''}`
                  }
                  end
                >
                  Abas de avaliação
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/manager/dashboard"
                  className={({ isActive }) =>
                    `app-shell__nav-link${isActive ? ' app-shell__nav-link--active' : ''}`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/kiosk"
                  className="app-shell__nav-link"
                >
                  Visualizar totem
                </NavLink>
              </li>
            </ul>
          </nav>
        )}
        <main className="app-shell__content">{children}</main>
      </div>
    </div>
  );
}

