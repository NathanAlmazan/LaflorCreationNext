import {
  Box,
  Card,
  CardMedia,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import React from 'react';

const Input = styled('input')({
  display: 'none'
});

const CardCover = styled(Card)(
  ({ theme }) => `
    position: relative;

    .MuiCardMedia-root {
      height: ${theme.spacing(60)};
    }
`
);

const CardCoverAction = styled(Box)(
  ({ theme }) => `
    position: absolute;
    left: ${theme.spacing(2)};
    bottom: ${theme.spacing(2)};
`
);

type CoverCardProps = {
  imageSource?: string;
  imageLink?: string;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileCover = ({ imageLink, imageSource, handleImageChange }: CoverCardProps) => {

  return (
      <CardCover>
        <CardMedia image={imageSource ? imageSource : imageLink ? imageLink : "/images/logo.png"} />
        <CardCoverAction>
          <Input accept="image/*" id="change-cover" multiple type="file" onChange={handleImageChange} />
          <label htmlFor="change-cover">
            <Button
              startIcon={<UploadTwoToneIcon />}
              variant="contained"
              component="span"
            >
              {imageLink ? "Change Photo" : "Upload Photo"}
            </Button>
          </label>
        </CardCoverAction>
      </CardCover>
  );
};

export default ProfileCover;
