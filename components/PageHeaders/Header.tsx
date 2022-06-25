import { Typography, Stack, IconButton, Tooltip } from '@mui/material';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { useRouter } from "next/router";

type PageHeaderProps = {
    title: string;
    subtitle: string;
    back?: boolean;
}

function PageHeader(props: PageHeaderProps) {
  const router = useRouter();
  return (
    <Stack direction="row" justifyContent={{ xs: "space-between", md: "flex-start" }} alignItems="center">
      {props.back && (
        <Tooltip arrow placement="top" title="Go back">
          <IconButton color="primary" sx={{ p: 2, mr: 2 }} onClick={() => router.back()}>
            <ArrowBackTwoToneIcon />
          </IconButton>
        </Tooltip>
      )}
      <Stack direction="column">
        <Typography variant="h3" component="h3" gutterBottom>
          {props.title}
        </Typography>
        <Typography variant="subtitle2">
          {props.subtitle}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default PageHeader;
