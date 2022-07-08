import { useCallback, useRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useLoadScript } from "@react-google-maps/api";
// components
import DeliveryMaps from "../../Forms/Order/DeliveryMaps";

interface MapDialogProps {
    open: boolean;
    handleClose: () => void;
    location: {
        lat: number;
        lng: number;
    };
}

const mapsKey = "AIzaSyA6GLJipum08T4ALZovBiwj3HMse1pZpXo";
type libray = "places" | "drawing" | "geometry" | "localContext" | "visualization";
const libraries: libray[] = ['places'];

function MapDialog({ open, location, handleClose }: MapDialogProps) {
    const mapRef = useRef<google.maps.Map>();
    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    const { isLoaded, loadError  } = useLoadScript({
        googleMapsApiKey: mapsKey,
        libraries
    })

  return (
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Recipient Location"}
        </DialogTitle>
        <DialogContent sx={{ width: 500 }}>
            <DeliveryMaps 
                isLoaded={isLoaded}
                loadError={loadError}
                location={{ ...location, address: '' }}
                onMapLoad={onMapLoad}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Okay
          </Button>
        </DialogActions>
    </Dialog>
  )
}

export default MapDialog