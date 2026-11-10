# Testes de fluxo (Maestro)

Cada fluxo de ponta a ponta é um arquivo `.yaml` nesta pasta. Crie um fluxo por jornada do usuário (ex.: `login.yaml`).

## Como rodar

```bash
npm run e2e
```

O script chama `maestro test .maestro`, que executa todos os `.yaml` da pasta.

> Requer o Maestro instalado na máquina e um emulador/dispositivo conectado.
