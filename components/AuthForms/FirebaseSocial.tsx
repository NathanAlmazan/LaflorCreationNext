import Image from "next/image";
// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Button, Stack } from '@mui/material';
// assets
import Google from '../../assets/google.svg';
import Facebook from '../../assets/facebook.svg';
import { ApolloCache, DefaultContext, MutationFunctionOptions } from "@apollo/client";
import { Client, ClientVars } from "../../apollo/clients";
//firebase
import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { firebaseAuth } from "../../config/firebase/client";
// ==============================|| FIREBASE - SOCIAL BUTTON ||============================== //

type FirebaseSocialProps = {
    createClient?: (options?: MutationFunctionOptions<{
        createClient: Client;
    }, {
        client: ClientVars;
    }, DefaultContext, ApolloCache<any>> | undefined) => Promise<any>
}

const FirebaseSocial = ({ createClient }: FirebaseSocialProps) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

    const googleHandler = async () => {
        signInWithPopup(firebaseAuth, new GoogleAuthProvider()).then(result => {
            if (createClient) {
                const user = result.user;
                const contact = user.phoneNumber ? user.phoneNumber : "99999999999";
                const name = user.displayName ? user.displayName : "none";
                createClient({
                    variables: { client: {
                        accountUid: user.uid,
                        clientContact: contact,
                        clientName: name
                    }}
                });
            }
        })
    };

    const facebookHandler = async () => {
        signInWithPopup(firebaseAuth, new FacebookAuthProvider()).then(result => {
            if (createClient) {
                const user = result.user;
                const contact = user.phoneNumber ? user.phoneNumber : "99999999999";
                const name = user.displayName ? user.displayName : "none";
                createClient({
                    variables: { client: {
                        accountUid: user.uid,
                        clientContact: contact,
                        clientName: name
                    }}
                });
            }
        })
    };

    return (
        <Stack
            direction="row"
            spacing={matchDownSM ? 1 : 2}
            justifyContent={matchDownSM ? 'space-around' : 'space-between'}
            sx={{ '& .MuiButton-startIcon': { mr: matchDownSM ? 0 : 1, ml: matchDownSM ? 0 : -0.5 } }}
        >
            <Button
                variant="outlined"
                color="secondary"
                fullWidth
                startIcon={<Image src={Google} alt="Google" />}
                onClick={googleHandler}
            >
                {!matchDownSM && 'Google'}
            </Button>
            <Button
                variant="outlined"
                color="secondary"
                fullWidth
                startIcon={<Image src={Facebook} alt="Facebook" />}
                onClick={facebookHandler}
            >
                {!matchDownSM && 'Facebook'}
            </Button>
        </Stack>
    );
};

export default FirebaseSocial;