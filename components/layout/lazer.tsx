export default function Lazer() {
  return (
    <div className="max-w-6xl mx-auto p-8">

      <h1 className="text-4xl font-bold text-center mb-6">
        Lazer em Teresópolis
      </h1>

      <p className="text-center mb-10 text-lg">
        Conheça algumas opções de lazer na cidade de Teresópolis.
      </p>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">
            🌄 Parque Nacional da Serra dos Órgãos
          </h2>
          <p>
            Um dos pontos turísticos mais famosos da cidade, ideal para trilhas
            e contato com a natureza.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">
            🛍️ Feirarte
          </h2>
          <p>
            A tradicional feirinha do Alto reúne artesanato, comida e música
            aos finais de semana.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">
            🍽️ Restaurantes
          </h2>
          <p>
            A cidade possui diversas opções gastronômicas para moradores e
            turistas.
          </p>
        </div>

      </div>

    </div>
  );
}