import type { ReactNode } from 'react';
import { NavLink, useParams } from 'react-router-dom';


type AppShellVariant = 'kiosk' | 'manager';

interface AppShellProps {
  variant?: AppShellVariant;
  children: ReactNode;
}

export function AppShell({ variant = 'kiosk', children }: AppShellProps) {
  const isManager = variant === 'manager';
  const { idLoja } = useParams<{ idLoja: string }>();
  return (
    <div className={`app-shell app-shell--${variant}`}>
      <div className="app-shell__body">
        {isManager && (
          <nav className="app-shell__nav">
            <h2 className="app-shell__nav-title">Menu</h2>
            <ul className="app-shell__nav-list">
              <li>
                <NavLink
                  to={`/${idLoja}/manager`}
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
                  to={`/${idLoja}/manager/dashboard`}
                  className={({ isActive }) =>
                    `app-shell__nav-link${isActive ? ' app-shell__nav-link--active' : ''}`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/${idLoja}/kiosk`}
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

