# Projeto Arrecodador CSC

🚀 Aplicativo de monitoramento da qualidade da água com integração **Arduino + Backend Django + Frontend React Native**.

## 📂 Estrutura do Projeto

```
ARRECODADOR_CSC/
│
├── backend/        → Backend em Django (API, Banco de Dados, Lógica)
│   ├── arracoador_csc/
│   ├── backend_arracoador/
│   ├── manage.py
│   ├── db.sqlite3
│   ├── requirements.txt  ← Arquivo com as dependências Python
│   └── .env              ← Variáveis de ambiente
│
├── frontend/       → Aplicativo mobile em React Native
│   └── react_native_app/
│
├── arduino/        → Código para microcontrolador Arduino
│   └── sensor_monitor.ino
│
├── .expo/          → Arquivos do Expo
├── .venv/          → Ambiente virtual Python
├── README.md       → Documentação
└── .gitignore      → Arquivos ignorados pelo Git
```

## 🖥️ Tecnologias Utilizadas

- 🔌 **Backend:** Django, Django REST Framework, python-dotenv, corsheaders, InfluxDB (se aplicável)
- 📱 **Frontend:** React Native, Expo
- 🤖 **IoT:** Arduino + sensores

## 🔧 Como rodar o projeto

### 🐍 Backend (Django)

1. Acesse a pasta do backend:

```bash
cd backend
```

2. Crie e ative um ambiente virtual:

- **Windows (PowerShell):**

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

- **Windows (CMD):**

```cmd
python -m venv .venv
.venv\Scripts\activate.bat
```

- **Linux/Mac:**

```bash
python -m venv .venv
source .venv/bin/activate
```

3. Instale as dependências:

```bash
pip install -r requirements.txt
```

4. Configure as variáveis de ambiente no arquivo `.env` (Exemplo):

```
DEBUG=True
SECRET_KEY=sua_secret_key
ALLOWED_HOSTS=127.0.0.1,localhost
```

5. Rode as migrações e inicie o servidor:

```bash
python manage.py migrate
python manage.py runserver
```

### 📱 Frontend (React Native + Expo)

1. Acesse a pasta do app React Native:

```bash
cd frontend/react_native_app
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o projeto:

```bash
npx expo start
```

4. Escaneie o QR Code no seu celular (via aplicativo Expo Go) ou rode no emulador.

### ⚙️ Arduino

1. Abra o código localizado em `/arduino/` na IDE do Arduino.
2. Compile e envie para o microcontrolador conectado.

## 🚀 Funcionalidades

- 🔍 Monitoramento de sensores (temperatura, pH, etc.).
- 🔗 Envio de dados do Arduino para o backend Django.
- 📊 Visualização dos dados em tempo real no app mobile.
- ⚠️ Alertas e acompanhamento da qualidade da água.
- 🔒 Armazenamento seguro dos dados via backend.

## 🤝 Como contribuir

1. Faça um fork deste repositório.
2. Crie uma nova branch para sua feature:

```bash
git checkout -b feature/sua-feature
```

3. Faça commit das suas alterações:

```bash
git commit -m 'feat: descrição da sua feature'
```

4. Envie para seu fork:

```bash
git push origin feature/sua-feature
```

5. Abra um Pull Request.

## 📄 Licença

Este projeto está sob a licença **MIT** — veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📫 Contato

Dúvidas, sugestões ou parcerias? Entre em contato:

- ✉️ carlos_marques@ufms.br
- 🚀 Desenvolvido por Cadu😗😋
