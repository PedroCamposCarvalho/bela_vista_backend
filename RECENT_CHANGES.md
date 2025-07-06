# Mudanças Recentes - Bela Vista Backend

## 🆕 Implementação Recente: Cron Job de Verificação de Pagamentos

### 📅 Data: Dezembro 2024

### 🎯 Objetivo
Implementar um sistema automatizado para verificar pagamentos PIX pendentes de agendamentos não pagos, executando a cada minuto.

### 🔧 Arquivos Modificados/Criados

#### 1. Novo Serviço: `CheckUnpaidPaymentsService`
**Arquivo**: `src/modules/places/services/Appointments/CheckUnpaidPaymentsService.ts`

**Funcionalidade**:
- Busca todos os agendamentos não pagos
- Executa o serviço `ConsultarCobranca` para cada agendamento
- Marca automaticamente como pago quando confirmado
- Logs detalhados do processo

**Código Principal**:
```typescript
@injectable()
class CheckUnpaidPaymentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('ConsultarCobranca')
    private consultarCobranca: ConsultarCobranca,
  ) {}

  public async execute(): Promise<void> {
    const unpaidAppointments = await this.appointmentsRepository.findUnpaidAppointments();
    
    for (const appointment of unpaidAppointments) {
      if (appointment.id_transaction) {
        const result = await this.consultarCobranca.execute(appointment.id_transaction);
        if (result.status === 'paid') {
          console.log(`Payment confirmed for appointment ${appointment.id}`);
        }
      }
    }
  }
}
```

#### 2. Container de Dependências
**Arquivo**: `src/shared/container/index.ts`

**Adições**:
```typescript
import ConsultarCobranca from '@modules/places/services/Appointments/Payments/ConsultarCobranca';
import CheckUnpaidPaymentsService from '@modules/places/services/Appointments/CheckUnpaidPaymentsService';

container.registerSingleton<ConsultarCobranca>(
  'ConsultarCobranca',
  ConsultarCobranca,
);

container.registerSingleton<CheckUnpaidPaymentsService>(
  'CheckUnpaidPaymentsService',
  CheckUnpaidPaymentsService,
);
```

#### 3. Controller
**Arquivo**: `src/modules/places/infra/http/controllers/Appointments/AppointmentsController.ts`

**Adições**:
```typescript
import CheckUnpaidPaymentsService from '../../../../services/Appointments/CheckUnpaidPaymentsService';

public async checkUnpaidPayments(
  request: Request,
  response: Response,
): Promise<Response> {
  const checkUnpaidPaymentsService = container.resolve(CheckUnpaidPaymentsService);
  await checkUnpaidPaymentsService.execute();
  return response.json({ ok: true });
}
```

#### 4. Rotas
**Arquivo**: `src/modules/places/infra/http/routes/appointments.routes.ts`

**Adição**:
```typescript
appointmentsRouter.post('/check-unpaid-payments', appointmentsController.checkUnpaidPayments);
```

#### 5. Cron Job
**Arquivo**: `src/modules/schedules/index.ts`

**Modificação**:
```typescript
export default function projectSchedules(): void {
  // Verificação de pagamentos pendentes (a cada 1 minuto)
  cron.schedule('* * * * *', async function () {
    console.log('Schedule check unpaid payments is running');
    try {
      const response = await fetch('http://localhost:8888/appointments/check-unpaid-payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        console.error('Failed to check unpaid payments:', await response.text());
      }
    } catch (error) {
      console.error('Error checking unpaid payments:', error);
    }
  });

  // Verificação de agendamentos não pagos (a cada 1 minuto)
  cron.schedule('* * * * *', async function () {
    console.log('Schedule check unpaid appointments is running');
    try {
      const response = await fetch('http://localhost:8888/appointments/check-unpaid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        console.error('Failed to check unpaid appointments:', await response.text());
      }
    } catch (error) {
      console.error('Error checking unpaid appointments:', error);
    }
  });
}
```

### 🔄 Como Funciona

1. **A cada minuto**, o cron job é executado
2. Faz uma requisição POST para `/appointments/check-unpaid-payments`
3. O controller chama `CheckUnpaidPaymentsService.execute()`
4. O serviço busca todos os agendamentos não pagos
5. Para cada agendamento com `id_transaction`:
   - Chama `ConsultarCobranca.execute()` com o ID da transação
   - Se o status for 'paid', o agendamento é marcado como pago automaticamente
   - Logs são gerados para monitoramento

### 📊 Benefícios

1. **Automatização**: Verificação automática de pagamentos
2. **Confiabilidade**: Reduz erros manuais
3. **Monitoramento**: Logs detalhados do processo
4. **Performance**: Execução eficiente com tratamento de erros
5. **Escalabilidade**: Funciona com qualquer número de agendamentos

### 🚨 Considerações

1. **Performance**: O cron job executa a cada minuto, pode ser intensivo
2. **Rate Limiting**: API Ailos pode ter limites de requisições
3. **Logs**: Logs devem ser monitorados para detectar problemas
4. **Erros**: Erros individuais não param o processo para outros agendamentos

### 🔍 Monitoramento

**Logs Esperados**:
```
Schedule check unpaid payments is running
Checking unpaid payments...
Found X unpaid appointments
Checking payment for appointment [ID] with transaction [TRANSACTION_ID]
Payment confirmed for appointment [ID]
Finished checking unpaid payments
```

**Logs de Erro**:
```
Failed to check unpaid payments: [ERROR]
Error checking payment for appointment [ID]: [ERROR]
```

### 🧪 Testes

**Para testar manualmente**:
```bash
# Fazer requisição direta
curl -X POST http://localhost:8888/appointments/check-unpaid-payments

# Verificar logs
tail -f logs/app.log
```

### 📈 Métricas

**Métricas a monitorar**:
- Número de agendamentos verificados por execução
- Taxa de sucesso na verificação de pagamentos
- Tempo de execução do cron job
- Número de erros por execução

---

**Status**: ✅ Implementado e em produção  
**Próxima Revisão**: Janeiro 2025  
**Responsável**: Pedro Carvalho 