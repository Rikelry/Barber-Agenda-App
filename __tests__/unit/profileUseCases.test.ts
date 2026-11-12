import { describe, expect, it } from "@jest/globals";

import { InMemoryUserDataSource } from "@/infra/datasources/inMemoryUserDataSource";
import { ValidationError } from "@/model/errors";
import { ProfileUseCases, validateProfile } from "@/usecase/profileUseCases";

const FORM_OK = { name: "Felipe Albuquerque", phone: "(11) 98765-4321", currentPassword: "", newPassword: "" };

describe("ProfileUseCases", () => {
  it("valida nome, celular com DDD e a troca de senha", () => {
    expect(validateProfile(FORM_OK)).toEqual({});
    expect(validateProfile({ ...FORM_OK, name: "Fe", phone: "98765" })).toEqual({
      name: "Informe o nome completo.",
      phone: "Informe o celular com DDD.",
    });
    expect(validateProfile({ ...FORM_OK, newPassword: "123" })).toEqual({
      newPassword: "A nova senha precisa de pelo menos 8 caracteres.",
      currentPassword: "Digite a senha atual para trocar a senha.",
    });
  });

  it("salva só com dígitos no telefone e recusa senha atual errada", async () => {
    const casos = new ProfileUseCases(new InMemoryUserDataSource());
    const salvo = await casos.saveProfile({ ...FORM_OK, name: "  Felipe A.  " });
    expect(salvo).toMatchObject({ name: "Felipe A.", phone: "11987654321", email: "felipe.alb@provedor.com" });

    const erro = await casos
      .saveProfile({ ...FORM_OK, currentPassword: "errada", newPassword: "novaSenha123" })
      .catch((e: unknown) => e);
    expect(erro).toBeInstanceOf(ValidationError);
    expect((erro as ValidationError).fields).toEqual({ currentPassword: "A senha atual não confere." });
  });
});
