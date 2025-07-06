# Bela Vista Backend - Documentação Completa

## 📋 Visão Geral

O **Bela Vista Backend** é uma API REST desenvolvida em Node.js com TypeScript para gerenciamento de arenas esportivas, agendamentos, pagamentos e sistema de usuários. O projeto utiliza arquitetura modular com Clean Architecture e suporta múltiplos clientes através de sistema de white label.

## 🏗️ Arquitetura

### Stack Tecnológica
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Dependency Injection**: TSyringe
- **Authentication**: JWT
- **Real-time**: Socket.io
- **Cron Jobs**: node-cron
- **File Upload**: Multer
- **Email**: Nodemailer + Handlebars
- **Validation**: Celebrate
- **Testing**: Jest

### Padrões Arquiteturais
- **Clean Architecture**: Separação clara entre camadas
- **Domain-Driven Design (DDD)**: Organização por domínios de negócio
- **Dependency Injection**: Inversão de controle com TSyringe
- **Repository Pattern**: Abstração de acesso a dados
- **Service Layer**: Lógica de negócio isolada

## 📁 Estrutura do Projeto

```
src/
├── @types/                    # Definições de tipos globais
├── config/                    # Configurações da aplicação
├── emails/                    # Templates de email (Handlebars)
├── modules/                   # Módulos da aplicação
│   ├── cancelation_rules/     # Regras de cancelamento
│   ├── monthly/              # Sistema de mensalidades
│   ├── notifications/        # Sistema de notificações
│   ├── places/              # Gestão de lugares/arenas
│   ├── privacy_policy/      # Políticas de privacidade
│   ├── score/               # Sistema de pontuação
│   ├── users/               # Gestão de usuários
│   └── white_label/         # Configurações multi-cliente
├── shared/                   # Código compartilhado
│   ├── assets/              # Assets estáticos
│   ├── container/           # Configuração de DI
│   ├── errors/              # Tratamento de erros
│   ├── infra/               # Infraestrutura compartilhada
│   └── utils/               # Utilitários
└── white_label/             # Configurações de clientes
```

## 🎯 Módulos Principais

### 1. Users (Usuários)
**Localização**: `src/modules/users/`

**Funcionalidades**:
- Autenticação e autorização
- Gestão de perfis de usuário
- Recuperação de senha
- Upload de avatar
- Tipos de usuário (admin, comum, etc.)

**Entidades Principais**:
- `User`: Usuário principal
- `UserTypes`: Tipos de usuário
- `UserTokens`: Tokens de autenticação

**Serviços Principais**:
- `AuthenticateUserService`: Autenticação
- `CreateUserService`: Criação de usuários
- `UpdateProfileService`: Atualização de perfil
- `SendForgotPasswordEmailService`: Recuperação de senha

### 2. Places (Lugares/Arenas)
**Localização**: `src/modules/places/`

**Funcionalidades**:
- Gestão de arenas e quadras
- Agendamentos
- Pagamentos (PIX, Cartão)
- Materiais esportivos
- Esportes e categorias
- Torneios
- Preços e exceções

**Submódulos**:
- **Appointments**: Agendamentos
- **Courts**: Quadras
- **Sports**: Esportes
- **Materials**: Materiais
- **Tournaments**: Torneios
- **CreditCards**: Cartões de crédito

**Entidades Principais**:
- `Appointment`: Agendamento
- `Court`: Quadra
- `Sport`: Esporte
- `Material`: Material esportivo
- `Place`: Arena/Lugar

**Serviços Principais**:
- `CreateAppointmentService`: Criação de agendamentos
- `ConsultarCobranca`: Verificação de pagamentos PIX
- `CheckUnpaidPaymentsService`: Verificação de pagamentos pendentes
- `CreateCourtService`: Criação de quadras

### 3. Monthly (Mensalidades)
**Localização**: `src/modules/monthly/`

**Funcionalidades**:
- Gestão de mensalidades
- Configuração de horários
- Controle de faltas
- Renovação automática

