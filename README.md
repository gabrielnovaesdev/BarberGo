<div align="center">

# 💈 BarberGo

### Plataforma de agendamento para barbearias — mobile-first com React Native & Expo

[![React Native](https://img.shields.io/badge/React_Native-0.83-61DAFB?style=flat-square&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-55.0-000020?style=flat-square&logo=expo)](https://expo.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel)](https://barber-go-sigma.vercel.app/)
[![License](https://img.shields.io/badge/Licença-MIT-green?style=flat-square)](LICENSE)

**[🚀 Ver Demo ao Vivo](https://barber-go-sigma.vercel.app/)**

</div>

---

## 📋 Sobre o Projeto

O **BarberGo** é uma aplicação mobile desenvolvida com React Native e Expo que simula uma plataforma completa de agendamento para barbearias. O projeto foi criado com foco em boas práticas de desenvolvimento, experiência do usuário e uso estratégico de IA generativa como ferramenta de apoio na construção de software.

A aplicação permite que usuários encontrem barbearias próximas, visualizem serviços disponíveis e realizem agendamentos de forma rápida e intuitiva — tudo dentro de uma interface moderna e responsiva.

---

## ✨ Funcionalidades

- 📍 **Localização de barbearias** — integração com mapas para encontrar estabelecimentos próximos
- 📅 **Agendamento de horários** — calendário interativo para escolha de data e hora
- 🗺️ **Mapa interativo** — visualização das barbearias em mapa com marcadores
- 🔔 **Modais e notificações** — feedback visual em tempo real para o usuário
- 🎨 **Design moderno** — gradientes, ícones vetoriais e animações fluidas com Reanimated
- 📱 **Multi-plataforma** — compatível com Android, iOS e Web (via Expo)

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|---|---|---|
| React Native | 0.83.4 | Framework principal |
| Expo | ~55.0 | Toolchain e build |
| React Navigation | ^7.x | Navegação entre telas (Stack + Bottom Tabs) |
| React Native Maps | ^1.27 | Mapa interativo |
| React Native Calendars | ^1.131 | Calendário de agendamento |
| Expo Location | ^55.1 | Geolocalização do usuário |
| Expo Linear Gradient | ^55.0 | Gradientes visuais |
| Expo Blur | ^55.0 | Efeitos de blur na UI |
| React Native Reanimated | ^4.3 | Animações performáticas |
| React Native Modal | ^14.0 | Modais customizados |
| Expo Vector Icons | ^15.1 | Biblioteca de ícones |

---

## 🏗️ Estrutura do Projeto
BarberGo/

├── App.js              # Entrada principal da aplicação

├── index.js            # Ponto de registro do app

├── app.json            # Configurações do Expo

├── vercel.json         # Configurações de deploy web

├── package.json        # Dependências e scripts

├── jsconfig.json       # Configuração de paths

├── assets/             # Imagens, fontes e recursos estáticos

└── src/                # Código-fonte principal

├── screens/        # Telas da aplicação

├── components/     # Componentes reutilizáveis

├── navigation/     # Configuração de rotas

└── styles/         # Estilos globais

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
- Integração com serviços de **geolocalização** e **mapas**
- Criação de **UIs complexas** com animações e efeitos visuais
- Uso estratégico de **IA generativa** como ferramenta de apoio no desenvolvimento
- **Engenharia de prompts** aplicada à programação
- Boas práticas de **organização de código** e estrutura de projetos

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

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  Feito com dedicação por <a href="https://github.com/gabrielnovaesdev">Gabriel Novaes</a>
</div>
