import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { PILOT_COORDS, CATEGORY_CONFIG } from '../../../lib/constants.js';
import { UserLocationIconHtml } from './UserLocation.jsx';

/**
 * MapView Component
 * Full-bleed Leaflet map with custom "Loo & Chhaon" markers, drop-in animations, and live user pulse.
 *
 * @param {Object} props
 * @param {Array} props.spots
 * @param {Object} [props.selectedSpot]
 * @param {Function} [props.onSelectSpot]
 * @param {Object} [props.userCoords]
 */
export const MapView = ({
  spots = [],
  selectedSpot = null,
  onSelectSpot = () => {},
  userCoords = { lat: PILOT_COORDS.LAT, lng: PILOT_COORDS.LNG }
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  // Category hex map
  const categoryHex = {
    water: '#0F6FA8',
    shade: '#1E7B4F',
    rest: '#D9941A'
  };

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = userCoords?.lat || PILOT_COORDS.LAT;
    const initialLng = userCoords?.lng || PILOT_COORDS.LNG;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: PILOT_COORDS.ZOOM,
      zoomControl: false,
      attributionControl: false
    });

    // Clean OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c']
    }).addTo(map);

    // Zoom control in bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    // Staged size invalidation
    const t1 = setTimeout(() => map.invalidateSize(), 50);
    const t2 = setTimeout(() => map.invalidateSize(), 250);
    const t3 = setTimeout(() => map.invalidateSize(), 600);

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    let ro = null;
    if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
      ro = new ResizeObserver(() => {
        map.invalidateSize();
      });
      ro.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('resize', handleResize);
      if (ro) ro.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update User Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userCoords) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
    } else {
      const userIcon = L.divIcon({
        html: UserLocationIconHtml,
        className: 'user-pulse-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], {
        icon: userIcon,
        zIndexOffset: 1000
      }).addTo(map);
    }

    map.flyTo([userCoords.lat, userCoords.lng], map.getZoom() || 15, {
      animate: true,
      duration: 0.8
    });
  }, [userCoords]);

  // Update Relief Spots Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    spots.forEach((spot, index) => {
      const config = CATEGORY_CONFIG[spot.category] || CATEGORY_CONFIG.water;
      const isSelected = selectedSpot && selectedSpot.id === spot.id;
      const delayMs = Math.min(index * 35, 400);

      // Loo & Chhaon status ring colors
      let ringColor = '#1E7B4F'; // Verified / High trust (chhaon)
      if (spot.trustScore < 40) ringColor = '#D4412A'; // Low trust / unverified (loo)
      else if (spot.trustScore < 70) ringColor = '#D9941A'; // Moderate trust (aaram)

      const spotColor = categoryHex[spot.category] || '#0F6FA8';

      const iconHtml = `
        <div style="
          animation: dropIn 350ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms both;
          width: 38px;
          height: 38px;
          border-radius: 999px;
          background: ${isSelected ? '#0F6FA8' : '#FFFFFF'};
          color: ${isSelected ? '#FFFFFF' : spotColor};
          border: 2.5px solid ${ringColor};
          box-shadow: 0 4px 12px rgba(27, 36, 33, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          cursor: pointer;
          transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
        ">
          <i class="fa-solid ${config.icon}"></i>
        </div>
      `;

      const markerIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-spot-marker',
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      const marker = L.marker([spot.location.lat, spot.location.lng], {
        icon: markerIcon
      }).addTo(map);

      marker.on('click', () => {
        onSelectSpot(spot);
        map.panTo([spot.location.lat, spot.location.lng], {
          animate: true,
          duration: 0.4
        });
      });

      markersRef.current.push(marker);
    });
  }, [spots, selectedSpot, onSelectSpot]);

  return (
    <div className="relative w-full h-full min-h-[350px] flex-1">
      {/* Map canvas */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px] z-0" style={{ height: '100%', width: '100%' }} />

      {/* Embedded drop-in animation keyframe for markers */}
      <style>{`
        @keyframes dropIn {
          0% {
            opacity: 0;
            transform: scale(0.6) translateY(-14px);
          }
          70% {
            transform: scale(1.08) translateY(2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default MapView;
