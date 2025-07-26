# Pawta – Frontend

Sistema de gerenciamento de tarefas com quadros, colunas e cards interativos, desenvolvido com Vue 3 + TailwindCSS.

---

## Visão Geral

Este projeto faz parte do sistema **Pawta**, que permite organizar tarefas em colunas por status, com suporte a **drag-and-drop**, autenticação via token e painel administrativo para gerenciamento de usuários, quadros e tarefas.

![Preview do Layout](https://www.figma.com/design/efdyorXhdBxhgaQwak6dRW/Pawta)

## Tecnologias

- **Vue 3** – Framework JavaScript
- **Vite** – Build tool rápida e moderna
- **TailwindCSS** – Estilização utilitária
- **Pinia** – Gerenciamento de estado
- **Vue Router** – Roteamento SPA
- **Axios** – Cliente HTTP
- **vuedraggable** – Drag-and-drop
- **Vue Toast Notification** – Toasts de erro/sucesso
- **JS-Cookie** – Manipulação de cookies
- **Boxicons** – Ícones vetoriais
- **VueperSlides** – Carrossel para UI

## Instalação

### Clone o repositório
```bash
git clone https://github.com/isobew/pawta-front.git
```

### Acesse o diretório
```bash
cd pawta-front
```

### Instale as dependências
```bash
npm install
```

### Rode o projeto
```bash
npm run dev
```

Certifique-se de que o backend está rodando também.

---

## Páginas e funcionalidades implementadas até agora
- Login
- Cadastro
- Dashboard (com cards de tarefas, quadros e lembretes de tarefas próximas ao vencimento de prazo)
- Página de tarefas gerais do usuário com exportação em arquivo .csv
- Página de quadros gerais
- Página de detalhes do quadro, com colunas e tarefas atribuídas ao usuário com os status “To do”, “In progress” e “Finished”, em - cards arrastáveis (draggable).
- Modais de criação/edição
- Sidebar
- Página de perfil
- Página de gerenciamento de usuários para administradores

---

## Documentação técnica
A documentação geral pode ser acessada em:
https://drive.google.com/file/d/1V6qDJhL7D4Hz7mRdoKtHA1z6cCsDHmbX/view?usp=sharing

---

## Figma
As telas estão disponíveis em:
https://www.figma.com/design/efdyorXhdBxhgaQwak6dRW/Pawta
