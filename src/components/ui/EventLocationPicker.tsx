"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  CircularProgress,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Search as SearchIcon, LocationOn as LocationOnIcon, MyLocation as MyLocationIcon } from "@mui/icons-material";
import axios from "axios";
import { useDebounce } from "@/lib/hooks/useDebounce";

// Fix Leaflet's default icon path issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationPickerProps {
  location?: { lat: number; lng: number; name?: string } | null;
  onChange?: (location: { lat: number; lng: number; name: string } | null) => void;
  readOnly?: boolean;
}

const DEFAULT_CENTER = { lat: 10.8505, lng: 76.2711 }; // Kerala default

const LocationMarker = ({ position, setPosition, readOnly }: any) => {
  const map = useMap();

  useMapEvents({
    click(e) {
      if (!readOnly && setPosition) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      }
    },
  });

  // Removed useEffect with map.flyTo to prevent zoom conflicts; 
  // flyTo is now handled by specific action handlers (click, search, locate).

  return position === null ? null : (
    <Marker
      position={position}
      draggable={!readOnly}
      eventHandlers={{
        dragend(e) {
          const marker = e.target;
          if (marker != null && setPosition) {
            setPosition(marker.getLatLng());
          }
        },
      }}
    ></Marker>
  );
};

export default function EventLocationPicker({ location, onChange, readOnly = false }: LocationPickerProps) {
  const mapRef = useRef<any>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    location && location.lat && location.lng ? { lat: location.lat, lng: location.lng } : null
  );
  
  const [searchQuery, setSearchQuery] = useState(location?.name || "");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const debouncedQuery = useDebounce(searchQuery, 800);

  // Handle prop changes for readonly view map
  useEffect(() => {
    if (readOnly && location && location.lat && location.lng) {
      setPosition({ lat: location.lat, lng: location.lng });
    }
  }, [location, readOnly]);

  // Search when typing
  useEffect(() => {
    if (readOnly) return;
    if (!debouncedQuery || debouncedQuery === location?.name) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const fetchPlaces = async () => {
      setIsSearching(true);
      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${debouncedQuery}`);
        setSearchResults(res.data);
        setShowDropdown(true);
      } catch (err) {
        console.error("Geocoding error", err);
      } finally {
        setIsSearching(false);
      }
    };
    fetchPlaces();
  }, [debouncedQuery, readOnly, location?.name]);

  // Reverse complete address on marker drop
  useEffect(() => {
    if (readOnly || !onChange) return;
    if (position && (!location || location.lat !== position.lat || location.lng !== position.lng)) {
      const getAddress = async () => {
        try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${position.lat}&lon=${position.lng}&format=json`);
          if (res.data && res.data.display_name) {
            console.log(res.data);
            const newName = res.data.display_name;
            setSearchQuery(newName);
            onChange({ lat: position.lat, lng: position.lng, name: newName });
          } else {
            onChange({ lat: position.lat, lng: position.lng, name: "" });
          }
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          onChange({ lat: position.lat, lng: position.lng, name: "" });
        }
      };
      getAddress();
    }
  }, [position, readOnly, location, onChange]);

  const handleSelectResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const newPos = { lat, lng };
    setPosition(newPos);
    setSearchQuery(result.display_name);
    setShowDropdown(false);
    mapRef.current?.flyTo(newPos, 15);
    if (onChange) {
      onChange({ lat, lng, name: result.display_name });
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation && !readOnly) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
        mapRef.current?.flyTo({ lat: latitude, lng: longitude }, 15);
      });
    }
  };

  return (
    <Box sx={{ width: "100%", position: "relative", zIndex: 500 }}>
      {!readOnly && (
        <Box sx={{ mb: 2, position: "relative", display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search for a location via Map..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) setShowDropdown(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowDropdown(false), 200);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: isSearching ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : null,
            }}
          />
          <Tooltip title="Use Current Location">
            <IconButton onClick={handleGetCurrentLocation} color="primary" sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
              <MyLocationIcon />
            </IconButton>
          </Tooltip>
          {showDropdown && searchResults.length > 0 && (
            <Paper
              elevation={4}
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                maxHeight: 250,
                overflow: "auto",
                zIndex: 9999,
                mt: 0.5,
              }}
            >
              <List disablePadding>
                {searchResults.map((res: any) => (
                  <ListItem disablePadding key={res.place_id}>
                    <ListItemButton onClick={() => handleSelectResult(res)}>
                      <LocationOnIcon sx={{ mr: 1, color: "text.secondary" }} fontSize="small" />
                      <ListItemText
                        primary={res.display_name}
                        primaryTypographyProps={{ variant: "body2" }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      )}

      <Box
        sx={{
          height: 300,
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          zIndex: 1,
        }}
      >
        <MapContainer
          ref={mapRef}
          center={position || DEFAULT_CENTER}
          zoom={position ? 15 : 7}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <LocationMarker position={position} setPosition={!readOnly ? setPosition : undefined} readOnly={readOnly} />
        </MapContainer>
      </Box>
    </Box>
  );
}
