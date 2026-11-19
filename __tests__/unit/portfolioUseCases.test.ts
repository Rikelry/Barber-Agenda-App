import { describe, expect, it, jest } from "@jest/globals";

import type { IPortfolioDataSource } from "@/model/datasources/iPortfolioDataSource";
import type { PortfolioPhoto } from "@/model/entities/portfolioPhoto";
import { DomainError, ValidationError } from "@/model/errors";
import type { IImageStorageService } from "@/model/services/iImageStorageService";
import { PortfolioUseCases } from "@/usecase/portfolioUseCases";

const FOTO: PortfolioPhoto = {
  id: "f1",
  professionalId: "p1",
  professionalName: "Rafael",
  barbershopId: "b1",
  imageUrl: "https://x/f1.jpg",
  caption: "Degradê",
  serviceId: "s1",
  serviceName: "Corte",
  featured: true,
  createdAt: new Date(),
};

const montar = () => {
  const fonte: jest.Mocked<IPortfolioDataSource> = {
    listMine: jest.fn(async () => [FOTO]),
    listByProfessional: jest.fn(async () => [FOTO]),
    listByBarbershop: jest.fn(async () => [FOTO]),
    listFeatured: jest.fn(async () => [FOTO]),
    publish: jest.fn(async () => FOTO),
    remove: jest.fn(async () => undefined),
  };
  const storage: jest.Mocked<IImageStorageService> = { upload: jest.fn(async () => "https://x/nova.jpg") };
  return { fonte, storage, casos: new PortfolioUseCases(fonte, storage) };
};

const ARQUIVO = { uri: "file:///foto.jpg", name: "foto.jpg", mimeType: "image/jpeg" };

describe("PortfolioUseCases", () => {
  it("não publica sem foto e sem a autorização do cliente", async () => {
    const { casos, storage, fonte } = montar();
    const erro = await casos.publish({ caption: "", serviceId: null, featured: false, consent: false }, null).catch((e: unknown) => e);
    expect(erro).toBeInstanceOf(ValidationError);
    expect((erro as ValidationError).fields).toEqual({
      photo: "Escolha uma foto do seu trabalho.",
      consent: "Confirme que o cliente autorizou a publicação.",
    });
    expect(storage.upload).not.toHaveBeenCalled();
    expect(fonte.publish).not.toHaveBeenCalled();
  });

  it("envia a imagem para a pasta do portfólio e publica com a legenda limpa", async () => {
    const { casos, storage, fonte } = montar();
    await casos.publish({ caption: "  Degradê  ", serviceId: "s1", featured: true, consent: true }, ARQUIVO);
    expect(storage.upload).toHaveBeenCalledWith(ARQUIVO, "portfolio");
    expect(fonte.publish).toHaveBeenCalledWith({
      imageUrl: "https://x/nova.jpg",
      caption: "Degradê",
      serviceId: "s1",
      featured: true,
      clientConsent: true,
    });
  });

  it("acha a foto pelo id na lista do profissional e avisa quando ela sumiu", async () => {
    const { casos } = montar();
    expect((await casos.getPhoto("p1", "f1")).caption).toBe("Degradê");
    await expect(casos.getPhoto("p1", "outra")).rejects.toBeInstanceOf(DomainError);
  });
});
