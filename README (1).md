# Projeto Arracoador CSC

🚀 Aplicativo de monitoramento de qualidade da água com integração Arduino + Backend Django + Frontend React Native.

## 📂 Estrutura do Projeto

```
ARRACODADOR_CSC/
│
├── backend/        → Backend em Django (API, Banco de Dados, Lógica)
│├── arracoador_csc/
│├── backend_arracoador/
│├── manage.py
│├── db.sqlite3
│└── .env
│
├── frontend/       → Aplicativo mobile em React Native
│└── react_native_app/
│
├── arduino/        → Código para microcontrolador Arduino
│└── sensor_monitor.ino
│
├── .expo/          → Arquivos do Expo
├── .venv/          → Ambiente virtual Python
├── README.md       → Documentação
└── .gitignore      → Arquivos ignorados pelo Git
```

## 🖥️ Tecnologias

- 🔌 **Backend:** Django, Django Rest Framework, InfluxDB (se aplicável)
- 📱 **Frontend:** React Native, Expo
- 🤖 **IoT:** Arduino + sensores

## 🔧 Como rodar o projeto

### 🐍 Backend (Django)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # ou .venv\Scripts\activate no Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 📱 Frontend (React Native)

```bash
cd frontend/react_native_app
npm install
npx expo start
```

### ⚙️ Arduino

- Abra o código em `/arduino/` no Arduino IDE.
- Compile e envie para o microcontrolador.

## 🚀 Funcionalidades

- Monitoramento de sensores (temperatura, pH, etc.).
- Envio de dados do Arduino para o Backend.
- Dashboard no app mobile para visualização dos dados em tempo real.

## 🗺️ Contribuição

1. Fork este repositório.
2. Crie uma branch (`git checkout -b feature/sua-feature`).
3. Commit suas alterações (`git commit -m 'feat: adiciona nova feature'`).
4. Push para sua branch (`git push origin feature/sua-feature`).
5. Abra um Pull Request.

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo LICENSE para detalhes.
