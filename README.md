# SocialRom

> Plataforma social de emulação retro com chat em tempo real, saves persistentes e comunidade ativa.

![SocialRom](https://img.shields.io/badge/SocialRom-Retro%20Gaming-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-gray?style=for-the-badge&logo=prisma)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-red?style=for-the-badge&logo=socket.io)
![Backblaze B2](https://img.shields.io/badge/Backblaze_B2-ROM%20Storage-red?style=for-the-badge)

---

## 📖 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Hospedagem de ROMs](#-hospedagem-de-roms)
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

As ROMs são servidas via **Backblaze B2** com CORS configurado, garantindo compatibilidade total com o EmulatorJS sem depender de proxies intermediários.

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

### Infraestrutura
| Tecnologia | Uso |
|------------|-----|
| **Backblaze B2** | Armazenamento e entrega das ROMs via CDN com CORS aberto |

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
├── src/
│   └── app/                        # Next.js App Router
│       ├── api/                    # API Routes
│       │   ├── auth/[...nextauth]/ # Autenticação NextAuth
│       │   └── chat/               # Chat persistente
│       ├── auth/
│       │   ├── signin/page.tsx     # Página de login
│       │   └── signup/page.tsx     # Página de cadastro
│       ├── game/[id]/page.tsx      # Página do jogo
│       └── page.tsx                # Home / Catálogo
├── components/                     # Componentes React reutilizáveis
│   ├── auth-header.tsx
│   ├── emulatorPlayer.tsx          # Wrapper do EmulatorJS
│   ├── game-filters.tsx            # Filtros e pesquisa
│   ├── game-room-client.tsx        # Cliente da sala de jogo
│   └── shape-wave-background.tsx
├── hooks/                          # Custom React Hooks
│   ├── use-game-filters.ts
│   ├── use-room-socket.ts          # Conexão Socket.IO
│   └── use-games-room-counts.ts
├── lib/                            # Utilitários e configurações
│   ├── auth.ts                     # Config NextAuth
│   ├── games.ts                    # Dados dos jogos (URLs Backblaze B2)
│   └── prisma.ts                   # Instância Prisma
├── prisma/
│   └── schema.prisma               # Schema do banco de dados
├── types/
│   └── next-auth.d.ts              # Extensão de tipos NextAuth
├── .env                            # Variáveis de ambiente (IGNORADO NO GIT)
├── next.config.ts                  # Configuração Next.js
├── package.json
├── server.js                       # Servidor Socket.IO standalone
└── public/
    └── thumbs/                     # Thumbnails das capas
    └── fonts/
```

---

## 🗄 Hospedagem de ROMs

As ROMs **não são armazenadas no repositório** nem servidas pelo servidor Next.js. Elas são hospedadas no **Backblaze B2**, um serviço de object storage com 10GB de free tier e CDN com suporte correto a CORS e Range Requests.

### Por que Backblaze B2?

Durante o desenvolvimento, várias abordagens foram testadas e descartadas:

| Abordagem | Problema |
|-----------|----------|
| **Archive.org (URL direta)** | Não serve `Access-Control-Allow-Origin` — bloqueado por CORS no navegador |
| **Proxy Next.js (`/api/rom/`)** | Funciona em dev, mas gera `ConnectTimeoutError` no Railway (rede do servidor não alcança archive.org) |
| **`EJS_threads: false`** | Não resolve o CORS do archive.org — emulador ainda faz Range Requests bloqueadas |
| **GitHub Releases (público)** | Risco de DMCA — ROMs são protegidas por direitos autorais |
| **GitHub Releases (privado)** | EmulatorJS não consegue acessar assets privados sem autenticação |
| **Cloudflare R2 + Worker** | Solução válida, mas upload de arquivos >300MB exige CLI (rclone/wrangler) |
| **Backblaze B2** ✅ | Upload pelo painel web sem limite, CORS configurável, Range Requests suportadas |

### Configuração do Bucket B2

1. Crie um bucket com visibilidade **Public** em [backblaze.com](https://backblaze.com)
2. Faça upload das ROMs pelo painel web
3. Em **Bucket Settings → CORS Rules**, aplique:

```json
[{
  "corsRuleName": "emulatorjs",
  "allowedOrigins": ["*"],
  "allowedOperations": ["b2_download_file_by_name"],
  "allowedHeaders": ["*"],
  "exposeHeaders": ["Content-Length", "Content-Range", "Accept-Ranges"],
  "maxAgeSeconds": 3600
}]
```

### Estrutura das URLs no `games.ts`

```ts
const ROM_BASE = \'https://f005.backblazeb2.com/file/socialrom-roms\'

export const mockGames = [
  {
    id: \'pokemon-emerald\',
    title: \'Pokémon Emerald\',
    system: \'GBA\',
    romUrl: `${ROM_BASE}/PokemonEmerald.gba`,
  },
]
```

### Configuração do EmulatorJS

O `emulatorPlayer.tsx` usa `EJS_threads: false` para desabilitar SharedArrayBuffer, eliminando a necessidade de headers COEP/CORP no servidor Next.js:

```ts
(window as any).EJS_threads = false;
```

---

## 🚀 Instalação e Configuração

### Pré-requisitos
- **Node.js** 18 ou superior
- **npm** ou **yarn**
- Bucket **Backblaze B2** configurado com as ROMs

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

5. **Configure as URLs das ROMs:**
   Em `src/lib/games.ts`, atualize `ROM_BASE` com a URL do seu bucket Backblaze B2.

6. **Inicie o servidor de desenvolvimento:**
   ```bash
   # Terminal 1 - Servidor Socket.IO
   node server.js

   # Terminal 2 - Next.js
   npm run dev
   ```

7. **Acesse:**
   Abra `http://localhost:3000` no navegador.

---

## 🔐 Como Logar

### Criar uma conta (Signup)
1. Acesse `/auth/signup`
2. Preencha:
   - **Username** — seu nome de usuário (único)
   - **Email** — seu email
   - **Senha** — mínima de 6 caracteres
3. Clique em **Criar Conta**

### Fazer login (Signin)
1. Acesse `/auth/signin`
2. Preencha seu **Email** e **Senha**
3. Clique em **Entrar**

> **Nota:** A autenticação usa **credentials** com hash bcrypt. As senhas nunca são armazenadas em texto puro.

---

## 🎮 Como Jogar

1. Faça login na plataforma
2. Na home, escolha um jogo pelo catálogo
3. Use os filtros para encontrar por sistema, gênero ou nome
4. Clique em **Jogar** para entrar na sala
5. O emulador carrega automaticamente via Backblaze B2
6. Use o chat lateral para conversar com outros jogadores

### Controles de Save State
| Ação | Tecla |
|------|-------|
| Salvar estado | `Shift + F1` |
| Carregar estado | `F1` |

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
- [x] Hospedagem de ROMs via Backblaze B2 com CORS configurado
- [x] Compatibilidade total do EmulatorJS com Range Requests externas

### 🔄 Em Desenvolvimento
- [ ] Expandir i18n para cobrir toda a UI
- [ ] Melhorias nos backgrounds de auth

### ❌ Removido
- [ ] Emulador PSP (removido por problemas de performance)

---

## 🔒 .gitignore — O que foi ocultado e por quê

| Arquivo/Pasta | Por que foi ocultado |
|---------------|---------------------|
| **`.env` / `.env.local`** | Contém segredos sensíveis: `NEXTAUTH_SECRET`, `DATABASE_URL`. Expor essas chaves comprometeria a segurança da autenticação e do banco de dados. |
| **`dev.db`** | Banco de dados SQLite local. Contém dados reais de usuários (emails, hashes de senha, sessões, mensagens de chat). |
| **`public/roms/`** | ROMs são arquivos protegidos por direitos autorais. As ROMs de produção são servidas via Backblaze B2, não pelo repositório. |
| **`node_modules/`** | Dependências npm — regeneradas automaticamente com `npm install`. |
| **`.next/`** | Build output do Next.js — regenerado a cada build. |
| **`*.log`** | Logs de depuração — podem conter informações sensíveis. |
| **`prisma/*.db`** | Qualquer arquivo de banco SQLite. |

---

## 🤝 Contribuição

1. Faça um **fork** do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m \'Add some AmazingFeature\'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

> **Aviso legal:** Este projeto é destinado apenas para fins educacionais e de preservação. Os usuários são responsáveis por obter legalmente as ROMs dos jogos que possuem.