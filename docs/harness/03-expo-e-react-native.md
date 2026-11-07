# 03 · Expo e React Native

> Base: seções "Expo has changed", "Commands", "Navigation & Routing", "Building with EAS" e "Rules" do `AGENTS.md`. Este arquivo só resume — consulte o `AGENTS.md` para o texto completo.

## Antes de escrever código de Expo/React Native

1. Leia a versão major do pacote `expo` no `package.json`.
2. Consulte a documentação versionada: `https://docs.expo.dev/versions/v<major>.0.0/`.
3. Para o resto, use o índice `https://docs.expo.dev/llms.txt`. **Nunca responda de memória** — o Expo muda a cada SDK.

## Comandos

```bash
npx expo install <pacote>   # sempre, em vez de npm/yarn/pnpm/bun add
npx expo start              # servidor de desenvolvimento
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnostica dependências e configuração
npx expo install --fix      # corrige versões incompatíveis
```

## Regras

- Navegação só com **Expo Router**. Rotas ficam em `src/app/` e são finas (`_layout.tsx` define navegadores).
- `ios/` e `android/` são gerados (CNG): nunca crie nem edite à mão — configure em `app.json` e config plugins.
- Prefira módulos Expo recomendados a bibliotecas de terceiros. Ao adicionar lib com código nativo, use development build (`npx expo run:ios|android` ou `eas build --profile development`).
- Builds e envios pela nuvem via EAS (`eas build`, `eas submit`, `eas update`).
