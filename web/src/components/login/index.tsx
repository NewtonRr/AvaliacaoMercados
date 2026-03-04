import { useState } from 'react';


export const LoginComponent = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="login-wrapper">
      <h1>Área do gerente</h1>
      <p>Digite o PIN para acessar as configurações.</p>
      <form className="login-form">
        <label className="login-label">
          PIN:
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="login-input"
          />
        </label>
        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>
      {error && <p className="login-error">{error}</p>}
    </div>
  );
};