# Documentação Técnica Detalhada - Bela Vista Backend

## 🔧 Configurações Técnicas

### TypeScript Configuration
```json
{
  "target": "es2017",
  "module": "commonjs",
  "strict": true,
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true,
  "paths": {
    "@modules/*": ["modules/*"],
    "@config/*": ["config/*"],
    "@shared/*": ["shared/*"]
  }
}
```

### Babel Configuration
```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    'babel-plugin-transform-typescript-metadata',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@modules': './src/modules',
          '@config': './src/config',
          '@shared': './src/shared',
        },
      },
    ],
  ],
};
```

## 🏗️ Arquitetura de Módulos

### Estrutura Padrão de Módulo
```
module/
├── dtos/                    # Data Transfer Objects
├── infra/                   # Infraestrutura
│   ├── http/               # Controllers e Routes
│   └── typeorm/            # Entidades e Repositories
├── repositories/           # Interfaces dos repositories
└── services/              # Lógica de negócio
```

### Dependency Injection (TSyringe)
```typescript
// Registro no container
container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

// Injeção em serviços
@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
}
```

## 📊 Modelo de Dados

### Entidades Principais

#### User (Usuário)
```typescript
@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  cellphone: string;

  @Column()
  notification_id: string;

  @Column()
  vip: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

#### Appointment (Agendamento)
```typescript
@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  id_court: string;

  @Column()
  id_place: string;

  @Column()
  price: number;

  @Column('timestamp with time zone')
  start_date: Date;

  @Column('timestamp with time zone')
  finish_date: Date;

  @Column()
  canceled: boolean;

  @Column()
  id_transaction: string;

  @Column()
  observation: string;

  @Column()
  number_of_players: number;

  @Column()
  paid: boolean;

  @Column()
  type: string; // 'pix' | 'credit_card'

  @Column()
  retrieved: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

#### Court (Quadra)
```typescript
@Entity('courts')
class Court {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  id_place: string;

  @Column()
  id_sport: string;

  @Column()
  active: boolean;

  @Column()
  special_thumbnail: string;

  @Column()
  special_image: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

## 🔄 Sistema de Cron Jobs

### Configuração Atual
```typescript
// src/modules/schedules/index.ts
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

### Serviços de Cron

#### CheckUnpaidPaymentsService
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
          // Appointment is automatically marked as paid in ConsultarCobranca
          console.log(`Payment confirmed for appointment ${appointment.id}`);
        }
      }
    }
  }
}
```

#### CheckUnpaidAppointmentsService
```typescript
@injectable()
class CheckUnpaidAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(): Promise<void> {
    const appointments = await this.appointmentsRepository.findUnpaidAppointments();
    
