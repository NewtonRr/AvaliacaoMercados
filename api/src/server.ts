import App from './app.ts';

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await App.init();
    
    App.getServer().listen(PORT, () => {
      console.log(`Servidor está rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Um erro ocorreu:', error);
    process.exit(1);
  }
}

start();