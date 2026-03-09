# Design System UI

## Componentes
- `Button`: variantes `primary`, `secondary`, `ghost`; tamanhos `sm`, `md`, `lg`.
- `Card`: contêiner base com `tone` (`default`, `elevated`, `muted`).
- `Badge`: selo para status e categorias.
- `Tag`: etiqueta compacta para temas e palavras-chave.
- `Avatar`: imagem circular com fallback de iniciais.
- `Skeleton`: placeholder para carregamento assíncrono.
- `Divider`: linha divisória horizontal.

## Exemplo rápido

```tsx
import { Badge, Button, Card, CardContent, CardTitle } from "@/components/ui";

export function Example() {
  return (
    <Card>
      <CardContent>
        <Badge intent="accent">Novo</Badge>
        <CardTitle>Terê em Foco</CardTitle>
        <Button intent="primary">Ler artigo</Button>
      </CardContent>
    </Card>
  );
}
```
