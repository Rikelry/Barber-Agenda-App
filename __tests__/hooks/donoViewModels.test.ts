import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { renderHook, waitFor } from "@testing-library/react-native";

import type { Barbershop } from "@/model/entities/barbershop";
import { ValidationError } from "@/model/errors";
import type { IImagePickerService } from "@/model/services/iImagePickerService";
import type { DayHours, IOwnerUseCases } from "@/usecase/iOwnerUseCases";
import { useEditarBarbeariaViewModel } from "@/viewmodel/useEditarBarbeariaViewModel";
import { mascararHora, useHorariosBarbeariaViewModel } from "@/viewmodel/useHorariosBarbeariaViewModel";
import { useMinhasBarbeariasViewModel } from "@/viewmodel/useMinhasBarbeariasViewModel";
import { useNovaBarbeariaViewModel } from "@/viewmodel/useNovaBarbeariaViewModel";
import { useProfissionaisBarbeariaViewModel } from "@/viewmodel/useProfissionaisBarbeariaViewModel";
import { useServicosBarbeariaViewModel } from "@/viewmodel/useServicosBarbeariaViewModel";

import { agir, authFalso } from "../helpers/authFalso";

const mockPush = jest.fn();
const mockDismissTo = jest.fn();
let mockParams: Record<string, string> = {};
jest.mock("expo-router", () => ({
  router: {
    push: (...a: unknown[]) => mockPush(...a),
    dismissTo: (...a: unknown[]) => mockDismissTo(...a),
    canGoBack: () => true,
    back: jest.fn(),
    replace: jest.fn(),
  },
  useLocalSearchParams: () => mockParams,
  useFocusEffect: (efeito: () => void) => require("react").useEffect(efeito, [efeito]),
}));
jest.mock("@/di/container", () => ({ ownerUseCases: {}, authUseCases: {}, imagePicker: {} }));

const BARBEARIA: Barbershop = { id: "b1", name: "Matriz", address: "Rua A, 1 - Centro", phone: "11955554444", avatarUrl: null };
const SEMANA: DayHours[] = [1, 2, 3, 4, 5, 6, 0].map((d) => ({ dayOfWeek: d, open: d !== 0, openTime: "09:00", closeTime: "19:00" }));

const donoFalso = (): jest.Mocked<IOwnerUseCases> => ({
  listMyBarbershops: jest.fn(async () => [{ barbershop: BARBEARIA, openNow: true }]),
  createBarbershop: jest.fn(async () => BARBEARIA),
  getBarbershopForm: jest.fn(async () => ({
    barbershop: BARBEARIA,
    form: { name: "Matriz", phone: "11955554444", cep: "", street: "Rua A", number: "1", complement: "", neighborhood: "Centro", city: "", state: "" },
  })),
  updateBarbershop: jest.fn(async () => ({ ...BARBEARIA, avatarUrl: "https://cdn/x.png" })),
  getWeekHours: jest.fn(async () => SEMANA),
  saveWeekHours: jest.fn(async () => undefined),
  listProfessionals: jest.fn(async () => []),
  addProfessional: jest.fn(async () => ({}) as never),
  updateProfessional: jest.fn(async () => ({}) as never),
  removeProfessional: jest.fn(async () => undefined),
  listServices: jest.fn(async () => []),
  addService: jest.fn(async () => ({}) as never),
  updateService: jest.fn(async () => ({}) as never),
});

const seletor = (): jest.Mocked<IImagePickerService> => ({
  pickImage: jest.fn(async () => ({ uri: "file:///logo.jpg", name: "logo.jpg", mimeType: "image/jpeg" })),
});

beforeEach(() => {
  mockPush.mockClear();
  mockDismissTo.mockClear();
  mockParams = {};
});