**Entidades Principais**:
- `Monthly`: Mensalidade
- `MonthlyUserMissedDays`: Faltas de usuários

### 4. Score (Pontuação)
**Localização**: `src/modules/score/`

**Funcionalidades**:
- Sistema de pontuação
- Histórico de pontos
- Regras de pontuação
- Módulos de pontuação

**Entidades Principais**:
- `ScoreRule`: Regras de pontuação
- `UserHistoryScore`: Histórico de pontos
- `Module`: Módulos de pontuação

### 5. Notifications (Notificações)
**Localização**: `src/modules/notifications/`

**Funcionalidades**:
- Sistema de notificações push
- Integração com OneSignal
- Notificações específicas e gerais

### 6. Cancelation Rules (Regras de Cancelamento)
**Localização**: `src/modules/cancelation_rules/`

**Funcionalidades**:
- Regras de cancelamento
- Políticas de reembolso
- Configuração de prazos

## 🔧 Configurações

### White Label
O sistema suporta múltiplos clientes através do sistema de white label:

**Clientes Suportados**:
- **BelaVista**: Cliente principal
- **Ahaya**: Arena Ahaya
- **Calango**: Arena Calango
- **Jardins**: Arena Jardins

**Configuração**: `src/white_label/index.ts`

**Propriedades Configuráveis**:
- URLs das lojas (iOS/Android)
- Chaves de pagamento (sandbox/produção)
- URLs do backend
- Configurações de notificação
- Funcionalidades habilitadas

### Banco de Dados
**Configuração**: `ormconfig.js`

**Características**:
- PostgreSQL
- Configurações separadas para dev/prod
- Migrations automáticas
- Entidades TypeORM

### Variáveis de Ambiente
```env
CLIENT=BelaVista          # Cliente ativo
ENV=dev                   # Ambiente (dev/prod)
JWT_SECRET=secret         # Chave JWT
MAIL_HOST=smtp.gmail.com  # Servidor de email
MAIL_PORT=587            # Porta do email
MAIL_USER=user@email.com # Usuário do email
MAIL_PASS=password       # Senha do email
```

## 🚀 Execução

### Pré-requisitos
- Node.js 14+
- PostgreSQL
- Yarn ou NPM

### Instalação
```bash
# Instalar dependências
yarn install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar migrations
yarn run:migrations

# Executar em desenvolvimento
yarn dev:server

# Build para produção
yarn build

# Executar em produção
yarn prod:server
```

### Scripts Disponíveis
- `yarn build`: Compila o projeto
- `yarn dev:server`: Executa em desenvolvimento
- `yarn prod:server`: Executa em produção com PM2
- `yarn test`: Executa testes
- `yarn run:migrations`: Executa migrations do banco

## 🔄 Cron Jobs

### Agendamentos
**Localização**: `src/modules/schedules/index.ts`

**Jobs Ativos**:
1. **Verificação de Pagamentos Pendentes** (a cada 1 minuto)
   - Endpoint: `/appointments/check-unpaid-payments`
   - Serviço: `CheckUnpaidPaymentsService`
   - Função: Verifica pagamentos PIX pendentes

2. **Verificação de Agendamentos Não Pagos** (a cada 1 minuto)
   - Endpoint: `/appointments/check-unpaid`
   - Serviço: `CheckUnpaidAppointmentsService`
   - Função: Cancela agendamentos não pagos após 5 minutos

## 💳 Sistema de Pagamentos

### PIX (Ailos)
**Serviços**:
- `ConsultarCobranca`: Consulta status de cobrança PIX
- `ExecutePayment`: Executa pagamento PIX
- `CheckUnpaidPaymentsService`: Verifica pagamentos pendentes

**Integração**:
- API Ailos para PIX
- Webhooks para confirmação
- Verificação automática de status

### Cartão de Crédito
**Serviços**:
- `CreateCreditCardService`: Criação de cartões
- `FindAllByUserService`: Busca cartões do usuário

