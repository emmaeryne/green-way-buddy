import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MapProps {
  parkingSpots: any[];
  chargingStations: any[];
  electricVehicles: any[];
  revisionSpaces: any[];
}

const Map = ({ parkingSpots, chargingStations, electricVehicles, revisionSpaces }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  const handleConfigureKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('mapbox_token', apiKey);
      setIsConfigured(true);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setApiKey(savedToken);
      setIsConfigured(true);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !isConfigured || !apiKey) return;

    // Initialize map
    mapboxgl.accessToken = apiKey;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.3522, 48.8566], // Paris par défaut
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add markers for parking spots
    parkingSpots.forEach((spot) => {
      if (spot.latitude && spot.longitude) {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundColor = '#1e40af'; // Navy blue
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.border = '3px solid white';
        el.style.cursor = 'pointer';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

        new mapboxgl.Marker(el)
          .setLngLat([spot.longitude, spot.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(
                `<div style="padding: 8px;">
                  <h3 style="font-weight: bold; margin-bottom: 4px; color: #1e40af;">🅿️ ${spot.name}</h3>
                  <p style="font-size: 14px; color: #666;">${spot.description || 'Place de parking'}</p>
                </div>`
              )
          )
          .addTo(map.current!);
      }
    });

    // Add markers for charging stations
    chargingStations.forEach((station) => {
      if (station.latitude && station.longitude) {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundColor = '#10b981'; // Green
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.border = '3px solid white';
        el.style.cursor = 'pointer';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

        new mapboxgl.Marker(el)
          .setLngLat([station.longitude, station.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(
                `<div style="padding: 8px;">
                  <h3 style="font-weight: bold; margin-bottom: 4px; color: #10b981;">⚡ ${station.name}</h3>
                  <p style="font-size: 14px; color: #666;">${station.description || 'Borne de recharge'}</p>
                  <p style="font-size: 12px; color: #666; margin-top: 4px;">Puissance: ${station.power_kw || 'N/A'} kW</p>
                </div>`
              )
          )
          .addTo(map.current!);
      }
    });

    // Add markers for electric vehicles
    electricVehicles.forEach((vehicle) => {
      if (vehicle.latitude && vehicle.longitude) {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundColor = '#f59e0b'; // Orange
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.border = '3px solid white';
        el.style.cursor = 'pointer';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

        new mapboxgl.Marker(el)
          .setLngLat([vehicle.longitude, vehicle.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(
                `<div style="padding: 8px;">
                  <h3 style="font-weight: bold; margin-bottom: 4px; color: #f59e0b;">🚗 ${vehicle.name}</h3>
                  <p style="font-size: 14px; color: #666;">${vehicle.model}</p>
                  <p style="font-size: 12px; color: #666; margin-top: 4px;">Autonomie: ${vehicle.range_km || 'N/A'} km</p>
                </div>`
              )
          )
          .addTo(map.current!);
      }
    });

    // Add markers for revision spaces
    revisionSpaces.forEach((space) => {
      if (space.latitude && space.longitude) {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundColor = '#8b5cf6'; // Purple
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.border = '3px solid white';
        el.style.cursor = 'pointer';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

        new mapboxgl.Marker(el)
          .setLngLat([space.longitude, space.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(
                `<div style="padding: 8px;">
                  <h3 style="font-weight: bold; margin-bottom: 4px; color: #8b5cf6;">📚 ${space.name}</h3>
                  <p style="font-size: 14px; color: #666;">${space.description || 'Espace de révision'}</p>
                  <p style="font-size: 12px; color: #666; margin-top: 4px;">Capacité: ${space.capacity || 'N/A'} places</p>
                </div>`
              )
          )
          .addTo(map.current!);
      }
    });

    // Fit map to show all markers
    const allLocations = [
      ...parkingSpots,
      ...chargingStations,
      ...electricVehicles,
      ...revisionSpaces,
    ].filter((item) => item.latitude && item.longitude);

    if (allLocations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      allLocations.forEach((item) => {
        bounds.extend([item.longitude, item.latitude]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [parkingSpots, chargingStations, electricVehicles, revisionSpaces, isConfigured, apiKey]);

  if (!isConfigured) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Configuration Mapbox requise</CardTitle>
          <CardDescription>
            Veuillez entrer votre clé publique Mapbox pour afficher la carte.
            Vous pouvez obtenir votre clé sur{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="pk.eyJ1Ijo..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Button onClick={handleConfigureKey} className="w-full">
            Configurer
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border border-border">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border">
        <div className="text-sm font-medium mb-2">Légende</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#1e40af] border-2 border-white"></div>
            <span>Parking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10b981] border-2 border-white"></div>
            <span>Borne de recharge</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b] border-2 border-white"></div>
            <span>Véhicule électrique</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#8b5cf6] border-2 border-white"></div>
            <span>Espace révision</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
