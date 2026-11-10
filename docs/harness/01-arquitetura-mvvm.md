# 01 · Arquitetura MVVM

> Fonte de verdade: `docs/architecture/mvvm-sofisticado.md`. Este arquivo só resume e aponta para lá. Não duplique o texto longo.

## Camadas e responsabilidades

| Camada | Pasta | Responsabilidade |
|---|---|---|
| Rotas | `src/app/` | Rotas finas do Expo Router. Só importam a tela e fazem `export default`. |
| View | `src/view/` | Espelha `src/app/` 1:1. Só renderiza estado e encaminha interações. |
| ViewModel | `src/viewmodel/` | Estado e ações da tela como tipos (ex.: `LoginState`/`LoginActions`, via `useState`). Coordena a navegação. Depende de contratos de Use Cases. |
| Use Cases | `src/usecase/` | Regras de negócio e validações. Recebem dependências pelo construtor. |
| Model | `src/model/` | Domínio puro: `entities/`, `datasources/`, `services/`, `errors.ts`. |
| Infra | `src/infra/` | Implementa os contratos do domínio e traduz erros para `DomainError`. |
| DI | `src/di/container.ts` | Único ponto que importa `@/infra` (com os testes). |

## Direção das dependências

`View → ViewModel → Use Case → Contrato do domínio ← Infra ← Container DI`

Detalhes (responsabilidades, erros, testabilidade, evolução) em `docs/architecture/mvvm-sofisticado.md`, seções 1 a 7.

## Exemplos curtos

### Rota fina — `src/app/login.tsx`
```tsx
import Login from "@/view/login";

export default Login;
```

### Entidade (sempre `type`) — `src/model/entities/booking.ts`
```ts
export type Booking = {
  id: string;
  clientId: string;
  startsAt: Date;
};
```

### Erro de domínio — `src/model/errors.ts`
```ts
export class DomainError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}
```

### Contrato (interface com prefixo `i`) — `src/model/datasources/iBookingDataSource.ts`
```ts
import type { Booking } from '@/model/entities/booking';

export interface IBookingDataSource {
  list(): Promise<Booking[]>;
  save(booking: Booking): Promise<void>;
}
```

### Use Case — `src/usecase/createBooking.ts`
```ts
import type { IBookingDataSource } from '@/model/datasources/iBookingDataSource';
import type { Booking } from '@/model/entities/booking';

export class CreateBooking {
  constructor(private readonly dataSource: IBookingDataSource) {}

  async execute(booking: Booking): Promise<Booking> {
    // validações e regras de negócio aqui
    await this.dataSource.save(booking);
    return booking;
  }
}
```

### Container — `src/di/container.ts`
```ts
import { InMemoryBookingDataSource } from '@/infra/datasources/inMemoryBookingDataSource';
import { CreateBooking } from '@/usecase/createBooking';

const bookingDataSource = new InMemoryBookingDataSource();

export const createBooking = new CreateBooking(bookingDataSource);
```

### ViewModel (tipos de estado, `useState`) — `src/viewmodel/useLoginViewModel.ts`
```ts
import { useState } from "react";
import { router } from "expo-router";
import { authUseCases } from "@/di/container";
import type { IAuthUseCases } from "@/usecase/iAuthUseCases";
import { DomainError } from "@/model/errors";

export type LoginState = { loading: boolean; error: string | null };
export type LoginActions = {
  handleLogin: (email: string, password: string) => void;
};

export function useLoginViewModel(
  auth: IAuthUseCases = authUseCases,
): [LoginState, LoginActions] {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(email: string, password: string) {
    try {
      setLoading(true);
      await auth.login(email, password);
      router.replace("/home");
    } catch (err: unknown) {
      setError(err instanceof DomainError ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return [{ loading, error }, { handleLogin }];
}
```

### View — `src/view/login.tsx`
```tsx
import { useState } from "react";
import { View, Text } from "react-native";
import { Button } from "@/view/components/button";
import { color } from "@/view/theme";
import { useLoginViewModel } from "@/viewmodel/useLoginViewModel";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [state, actions] = useLoginViewModel();
  return (
    <View>
      <Button label="Entrar" onPress={() => actions.handleLogin(email, "")} />
      {state.error && <Text style={{ color: color.error }}>{state.error}</Text>}
    </View>
  );
};

export default Login;
```
