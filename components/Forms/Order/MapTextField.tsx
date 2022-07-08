import React, { useEffect, useState } from 'react';
import { Box, TextField, Autocomplete } from '@mui/material';
import usePlacesAutocomplete, { getLatLng, getGeocode, getZipCode } from 'use-places-autocomplete';


type Location = {
    lat: number,
    lng: number,
    address: string
}

interface Props {
  panTo: ({ lat, lng }: {
    lat: number;
    lng: number;
  }) => void;
  setLocation: (location: Location) => void;
  clickedLocation: string | null;
  location: Location;
}

export default function ZoningToolbar({ panTo, setLocation, clickedLocation, location }: Props) {
  const {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions,
  } = usePlacesAutocomplete({
      requestOptions: {
          location: {
              lat: () => 14.657868,
              lng: () => 120.950761,
              equals: () => true,
              toJSON: () => ({ lat: 14.657868, lng: 120.950761 }),
              toUrlValue: () => 'address' 
          },
          radius: 100 * 1000
      }
  });

  useEffect(() => {
    if (clickedLocation) {
      setValue(clickedLocation);
    }
  }, [clickedLocation, setValue])

  const handleSelect = async (address: string | null) => {
    if (address != null) {
      setValue(address, false);
      clearSuggestions();

      try {
        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);

        panTo({ lat, lng });
        setLocation({ lat, lng, address });
      } catch (error) {
        console.log("Error: ", error);
      }
      }
  };

  return (
    <div>
        <Box sx={{ width: { xs: '100%', sm: 500, md: 600 } }}>
          <Autocomplete
            freeSolo
            value={value}
            onChange={(event: any, newValue: string | null) => {
              handleSelect(newValue);
            }}
            inputValue={value || location.address}
            onInputChange={(event, newInputValue) => {
              setValue(newInputValue);
            }}
            loading={!ready}
            options={status === "OK" ? data.map(res => res.description) : []}
            renderInput={(params) => 
              <TextField {...params} 
                fullWidth placeholder="House No. Street, Barangay..." 
                variant="outlined"
              />
            }
          />
      </Box>
    </div>
  );
}
