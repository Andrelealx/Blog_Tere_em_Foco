"use client";

import React, { useState } from 'react';

const lazerItems = [
  {
    id: 1,
    title: "Parque Nacional da Serra dos Órgãos (PARNASO)",
    category: "Ecoturismo & Aventura",
    description: "O terceiro parque nacional mais antigo do Brasil. Abriga o cartão-postal da cidade, o Dedo de Deus, além de diversas cachoeiras, piscinas naturais e a famosa Travessia Petrópolis-Teresópolis.",
    schedule: "Aberto diariamente, das 8h às 17h.",
    location: "Avenida Rotariana, s/n - Soberbo",
    tags: ["Trilhas", "Cachoeiras", "Mirantes"],
    images: [
      "https://turismo.teresopolis.rj.gov.br/wp-content/uploads/2022/10/Cartao-Postal_CAPA-Foto-Gutto-Rodrigues.jpeg",
      "https://turismo.teresopolis.rj.gov.br/wp-content/uploads/2025/11/roteiro_parque_1.jpg",
      "https://turismo.teresopolis.rj.gov.br/wp-content/uploads/2022/10/Copia-de-Trilha-suspensa-parnaso.png"
    ]
  },
  {
    id: 2,
    title: "Feirinha do Alto",
    category: "Cultura & Compras",
    description: "Um dos pontos turísticos mais tradicionais da Serra Fluminense. São mais de 600 barracas oferecendo moda (especialmente tricô e couro), artesanato local e uma praça de alimentação irresistível.",
    schedule: "Sábados, Domingos e Feriados, das 10h às 18h.",
    location: "Praça Higino da Silveira - Bairro do Alto",
    tags: ["Artesanato", "Gastronomia", "Moda"],
    images: [
      "https://www.portaltere.com/230522feira_placa.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShNSyVnSA2K4ENe1fv7avteJfQMmnwqCEevg&s",
      "https://upload.wikimedia.org/wikipedia/commons/f/f8/Feirinha_do_Alto%2C_Teres%C3%B3polis.JPG"
    ]
  },
  {
    id: 3,
    title: "Mirante do Soberbo",
    category: "Contemplação",
    description: "A porta de entrada da cidade oferece uma das vistas mais espetaculares do estado. Em dias claros, é possível admirar a imponência do pico Dedo de Deus e a Baía de Guanabara.",
    schedule: "Acesso livre 24 horas. Melhor horário: Pôr do sol.",
    location: "BR-116, km 89 - Entrada da Cidade",
    tags: ["Cartão-Postal", "Fotografia", "Gratuito"],
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/1/14/Mirante_do_Soberbo_-_Guapimirim.jpg",
      "https://odia.ig.com.br/_midias/jpg/2021/11/26/385x420/1_mirante_do_soberbo_guapimirim_ok-23669255.jpeg",
      "https://i.ytimg.com/vi/HSdpYyiW3js/sddefault.jpg"
    ]
  },
  {
    id: 4,
    title: "Vila St. Gallen",
    category: "Gastronomia & Lazer",
    description: "Um pedacinho da Alemanha em Teresópolis. A vila reproduz uma charmosa cidade bávara, oferecendo uma imersão cultural através da gastronomia europeia e cervejas artesanais.",
    schedule: "Quarta a Domingo (horários variam).",
    location: "Rua Augusto do Amaral Peixoto, 166 - Alto",
    tags: ["Cervejaria", "Restaurantes", "Arquitetura"],
    images: [
      "http://lavaiapaty.com.br/wp-content/uploads/2017/09/vila_st_gallen16-768x576.jpg",
      "http://lavaiapaty.com.br/wp-content/uploads/2017/09/vila_st_gallen17.jpg",
      "http://lavaiapaty.com.br/wp-content/uploads/2017/09/Vila_st_gallen_00.jpg"
    ]
  },
  {
    id: 5,
    title: "Lago da Granja Comary",
    category: "Passeio em Família",
    description: "Localizado em um bairro nobre, o lago oferece uma vista privilegiada para as montanhas e abriga o Centro de Treinamento da Seleção Brasileira de Futebol (CBF).",
    schedule: "Acesso diurno liberado para pedestres.",
    location: "Bairro Carlos Guinle",
    tags: ["Natureza", "Caminhada", "CBF"],
    images: [
      "https://turismo.teresopolis.rj.gov.br/wp-content/uploads/2022/10/IMG_7525.jpg",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/91/c2/84/caption.jpg?w=900&h=500&s=1",
      "https://pousadaoasisteresopolis.com.br/wp-content/uploads/2021/03/granja-8.jpg"
    ]
  }
];

function ImageGallery({ images, category }: { images: string[], category: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative h-64 overflow-hidden bg-[#051b11] group/gallery">
      <img
        src={images[currentIndex]}
        alt="Foto do local"
        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
      />
      
      <div className="absolute top-4 left-4 bg-[#051b11]/80 backdrop-blur-sm px-3 py-1 rounded-full border border-green-900/50 z-10">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
          {category}
        </span>
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-orange-600 text-white w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover/gallery:opacity-100 transition-all z-10"
          >
            &#10094;
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-orange-600 text-white w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover/gallery:opacity-100 transition-all z-10"
          >
            &#10095;
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'w-4 bg-orange-500' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function LazerPage() {
  return (
    <main className="min-h-screen bg-[#051b11] py-16 w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="mb-16 border-b border-green-900/50 pb-10">
          <span className="text-orange-500 font-semibold tracking-wider uppercase text-sm mb-3 block">
            Descubra Teresópolis
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-stone-100 mb-6">
            Lazer e Entretenimento
          </h1>
          <p className="text-stone-300 text-lg max-w-3xl leading-relaxed">
            De trilhas desafiadoras e vistas de tirar o fôlego a passeios culturais tranquilos em família. 
            Explore as melhores atrações turísticas e opções de lazer que a Serra Fluminense tem a oferecer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lazerItems.map((item) => (
            <article key={item.id} className="group cursor-pointer flex flex-col bg-[#0a2b1b] border border-white/5 rounded-2xl overflow-hidden hover:border-green-600/30 transition-all duration-300 shadow-2xl shadow-black/50 hover:-translate-y-1">
              
              <ImageGallery images={item.images} category={item.category} />
              
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-2xl font-serif text-stone-100 mb-3 group-hover:text-orange-400 transition-colors">
                  {item.title}
                </h2>
                
                <p className="text-stone-300 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="space-y-3 mt-auto mb-6">
                  <div className="flex items-start gap-3 text-stone-300 text-sm">
                    <svg className="w-5 h-5 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{item.location}</span>
                  </div>
                  
                  <div className="flex items-start gap-3 text-stone-300 text-sm">
                    <svg className="w-5 h-5 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{item.schedule}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-5 border-t border-green-900/40">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-xs px-3 py-1 rounded-full bg-[#051b11]/80 text-stone-300 border border-green-800/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </main>
  );
}