describe("telas do dono", () => {
  it("minhas barbearias carrega ao aparecer, abre uma e cria outra", async () => {
    const dono = donoFalso();
    const { result } = await renderHook(() => useMinhasBarbeariasViewModel(dono));
    await waitFor(() => expect(result.current[0].status).toBe("content"));
    await agir(() => result.current[1].open("b1"));
    await agir(() => result.current[1].create());
    expect(mockPush.mock.calls).toEqual([[{ pathname: "/minhas-barbearias/[id]", params: { id: "b1" } }], ["/minhas-barbearias/nova"]]);
  });

  it("nova barbearia envia o logo escolhido, atualiza os papéis e volta para a lista", async () => {
    const dono = donoFalso();
    const auth = authFalso();
    const picker = seletor();
    dono.createBarbershop.mockRejectedValueOnce(new ValidationError({ street: "Informe a rua." }));
    const { result } = await renderHook(() => useNovaBarbeariaViewModel(dono, auth, picker));
    await agir(() => result.current[1].pickLogo());
    await waitFor(() => expect(result.current[0].logoUri).toBe("file:///logo.jpg"));
    await agir(() => result.current[1].submit());
    await waitFor(() => expect(result.current[0].fieldErrors.street).toBe("Informe a rua."));
    await agir(() => result.current[1].submit());
    await waitFor(() => expect(mockDismissTo).toHaveBeenCalledWith("/minhas-barbearias"));
    expect(dono.createBarbershop).toHaveBeenLastCalledWith(expect.any(Object), expect.objectContaining({ uri: "file:///logo.jpg" }));
    expect(auth.refreshSession).toHaveBeenCalled();
  });

  it("editar mostra o telefone formatado, salva e o menu abre as telas de gestão", async () => {
    mockParams = { id: "b1" };
    const dono = donoFalso();
    const picker = seletor();
    const { result } = await renderHook(() => useEditarBarbeariaViewModel(dono, picker));
    await waitFor(() => expect(result.current[0].status).toBe("content"));
    expect(result.current[0].form.phone).toBe("(11) 95555-4444");
    await agir(() => result.current[1].save());
    await waitFor(() => expect(result.current[0].successMessage).toBe("Alterações salvas."));
    expect(result.current[0].logoUri).toBe("https://cdn/x.png");
    await agir(() => result.current[1].openHours());
    await agir(() => result.current[1].openServices());
    expect(mockPush.mock.calls.map((c) => (c[0] as { pathname: string }).pathname)).toEqual([
      "/minhas-barbearias/[id]/horarios",
      "/minhas-barbearias/[id]/servicos",
    ]);
  });

  it("horários: máscara HH:mm, erro por dia e salvar", async () => {
    expect(mascararHora("0930")).toBe("09:30");
    expect(mascararHora("9")).toBe("9");
    mockParams = { id: "b1" };
    const dono = donoFalso();
    dono.saveWeekHours.mockRejectedValueOnce(new ValidationError({ "1": "O fechamento precisa ser depois da abertura." }));
    const { result } = await renderHook(() => useHorariosBarbeariaViewModel(dono));
    await waitFor(() => expect(result.current[0].status).toBe("content"));
    expect(result.current[0].savedOpenDays).toEqual([1, 2, 3, 4, 5, 6]);
    await agir(() => result.current[1].setTime(1, "closeTime", "0800"));
    expect(result.current[0].week[0]?.closeTime).toBe("08:00");
    await agir(() => result.current[1].save());
    await waitFor(() => expect(result.current[0].dayErrors["1"]).toBe("O fechamento precisa ser depois da abertura."));
    await agir(() => result.current[1].setOpen(0, true));
    await agir(() => result.current[1].save());
    await waitFor(() => expect(result.current[0].successMessage).toBe("Horários salvos."));
    expect(result.current[0].savedOpenDays).toContain(0);
  });

  it("profissionais e serviços: abrir novo, salvar e recarregar a lista", async () => {
    mockParams = { id: "b1" };
    const dono = donoFalso();
    const { result: pro } = await renderHook(() => useProfissionaisBarbeariaViewModel(dono));
    await waitFor(() => expect(pro.current[0].status).toBe("content"));
    await agir(() => pro.current[1].openNew());
    expect(pro.current[0].editing).toBe("novo");
    await agir(() => pro.current[1].setField("name", "Junior"));
    await agir(() => pro.current[1].submit());
    await waitFor(() => expect(pro.current[0].editing).toBeNull());
    expect(dono.addProfessional).toHaveBeenCalledWith("b1", expect.objectContaining({ name: "Junior" }));
    expect(dono.listProfessionals).toHaveBeenCalledTimes(2);
    await agir(() => pro.current[1].askRemove("p9"));
    expect(pro.current[0].confirmingRemoveId).toBe("p9");
    await agir(() => pro.current[1].confirmRemove());
    await waitFor(() => expect(pro.current[0].confirmingRemoveId).toBeNull());
    expect(dono.removeProfessional).toHaveBeenCalledWith("b1", "p9");

    const { result: srv } = await renderHook(() => useServicosBarbeariaViewModel(dono));
    await waitFor(() => expect(srv.current[0].status).toBe("content"));
    await agir(() =>
      srv.current[1].openEdit({ id: "s1", barbershopId: "b1", name: "Corte", description: null, durationMinutes: 40, price: 50, imageUrl: null }),
    );
    expect(srv.current[0].form).toEqual({ name: "Corte", description: "", durationMinutes: "40", price: "50,00" });
    await agir(() => srv.current[1].submit());
    await waitFor(() => expect(dono.updateService).toHaveBeenCalledWith("b1", "s1", expect.objectContaining({ price: "50,00" }), null));
  });
});
