"use client";

import { useEffect, useRef } from "react";
import type { TourismPoint, TourismType } from "@/lib/pontos-turisticos";

interface TourismMapProps {
  points: TourismPoint[];
  selectedPointId?: string | null;
  activeType: TourismType | "Todos";
}

export default function TourismMap({
  points,
  selectedPointId,
  activeType,
}: TourismMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerLayerRef = useRef<import("leaflet").LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    let cancelled = false;

    const setupMap = async () => {
      const L = await import("leaflet");
      if (cancelled || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
      }).setView([-22.4165, -42.9752], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      markerLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
    };

    setupMap();

    return () => {
      cancelled = true;
      markerLayerRef.current?.clearLayers();
      markerLayerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerLayerRef.current) return;

    const addMarkers = async () => {
      const L = await import("leaflet");
      markerLayerRef.current?.clearLayers();

      const pointsToShow =
        activeType === "Todos"
          ? points
          : points.filter((point) => point.type === activeType);

      pointsToShow.forEach((point) => {
        const marker = L.marker([point.lat, point.lng], {
          icon: L.divIcon({
            className: "custom-marker",
            html: `<div style="background:#d4621a;color:white;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:700;box-shadow:0 8px 18px -8px rgba(0,0,0,.7)">${point.type[0]}</div>`,
          }),
        });
        marker
          .addTo(markerLayerRef.current!)
          .bindPopup(
            `<strong>${point.name}</strong><br/><span style="font-size:12px">${point.address}</span>`,
          );
      });
    };

    addMarkers();
  }, [activeType, points]);

  useEffect(() => {
    if (!mapRef.current || !selectedPointId) return;
    const selected = points.find((point) => point.id === selectedPointId);
    if (!selected) return;
    mapRef.current.setView([selected.lat, selected.lng], 14, { animate: true });
  }, [points, selectedPointId]);

  return (
    <div
      ref={mapContainerRef}
      className="h-[420px] w-full rounded-2xl border border-black/10 dark:border-white/10"
      aria-label="Mapa interativo de pontos turísticos"
    />
  );
}