    appointments.forEach(async (appointment) => {
      const minutesDifference = differenceInMinutes(new Date(), new Date(appointment.created_at));
      
      if (!appointment.paid && !appointment.canceled && minutesDifference >= 5) {
        appointment.canceled = true;
        appointment.observation = `${appointment.observation} - Cancelado por falta de pagamento após 5 minutos`;
        await this.appointmentsRepository.save(appointment);
      }
    });
  }
}
```

## 💳 Sistema de Pagamentos

### PIX (Ailos)
```typescript
// ConsultarCobranca.ts
@injectable()
class ConsultarCobranca {
  public async execute(id: string): Promise<IReturnProps> {
    const httpsAgent = createHttpsAgent();
    const token = await GetToken(httpsAgent);
    
    const response = await axios({
      method: 'get',
      url: `https://pixcobranca.ailos.coop.br/ailos/pix-cobranca/api/v1/cob/${id}`,
      httpsAgent,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.data.status === 'CONCLUIDA') {
      const appointment = await this.appointmentsRepository.findByIdTransaction(id);
      if (appointment) {
        appointment.paid = true;
        await this.appointmentsRepository.save(appointment);
        return { status: 'paid' };
      }
    }
    return { status: 'pending' };
  }
}
```

### Cartão de Crédito
```typescript
// ExecutePayment.ts
@injectable()
class ExecutePayment {
  public async execute(data: IExecutePaymentDTO): Promise<IReturnProps> {
    // Implementação de pagamento com cartão
    // Integração com gateway de pagamento
  }
}
```

## 📧 Sistema de Emails

### Configuração
```typescript
// src/config/mail.ts
export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      email: 'noreply@belavista.com',
      name: 'Bela Vista',
    },
  },
} as IMailConfig;
```

### Templates Handlebars
```handlebars
<!-- src/emails/AppointmentCreated/BelaVista.hbs -->
<h1>Agendamento Confirmado</h1>
<p>Olá {{name}},</p>
<p>Seu agendamento foi confirmado para {{date}} às {{time}}.</p>
<p>Quadra: {{court}}</p>
<p>Valor: R$ {{price}}</p>
```

## 🔐 Autenticação

### JWT Configuration
```typescript
// src/config/auth.ts
export default {
  jwt: {
    secret: process.env.JWT_SECRET || 'default',
    expiresIn: '1d',
  },
} as IAuthConfig;
```

### Middleware de Autenticação
```typescript
// src/shared/infra/http/middlewares/ensureAuthenticate.ts
export default function ensureAuthenticate(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new AppError('Token not provided', 401);
  }

  const [, token] = authHeader.split(' ');
  
  try {
    const decoded = verify(token, authConfig.jwt.secret);
    const { sub } = decoded as ITokenPayload;
    request.user = { id: sub };
    return next();
  } catch {
    throw new AppError('Token invalid', 401);
  }
}
```

## 🗄️ Banco de Dados

### Configuração TypeORM
```javascript
// ormconfig.js
const devConfig = [
  {
    type: 'postgres',
    host: '159.223.125.81',
    port: 35432,
    username: 'postgres',
    password: 'd7ae6bbfa000ab3e01cf70f5a757effe',
    database: process.env.CLIENT,
    entities: [
      './src/modules/**/infra/typeorm/entities/**/*.ts',
      './src/modules/**/infra/typeorm/entities/*.ts',
    ],
    migrations: ['./src/shared/infra/typeorm/migrations/*.ts'],
    cli: {
      migrationsDir: './src/shared/infra/typeorm/migrations',
    },
  },
];
```

### Migrations
```typescript
// Exemplo de migration
export default class CreateUsers1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```

## 🧪 Testes

### Configuração Jest
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapping: {
    '@modules/(.*)': '<rootDir>/src/modules/$1',
    '@config/(.*)': '<rootDir>/src/config/$1',
    '@shared/(.*)': '<rootDir>/src/shared/$1',
  },
};
```

### Exemplo de Teste
```typescript
// __tests__/CreateUserService.spec.ts
describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });
    
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John Doe');
  });
});
```

## 🔄 Webhooks e Integrações

### Webhook Ailos
```typescript
// src/modules/places/infra/http/controllers/Appointments/AppointmentsController.ts
public async AilosWebHook(request: Request, response: Response): Promise<Response> {
  const filePath = path.join(__dirname, 'request-body.txt');
  const dataToWrite = JSON.stringify(request.body, null, 2);
  await fs.writeFile(filePath, dataToWrite);
  return response.json({ ok: true });
}
```

### Socket.io
```typescript
// src/shared/infra/http/app.ts
socket(): void {
  this.io = Socket(this.server, {
    cors: { origin: 'http://localhost:8888' },
  });

  this.io.on('connection', socket => {
    const { id_user } = socket.handshake.query;
    this.connectedUsers[id_user] = socket.id;
    
    socket.on('desconnect', () => {
      delete this.connectedUsers[id_user];
    });
  });
}
```

## 📊 Logs e Monitoramento

### Logs Estruturados
```typescript
// Exemplo de logging
console.log('Checking unpaid payments...');
console.log(`Found ${unpaidAppointments.length} unpaid appointments`);
console.log(`Payment confirmed for appointment ${appointment.id}`);
console.error('Error checking payment for appointment:', error);
```

### Métricas de Performance
- Tempo de resposta dos endpoints
- Taxa de erro
- Uso de memória e CPU
- Status de serviços externos

## 🔒 Segurança

### Validação de Entrada
```typescript
// Exemplo com Celebrate
import { celebrate, Segments, Joi } from 'celebrate';

const createUserValidator = celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  },
});
```

### Sanitização
- Validação de tipos com TypeScript
- Sanitização de strings
- Escape de caracteres especiais
- Validação de tamanhos de arquivo

## 🚀 Deploy e CI/CD

### Build Process
```bash
# Build com Babel
yarn build

# Verificação de tipos
npx tsc --noEmit

# Testes
yarn test

# Linting
yarn lint
```

### PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'bt_api',
    script: 'dist/shared/infra/http/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      CLIENT: 'BelaVista',
    },
  }],
};
```

## 📈 Performance

### Otimizações Implementadas
- Lazy loading de módulos
- Connection pooling no banco
- Cache de queries frequentes
- Compressão de respostas
- Rate limiting

### Monitoramento
- APM (Application Performance Monitoring)
- Logs estruturados
- Métricas de negócio
- Alertas automáticos

---

**Última Atualização**: Dezembro 2024  
**Versão da Documentação**: 1.0.0 