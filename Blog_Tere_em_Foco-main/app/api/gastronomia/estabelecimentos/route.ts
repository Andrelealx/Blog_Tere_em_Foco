import { fail, ok } from "@/backforge/http";
import { tourismPoints } from "@/lib/pontos-turisticos";

export async function GET() {
  try {
    const estabelecimentos = tourismPoints.filter(
      (ponto) => ponto.type === "Gastronomia",
    );

    return ok(estabelecimentos);
  } catch {
    return fail("Não foi possível carregar os estabelecimentos gastronômicos.", 500);
  }
}
