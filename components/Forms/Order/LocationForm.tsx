import Stack from "@mui/material/Stack";
import Geocode from "react-geocode";
import { useLoadScript } from "@react-google-maps/api";
import { useCallback, useRef, useState } from "react";
import DeliveryMaps from "./DeliveryMaps";
import MapTextField from "./MapTextField";

type libray = "places" | "drawing" | "geometry" | "localContext" | "visualization"

const libraries: libray[] = ['places'];

type Location = {
    lat: number,
    lng: number,
    address: string
}

const mapsKey = "AIzaSyAldUF1vGdjNoM9lkFo8Z6XNzFfxHZonWE";

type LocationFormProps = {
    location: Location,
    changeLocation: (location: Location) => void
}

function LocationForm({ location, changeLocation }: LocationFormProps) {
    const [clickedLocation, setClickedLocation] = useState<string | null>(null);

    const mapRef = useRef<google.maps.Map>();
    const onMapLoad = useCallback((map: google.maps.Map) => {
      mapRef.current = map;
    }, []);

    const { isLoaded, loadError  } = useLoadScript({
        googleMapsApiKey: mapsKey,
        libraries
    })

    const panTo = useCallback(({ lat, lng }: { lat: number, lng: number }) => {
        if (mapRef.current != undefined) {
            mapRef.current.panTo({ lat, lng });
            mapRef.current.setZoom(18);
        }
    }, []);

    const handleLocationChange = (location: Location) => changeLocation(location);

    const handleMapClick = async (lat: number, lng: number) => {
        Geocode.setApiKey(mapsKey);
        Geocode.setLanguage("en");
        Geocode.fromLatLng(lat.toString(), lng.toString()).then(
            (response) => {
                const result = response.results[0].formatted_address;
                changeLocation({ lat: lat, lng: lng, address: result });
                setClickedLocation(result);
            },
                (error) => {
                    console.error(error);
                }
            );
    }
    
    return (
        <Stack direction="column" spacing={2}>
           {isLoaded && (
             <MapTextField 
                panTo={panTo} 
                setLocation={(location) => handleLocationChange(location)}
                clickedLocation={clickedLocation}
                location={location}
            />
           )}
            <DeliveryMaps 
                isLoaded={isLoaded}
                loadError={loadError}
                location={location}
                onMapLoad={onMapLoad}
                setLocation={handleMapClick}
            />
        </Stack>
    )
}

export default LocationForm