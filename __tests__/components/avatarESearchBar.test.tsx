import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { Avatar } from "@/view/components/avatar";
import { SearchBar } from "@/view/components/searchBar";
import { DesignSystemProvider } from "@/view/components/themeProvider";

const comTema = (ui: React.ReactElement) => render(<DesignSystemProvider mode="light">{ui}</DesignSystemProvider>);

describe("Avatar", () => {
  it("sem foto mostra a inicial e descreve a pessoa", async () => {
    await comTema(<Avatar name="zé tesoura" />);
    expect(screen.getByLabelText("Foto de zé tesoura")).toBeTruthy();
    expect(screen.getByText("Z")).toBeTruthy();
  });
});

describe("SearchBar", () => {
  it("digita e limpa a busca com um toque", async () => {
    const aoMudar = jest.fn();
    const { rerender } = await comTema(
      <SearchBar value="" onChangeText={aoMudar} placeholder="Buscar barbearia..." accessibilityLabel="Buscar barbearias" />,
    );
    expect(screen.queryByLabelText("Limpar busca")).toBeNull();
    await fireEvent.changeText(screen.getByLabelText("Buscar barbearias"), "central");
    expect(aoMudar).toHaveBeenCalledWith("central");

    await rerender(
      <DesignSystemProvider mode="light">
        <SearchBar value="central" onChangeText={aoMudar} placeholder="Buscar barbearia..." accessibilityLabel="Buscar barbearias" />
      </DesignSystemProvider>,
    );
    await fireEvent.press(screen.getByLabelText("Limpar busca"));
    expect(aoMudar).toHaveBeenLastCalledWith("");
  });
});
