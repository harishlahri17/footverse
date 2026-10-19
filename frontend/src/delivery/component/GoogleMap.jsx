import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';

const GoogleMap = ({ 
  deliveryManLocation = null, 
  customerLocation = null,
  showRoute = true,
  height = '400px',
  width = '100%',
  orderId = null
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const customerMarkerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { socket, joinOrderRoom, leaveOrderRoom } = useSocket();

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
      script.async = true;
      script.onload = () => setIsLoaded(true);
      script.onerror = () => console.error('Failed to load Google Maps API');
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: deliveryManLocation || { lat: 21.2514, lng: 81.6296 }, // Default to Raipur
      zoom: 13,
      mapTypeId: 'roadmap',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    mapInstanceRef.current = map;
  }, [isLoaded, deliveryManLocation]);

  // Join order room for live tracking
  useEffect(() => {
    if (orderId && socket) {
      joinOrderRoom(orderId);

      // Listen for location updates
      socket.on('location_broadcast', (data) => {
        if (data.latitude && data.longitude) {
          updateDeliveryBoyMarker({ lat: data.latitude, lng: data.longitude });
        }
      });

      return () => {
        leaveOrderRoom(orderId);
        socket.off('location_broadcast');
      };
    }
  }, [orderId, socket, joinOrderRoom, leaveOrderRoom]);

  // Update delivery boy marker
  const updateDeliveryBoyMarker = (location) => {
    if (!mapInstanceRef.current) return;

    if (markerRef.current) {
      markerRef.current.setPosition(location);
    } else {
      markerRef.current = new window.google.maps.Marker({
        position: location,
        map: mapInstanceRef.current,
        title: 'Delivery Boy',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2
        }
      });
    }

    // Center map on delivery boy
    mapInstanceRef.current.panTo(location);
  };

  // Update delivery boy location when prop changes
  useEffect(() => {
    if (deliveryManLocation && isLoaded) {
      updateDeliveryBoyMarker(deliveryManLocation);
    }
  }, [deliveryManLocation, isLoaded]);

  // Add customer marker
  useEffect(() => {
    if (customerLocation && isLoaded && mapInstanceRef.current) {
      if (customerMarkerRef.current) {
        customerMarkerRef.current.setPosition(customerLocation);
      } else {
        customerMarkerRef.current = new window.google.maps.Marker({
          position: customerLocation,
          map: mapInstanceRef.current,
          title: 'Customer Location',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#EA4335',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2
          }
        });
      }

      // Draw route if both locations are available
      if (deliveryManLocation && showRoute) {
        drawRoute(deliveryManLocation, customerLocation);
      }
    }
  }, [customerLocation, isLoaded, deliveryManLocation, showRoute]);

  // Draw route between two points
  const drawRoute = (origin, destination) => {
    if (!window.google || !mapInstanceRef.current) return;

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map: mapInstanceRef.current,
      polylineOptions: {
        strokeColor: '#4285F4',
        strokeWeight: 4
      }
    });

    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
        }
      }
    );
  };

  // Fit bounds to show both markers
  useEffect(() => {
    if (deliveryManLocation && customerLocation && isLoaded && mapInstanceRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(deliveryManLocation);
      bounds.extend(customerLocation);
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [deliveryManLocation, customerLocation, isLoaded]);

  return (
    <div 
      ref={mapRef} 
      style={{ height, width, borderRadius: '8px', overflow: 'hidden' }}
    >
      {!isLoaded && (
        <div 
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            color: '#666'
          }}
        >
          Loading Map...
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
