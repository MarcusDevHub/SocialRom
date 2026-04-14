
# Project Title

A brief description of what this project does and who it's for

# SocialRom

> Plataforma social de emulação retro com chat em tempo real, saves persistentes e comunidade ativa.

![SocialRom](https://img.shields.io/badge/SocialRom-Retro%20Gaming-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-gray?style=for-the-badge&logo=prisma)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-red?style=for-the-badge&logo=socket.io)

---

## 📖 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Como Logar](#-como-logar)
- [Como Jogar](#-como-jogar)
- [Roadmap](#-roadmap)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [.gitignore — O que foi ocultado e por quê](#-gitignore---o-que-foi-ocultado-e-por-quê)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 🎮 Visão Geral

**SocialRom** é uma plataforma web que permite jogar clássicos de consoles retro (SNES, GBA, NES, PS1) diretamente no navegador, com uma camada social integrada. Cada jogo tem sua própria sala de chat em tempo real, onde jogadores podem conversar enquanto jogam.

O projeto combina emulação via **EmulatorJS**, autenticação segura com **NextAuth + Prisma**, chat persistente com **Socket.IO**, e um design visual único inspirado em monitores CRT com efeitos de onda (ShapeWave Background).

---

## 🛠 Tecnologias Utilizadas

### Frontend
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Next.js** | 14 | Framework React com App Router |
| **React** | 18 | Biblioteca UI |
| **TypeScript** | 5 | Tipagem estática |
| **Tailwind CSS** | 3 | Estilização utilitária |
| **EmulatorJS** | latest | Emulação de consoles no navegador |

### Backend
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Node.js** | 18+ | Runtime do servidor |
| **Socket.IO** | 4 | Chat em tempo real e contagem de jogadores |
| **Express** | 4 | Servidor HTTP customizado |
| **Prisma** | 5 | ORM para banco de dados |
| **SQLite** | — | Banco de dados local (dev.db) |
| **bcryptjs** | 2 | Hash de senhas |

### Autenticação
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **NextAuth.js** | 4 | Autenticação com credentials |
| **@auth/prisma-adapter** | latest | Persistência de sessão no Prisma |

---

## ✨ Funcionalidades

### Emulação
- 🎮 Suporte a **SNES, GBA, NES e PS1** (via .chd)
- 🖥️ Efeito **CRT shader** (EasyMode) por padrão
- 📱 **Virtual gamepad** automático em dispositivos móveis
- ⌨️ Mapeamento de teclas do teclado para cada console
- 💾 **Save States** (Shift+F1 para salvar, F1 para carregar)

### Social
- 💬 **Chat em tempo real** por sala de jogo (Socket.IO)
- 📜 **Histórico de chat persistente** por 6 horas (TTL automático)
- 👥 Contagem de jogadores online em cada sala
- 🔐 Autenticação segura com usuário e senha

### UI/UX
- 🌊 **ShapeWave Background** — efeito Canvas animado em todas as páginas
- 📺 Estética **CRT** com scanlines, vignette e curvatura de tela
- 🌐 **i18n** — suporte a Português (PT) e Inglês (EN)
- 🔍 **Filtros e pesquisa** — buscar por nome, filtrar por sistema, gênero e ordenar
- 📱 Design responsivo (mobile-first)

---

## 🏗 Arquitetura do Projeto
```
SocialRom/
├─ src/
│ └── app/ # Next.js App Router
│ │   ├── api/ # API Routes
│ │      ├── auth/[...nextauth]/route.ts # Autenticação
│ │      ├── chat/route.ts # Chat persistente
│ │   ├── auth/
│ │       ├── signin/page.tsx # Página de login
│ │       └── signup/page.tsx # Página de cadastro
│ │       ├── game/[id]/page.tsx # Página do jogo
│ │       └── page.tsx # Home / Catálogo
├─└── components/ # Componentes React reutilizáveis
│ │     ├── auth-header.tsx
│ │     ├── emulatorPlayer.tsx # Wrapper do EmulatorJS
│ │     ├── game-filters.tsx # Filtros e pesquisa
│ │     ├── game-room-client.tsx # Cliente da sala de jogo
│ │     ├── shape-wave-background.tsx
├─└── hooks/ # Custom React Hooks
│ │     ├── use-game-filters.ts
│ │     ├── use-room-socket.ts # Conexão Socket.IO
│ │     ├── use-games-room-counts.ts
├─└── lib/ # Utilitários e configurações
│ │     ├── auth.ts # Config NextAuth
│ │     ├── games.ts # Dados dos jogos
│ │     ├── prisma.ts # Instância Prisma
├─└── prisma/
│       └── schema.prisma # Schema do banco de dados
├── types/
│   └── next-auth.d.ts # Extensão de tipos NextAuth
├── .env # Variáveis de ambiente (IGNORADO NO GIT)
├── .env.local # Variáveis locais (IGNORADO NO GIT)
├── .gitignore # Regras de exclusão do Git
├── dev.db # Banco SQLite (IGNORADO NO GIT)
├── next.config.ts # Configuração Next.js
├── package.json # Dependências do projeto
├──server.js # Servidor Socket.IO standalone
└── public/
    └── roms/ # ROMs dos jogos (IGNORADO NO GIT)
    └── thumbs/ # Thumbnails das capas (IGNORADO NO GIT)
    └── fonts/
```
---
## 🚀 Instalação e Configuração

### Pré-requisitos
- **Node.js** 18 ou superior
- **npm** ou **yarn**

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/socialrom.git
   cd socialrom
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="sua-chave-secreta-aqui"
   NEXTAUTH_URL="http://localhost:3000"
   ```

   > **Gerar NEXTAUTH_SECRET:**
   > ```bash
   > openssl rand -base64 32
   > ```

4. **Configure o banco de dados:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Inicie o servidor de desenvolvimento:**
   ```bash
   # Terminal 1 - Servidor Socket.IO
   node server.js

   # Terminal 2 - Next.js
   npm run dev
   ```

6. **Acesse:**
   Abra `http://localhost:3000` no navegador.

---

## 🔐 Como Logar

### Criar uma conta (Signup)
1. Acesse `/auth/signup`
2. Preencha:
   - **Username** — seu nome de usuário (único)
   - **Email** — seu email (opcional)
   - **Senha** — mínima de 6 caracteres
3. Clique em **Criar Conta**

### Fazer login (Signin)
1. Acesse `/auth/signin`
2. Preencha:
   - **Email** — o email cadastrado
   - **Senha** — sua senha
3. Clique em **Entrar**

> **Nota:** A autenticação usa **credentials** com hash bcrypt. As senhas nunca são armazenadas em texto puro.

---

## 📋 Roadmap

### ✅ Concluído
- [x] Emulador PS1 com arquivos .chd
- [x] Emulador SNES, GBA, NES
- [x] Efeito CRT shader (EasyMode)
- [x] Background ShapeWave animado
- [x] Autenticação (Signin/Signup) com NextAuth + Prisma
- [x] Chat em tempo real com Socket.IO
- [x] Histórico de chat persistente (TTL 6h)
- [x] Filtros e pesquisa (nome, sistema, gênero, ordenação)
- [x] i18n (PT/EN)
- [x] Instruções de save por plataforma
- [x] Design responsivo

### 🔄 Em Desenvolvimento
- [ ] Expandir i18n para cobrir toda a UI
- [ ] Melhorias nos backgrounds de auth

### ❌ Removido
- [ ] Emulador PSP (removido por problemas de performance)

---


---

## 🔒 .gitignore — O que foi ocultado e por quê

O arquivo `.gitignore` exclui os seguintes arquivos e pastas do versionamento:

| Arquivo/Pasta | Por que foi ocultado |
|---------------|---------------------|
| **`.env` / `.env.local`** | Contém **segredos sensíveis**: `NEXTAUTH_SECRET`, `DATABASE_URL`. Expor essas chaves comprometeria a segurança da autenticação e do banco de dados. |
| **`dev.db`** | Banco de dados SQLite local. Contém **dados reais de usuários** (emails, hashes de senha, sessões, mensagens de chat). Não deve ser versionado para evitar vazamento de dados. |
| **`public/roms/`** | ROMs de jogos são **arquivos protegidos por direitos autorais**. Distribuir ROMs via Git violaria leis de propriedade intelectual. Cada desenvolvedor deve obter suas próprias ROMs legalmente. |
| **`node_modules/`** | Pasta padrão do npm — contém milhares de arquivos de dependências. É regenerada automaticamente com `npm install`. |
| **`.next/`** | Build output do Next.js — é regenerado a cada build. |
| **`*.log`** | Logs de depuração — podem conter informações sensíveis e ocupam espaço desnecessário. |
| **`prisma/*.db`** | Qualquer arquivo de banco SQLite — mesmo motivo do `dev.db`. |

---

## 🤝 Contribuição

1. Faça um **fork** do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

> **Aviso legal:** Este projeto é destinado apenas para fins educacionais e de preservação. Os usuários são responsáveis por obter legalmente as ROMs dos jogos que possuem.

---