## 📧 Sistema de Emails

**Localização**: `src/emails/`

**Templates Disponíveis**:
- `AppointmentCreated/`: Confirmação de agendamento
- `ForgotPassword/`: Recuperação de senha
- `PasswordCode/`: Código de verificação
- `MonthlyRequestApproved/`: Aprovação de mensalidade

**Configuração**: `src/config/mail.ts`

## 🔐 Autenticação e Autorização

### JWT
- Tokens de acesso
- Refresh tokens
- Middleware de autenticação

### Middlewares
- `ensureAuthenticate`: Verifica autenticação
- Validação de dados com Celebrate
- Tratamento de erros global

## 📡 API Endpoints

### Usuários
- `POST /users` - Criar usuário
- `POST /sessions` - Autenticar
- `PUT /profile` - Atualizar perfil
- `POST /password/forgot` - Esqueci senha
- `POST /password/reset` - Resetar senha

### Agendamentos
- `POST /appointments/create` - Criar agendamento
- `GET /appointments/findByID` - Buscar agendamento
- `DELETE /appointments/deleteAppointment` - Deletar agendamento
- `GET /appointments/findAgenda` - Buscar agenda
- `POST /appointments/check-unpaid-payments` - Verificar pagamentos pendentes

### Quadras
- `POST /courts/create` - Criar quadra
- `GET /courts/findAll` - Listar quadras
- `PUT /courts/edit` - Editar quadra
- `DELETE /courts/delete` - Deletar quadra

### Esportes
- `POST /sports/create` - Criar esporte
- `GET /sports/findAll` - Listar esportes
- `PUT /sports/edit` - Editar esporte

### Pagamentos
- `POST /appointments/payPix` - Pagar com PIX
- `POST /appointments/consultarCobrancaAilos` - Consultar cobrança

## 🧪 Testes

**Framework**: Jest

**Execução**:
```bash
yarn test
```

**Configuração**: `jest.config.js`

## 📊 Monitoramento e Logs

### Logs
- Console logs para desenvolvimento
- Logs estruturados para produção
- Logs de erro centralizados

### Métricas
- Performance de endpoints
- Uso de recursos
- Status de serviços externos

## 🔒 Segurança

### Implementações
- Validação de entrada com Celebrate
- Sanitização de dados
- Rate limiting
- CORS configurado
- Headers de segurança

### Autenticação
- JWT tokens
- Refresh tokens
- Middleware de autenticação
- Validação de permissões

## 🚨 Tratamento de Erros

### AppError
**Localização**: `src/shared/errors/AppError.ts`

**Características**:
- Erros customizados
- Códigos de status HTTP
- Mensagens de erro estruturadas

### Middleware de Erro
**Localização**: `src/shared/infra/http/app.ts`

**Funcionalidades**:
- Captura de erros não tratados
- Resposta padronizada de erro
- Logs de erro

## 🔄 Migrations

**Localização**: `src/shared/infra/typeorm/migrations/`

**Execução**:
```bash
yarn run:migrations
```

**Criação**:
```bash
yarn typeorm migration:create -n NomeDaMigration
```

## 📦 Deploy

### Produção
- Build com Babel
- PM2 para gerenciamento de processos
- Nginx como proxy reverso
- PostgreSQL em servidor dedicado

### Ambiente
- Docker (opcional)
- Variáveis de ambiente configuradas
- Logs centralizados
- Monitoramento ativo

## 🤝 Contribuição

### Padrões de Código
- ESLint configurado
- Prettier para formatação
- TypeScript strict mode
- Conventional commits

### Estrutura de Commits
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas de build
```

## 📞 Suporte

### Contatos
- **Desenvolvedor**: Pedro Carvalho
- **Email**: [email]
- **Repositório**: [URL do repositório]

### Documentação Adicional
- API Documentation: [URL]
- Swagger: [URL]
- Postman Collection: [URL]

---

**Versão**: 1.0.0  
**Última Atualização**: Dezembro 2024  
**Licença**: MIT 