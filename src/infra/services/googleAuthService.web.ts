// Login do Google na web via Google Identity Services (GIS). Cumpre o mesmo contrato do
// googleAuthService nativo: devolve só o ID token, que o backend valida com o mesmo
// GOOGLE_CLIENT_ID. A lib @react-native-google-signin não funciona na web.
//
// Usamos o botão oficial do Google renderizado num container fora da tela e o acionamos no
// clique do usuário, em vez de google.accounts.id.prompt() (One Tap): o One Tap costuma
// abortar com "FedCM get() rejects with AbortError" e só funciona para quem já está logado.

import { DomainError } from "@/model/errors";
import type { GoogleCredential, IGoogleAuthService } from "@/model/services/iGoogleAuthService";

const GIS_SRC = "https://accounts.google.com/gsi/client";

type RespostaCredencial = { credential?: string };

type ContasGoogle = {
  id: {
    initialize: (config: { client_id: string; callback: (resposta: RespostaCredencial) => void }) => void;
    renderButton: (parent: HTMLElement, options: { type?: string; size?: string; text?: string }) => void;
  };
};

declare global {
  interface Window {
    google?: { accounts?: ContasGoogle };
  }
}

const erroDeCarga = () =>
  new DomainError("Não foi possível carregar o login do Google. Verifique a conexão e tente novamente.", "SERVER");

const carregarGis = (): Promise<ContasGoogle> =>
  new Promise((resolve, reject) => {
    const jaCarregado = window.google?.accounts;
    if (jaCarregado) {
      resolve(jaCarregado);
      return;
    }

    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const contas = window.google?.accounts;
      if (contas) resolve(contas);
      else reject(erroDeCarga());
    };
    script.onerror = () => reject(erroDeCarga());
    document.head.appendChild(script);
  });

let prontidao: Promise<HTMLElement> | null = null;
let responderCredencial: ((resposta: RespostaCredencial) => void) | null = null;

// Prepara (uma vez) o botão oculto do Google. Em caso de falha, libera nova tentativa.
const prepararBotao = (): Promise<HTMLElement> => {
  if (prontidao) return prontidao;

  const tentativa = carregarGis().then((contas) => {
    const clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    if (!clientId) throw new DomainError("Login com Google não está configurado.", "SERVER");

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.setAttribute("aria-hidden", "true");
    document.body.appendChild(container);

    contas.id.initialize({
      client_id: clientId,
      callback: (resposta) => responderCredencial?.(resposta),
    });
    contas.id.renderButton(container, { type: "standard", size: "large" });
    return container;
  });

  prontidao = tentativa;
  tentativa.catch(() => {
    if (prontidao === tentativa) prontidao = null;
  });
  return tentativa;
};

// Pré-carrega o script do Google assim que o módulo é carregado (o container o importa na web),
// para o clique do usuário acontecer com tudo pronto e não ser bloqueado como popup.
if (typeof document !== "undefined" && typeof window !== "undefined") {
  prepararBotao().catch(() => undefined);
}

export class GoogleAuthService implements IGoogleAuthService {
  async signIn(): Promise<GoogleCredential> {
    const container = await prepararBotao();
    const botao = container.querySelector<HTMLElement>('div[role="button"]');
    if (!botao) throw erroDeCarga();

    return new Promise<GoogleCredential>((resolve, reject) => {
      responderCredencial = (resposta) => {
        responderCredencial = null;
        if (resposta.credential) resolve({ idToken: resposta.credential });
        else reject(new DomainError("Não foi possível entrar com o Google. Tente novamente.", "INVALID_DATA"));
      };
      botao.click();
    });
  }
}
