# Upload de Imagem

Origem no sistema base: Componente Customizado. Situação: Novo. Motivo da adaptação: Necessidade específica de captura de fotos de perfil, barbearias e serviços.

## Quando usar

- No cadastro de barbearia (Logo e Fotos do local).
- Na edição de perfil do usuário (Avatar).
- No cadastro de novos serviços.

## Quando não usar

- Para exibir imagens estáticas que não podem ser alteradas.

## Anatomia

1. Área de Clique: (token `radius.md`, borda tracejada)
2. Ícone de Câmera/Galeria: (centralizado)
3. Preview da Imagem: (preenche a área após o upload)

## Variantes

| Variante | Uso | Dimensões |
| --- | --- | --- |
| Perfil | Foto circular do usuário | 96x96 dp |
| Banner | Logo ou foto da barbearia | 16:9 ou 4:3 |

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Vazio | Borda `color.outline` + Ícone | Abre galeria/câmera | `hint="Tocar para escolher foto"` |
| Carregando | Overlay de spinner | Processando imagem | - |
| Preenchido | Exibe a imagem selecionada | Permite trocar/remover | - |

## Acessibilidade

- Botão deve ter um rótulo descritivo (ex: "Alterar foto de perfil").
- Fornecer feedback visual e sonoro após o sucesso do upload.

## Faça e evite

- **Faça:** Mostre uma prévia da imagem antes de finalizar o envio.
- **Evite:** Aceitar arquivos muito pesados sem aviso ao usuário.

## Código

```tsx
import { TouchableOpacity, View, Image, Text } from 'react-native';
import { tokens } from '../../theme/tokens';
import { Ionicons } from '@expo/vector-icons';

export const ImageUpload = ({ imageUri, onPickImage }) => (
  <TouchableOpacity 
    onPress={onPickImage}
    style={{
      width: '100%',
      height: 180,
      borderRadius: tokens.radius.md,
      borderWidth: 1,
      borderColor: tokens.color.outline,
      borderStyle: 'dashed',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: tokens.color.surfaceContainerLow
    }}
  >
    {imageUri ? (
      <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%', borderRadius: tokens.radius.md }} />
    ) : (
      <View style={{ alignItems: 'center' }}>
        <Ionicons name="camera-outline" size={40} color={tokens.color.onSurfaceVariant} />
        <Text style={{ ...tokens.font.bodySmall, color: tokens.color.onSurfaceVariant }}>
          Adicionar foto
        </Text>
      </View>
    )}
  </TouchableOpacity>
);
```
