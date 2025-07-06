# Contexto do Projeto - Bela Vista Backend

## 🎯 Propósito do Sistema

O **Bela Vista Backend** é uma API REST desenvolvida para gerenciar arenas esportivas, permitindo:

1. **Agendamento de Quadras**: Sistema completo de reservas de quadras esportivas
2. **Gestão de Pagamentos**: Integração com PIX (Ailos) e cartão de crédito
3. **Sistema de Usuários**: Cadastro, autenticação e perfis de usuários
4. **White Label**: Suporte a múltiplos clientes (BelaVista, Ahaya, Calango, Jardins)
5. **Notificações**: Sistema de notificações push e emails
6. **Mensalidades**: Gestão de planos mensais
7. **Torneios**: Organização de competições
8. **Materiais**: Controle de equipamentos esportivos

## 🏢 Clientes Atuais

### BelaVista (Cliente Principal)
- **Localização**: Santa Catarina, Brasil
- **Especialidade**: Quadras de tênis e futebol
- **Funcionalidades**: Todas habilitadas
- **Backend URL**: https://dev.pluma.tech

### Ahaya
- **Localização**: Santa Catarina, Brasil
- **Especialidade**: Quadras poliesportivas
- **Funcionalidades**: Notificações e emails habilitados
- **Backend URL**: https://ahaya.pluma.tech

### Calango
- **Localização**: Distrito Federal, Brasil
- **Especialidade**: Quadras de futebol
- **Funcionalidades**: Notificações habilitadas
- **Backend URL**: https://btplace.pluma.tech

### Jardins
- **Localização**: São Paulo, Brasil
- **Especialidade**: Quadras de tênis
- **Funcionalidades**: Sistema de pontuação habilitado
- **Backend URL**: https://jardins.pluma.tech

## 💼 Regras de Negócio Principais

### Agendamentos
1. **Criação**: Usuários podem criar agendamentos para quadras disponíveis
2. **Pagamento**: Obrigatório para confirmar o agendamento
3. **Cancelamento**: Automático após 5 minutos sem pagamento
4. **Verificação**: Sistema verifica pagamentos PIX a cada minuto
5. **Materiais**: Possibilidade de incluir equipamentos no agendamento

### Pagamentos
1. **PIX**: Integração com Ailos para pagamentos instantâneos
2. **Cartão**: Suporte a cartão de crédito
3. **Verificação**: Cron job verifica status dos pagamentos
4. **Confirmação**: Agendamentos são marcados como pagos automaticamente

### Usuários
1. **Tipos**: Admin, comum, VIP
2. **Perfis**: Dados pessoais, preferências, histórico
3. **Notificações**: Configuração de notificações push
4. **Avatar**: Upload de foto de perfil

### Mensalidades
1. **Planos**: Configuração de horários fixos semanais
2. **Faltas**: Controle de faltas e reposições
3. **Renovação**: Sistema automático de renovação
4. **Preços**: Configuração de valores por plano

## 🔄 Fluxos Principais

### Fluxo de Agendamento
1. Usuário seleciona quadra e horário
2. Sistema verifica disponibilidade
3. Usuário confirma agendamento
4. Sistema gera cobrança PIX ou cartão
5. Usuário realiza pagamento
6. Sistema confirma pagamento via cron job
7. Agendamento é confirmado

### Fluxo de Pagamento PIX
1. Sistema cria cobrança na API Ailos
2. Usuário recebe QR Code ou código PIX
3. Usuário realiza pagamento
4. Ailos envia webhook de confirmação
5. Sistema marca agendamento como pago
6. Usuário recebe confirmação por email

### Fluxo de Cancelamento
1. Sistema verifica agendamentos não pagos
2. Após 5 minutos, cancela automaticamente
3. Quadra fica disponível novamente
4. Usuário recebe notificação de cancelamento

## 🛠️ Tecnologias e Integrações

### APIs Externas
- **Ailos PIX**: Pagamentos instantâneos
- **OneSignal**: Notificações push
- **Telegram**: Notificações administrativas
- **WhatsApp**: Notificações de negócio

### Serviços Internos
- **Email**: Nodemailer com templates Handlebars
- **Upload**: Multer para arquivos
- **Cache**: Redis (opcional)
- **Monitoramento**: Logs estruturados

## 📊 Métricas de Negócio

### Agendamentos
- Taxa de conversão (agendamento → pagamento)
- Tempo médio de pagamento
- Taxa de cancelamento
- Ocupação das quadras

### Usuários
- Novos cadastros por mês
- Usuários ativos
- Retenção de clientes
- Satisfação (NPS)

### Financeiro
- Receita total
- Receita por método de pagamento
- Taxa de chargeback
- Margem de lucro

## 🚨 Pontos de Atenção

### Performance
- Cron jobs executam a cada minuto
- Verificação de pagamentos pode ser intensiva
- Upload de imagens deve ser otimizado
- Queries de agendamentos devem ser indexadas

### Segurança
- Tokens JWT devem ser validados
- Dados de pagamento devem ser criptografados
- Upload de arquivos deve ser validado
- Rate limiting deve ser implementado

### Monitoramento
- Logs de erro devem ser centralizados
- Métricas de performance devem ser coletadas
- Alertas para falhas críticas
- Backup automático do banco

## 🔮 Roadmap

### Melhorias Planejadas
1. **App Mobile**: Desenvolvimento de aplicativo nativo
2. **Dashboard Admin**: Interface administrativa web
3. **Relatórios**: Sistema de relatórios avançados
4. **Integração**: Mais gateways de pagamento
5. **Chat**: Sistema de chat interno
6. **Gamificação**: Sistema de pontos e recompensas

### Novos Clientes
- Expansão para outras regiões
- Novos tipos de esporte
- Clientes corporativos
- Parcerias com academias

## 📞 Contatos e Suporte

### Equipe de Desenvolvimento
- **Desenvolvedor Principal**: Pedro Carvalho
- **Stack**: Node.js, TypeScript, PostgreSQL
- **Metodologia**: Clean Architecture, DDD

### Infraestrutura
- **Servidor**: VPS com Ubuntu
- **Banco**: PostgreSQL dedicado
- **Backup**: Automático diário
- **Monitoramento**: PM2 + logs estruturados

---

**Última Atualização**: Dezembro 2024  
**Status**: Em produção  
**Versão**: 1.0.0 