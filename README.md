<div align="center">

# 💈 BarberGo

### O barbeiro vai até você: agendamento de corte em domicílio, com React Native e Expo

[![React Native](https://img.shields.io/badge/React_Native-0.83-61DAFB?style=flat-square&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-55.0-000020?style=flat-square&logo=expo)](https://expo.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel)](https://barber-go-sigma.vercel.app/)

**[🚀 Ver Demo ao Vivo](https://barber-go-sigma.vercel.app/)**

</div>

---

## 📋 Sobre o Projeto

O **BarberGo** é um app que conecta clientes a barbeiros que atendem **em domicílio**. O cliente escolhe o profissional, o serviço, o dia e o horário, e acompanha o barbeiro desde a confirmação até a chegada na porta de casa.

O projeto foi construído com React Native e Expo, roda em Android, iOS e no navegador. Os barbeiros, avaliações e agendamentos são **dados simulados** (`src/data/mockData.js`); ainda não há back-end.

No computador, a versão web mostra o app dentro de um mockup de celular, em um layout de tela dividida.

---

## ✨ Funcionalidades

- 👋 **Boas-vindas:** splash animada, onboarding, login e cadastro
- 💈 **Barbeiros:** lista com busca, filtros, nota, distância, especialidades e favoritos
- 👤 **Perfil do barbeiro:** biografia, portfólio de cortes, avaliações e serviços com preço
- 📅 **Agendamento em 3 passos:** serviço, depois data e horário, depois confirmação com o endereço do cliente
- 🛵 **Acompanhamento do atendimento:** Confirmado → A caminho → Chegou → Em atendimento → Concluído
- 🗂️ **Meus agendamentos:** histórico, detalhes em modal e cancelamento
- 🙍 **Perfil do cliente:** dados pessoais, endereço e total de cortes

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|---|---|---|
| React Native | 0.83 | Framework principal |
| Expo | ~55.0 | Toolchain, build e versão web |
| React Navigation | ^7.x | Navegação em pilha e abas inferiores |
| Context API + `useReducer` | React 19 | Estado global: usuário, agendamentos e favoritos |
| API `Animated` | React Native | Animações de entrada, cartões e rastreio de status |
| Expo Linear Gradient | ^55.0 | Gradientes da interface |
| Expo Blur | ^55.0 | Desfoque nas telas de login e cadastro |
| Expo Vector Icons | ^15.1 | Ícones (Ionicons) |
| React Native Web | ^0.21 | Versão para navegador publicada na Vercel |

---

## 🏗️ Estrutura do Projeto

```text
BarberGo/
├── App.js              # Entrada da aplicação e layout desktop com mockup
├── index.js            # Registro do app
├── app.json            # Configurações do Expo
├── vercel.json         # Configurações de deploy web
├── assets/             # Ícones, splash e selos
└── src/
    ├── screens/        # 10 telas: Splash, Onboarding, Login, Home, Agendamento...
    ├── components/     # BarberCard, ServiceCard, StarRating, StatusTracker...
    ├── context/        # AppContext: estado global com useReducer
    ├── navigation/     # Rotas em pilha e abas
    ├── data/           # Dados simulados de barbeiros e agendamentos
    └── theme/          # Cores, espaçamentos e tipografia
```

---

## ⚙️ Como Rodar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Aplicativo **Expo Go** no celular (opcional, para testar no dispositivo)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/gabrielnovaesdev/BarberGo.git

# Acesse a pasta do projeto
cd BarberGo

# Instale as dependências
npm install

# Inicie o projeto
npm start
```

### Executando nas plataformas

```bash
npm run android   # Emulador Android
npm run ios       # Simulador iOS (requer macOS)
npm run web       # Navegador web
```

Ou escaneie o QR code gerado com o app **Expo Go** para testar no seu dispositivo físico.

---

## 🌐 Deploy

A versão web está disponível em: **[barber-go-sigma.vercel.app](https://barber-go-sigma.vercel.app/)**

O deploy é feito via [Vercel](https://vercel.com/) usando o comando:

```bash
npm run build   # Gera o build web via expo export
```

---

## 🎯 Objetivos de Aprendizado

Este projeto foi desenvolvido para aprofundar conhecimentos em:

- Desenvolvimento de aplicações mobile com **React Native** e **Expo**
- Navegação entre telas com **React Navigation** (Stack e Bottom Tabs)
- Gerenciamento de estado global com **Context API** e `useReducer`
- Criação de **UIs complexas** com a API `Animated`, gradientes e desfoque
- Boas práticas de **organização de código** e estrutura de projetos

---

## 🧭 Próximos Passos

- Mapa com as barbearias e localização do cliente (as bibliotecas `react-native-maps` e `expo-location` já estão instaladas)
- Back-end com autenticação e agendamentos reais
- Notificações push para o status do atendimento

---

## 👨‍💻 Desenvolvedor

<div align="center">

**Gabriel Novaes**

Estudante de Análise e Desenvolvimento de Sistemas (ADS) na UniCarioca.
Apaixonado por desenvolvimento mobile, web e inteligência artificial.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-gabrielnovaesdev-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/gabrielnovaesdev/)
[![GitHub](https://img.shields.io/badge/GitHub-gabrielnovaesdev-181717?style=flat-square&logo=github)](https://github.com/gabrielnovaesdev)

</div>

---

<div align="center">
  Feito com dedicação por <a href="https://github.com/gabrielnovaesdev">Gabriel Novaes</a>
</div>
