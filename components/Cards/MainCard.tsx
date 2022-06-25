import React from 'react';
import { SxProps, useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Divider, Theme, Typography } from '@mui/material';

type MainCardProps = {
    border?: boolean,
    boxShadow?: boolean,
    children: React.ReactNode,
    content?: boolean,
    contentSX?: SxProps<Theme>,
    darkTitle?: boolean,
    divider?: boolean,
    elevation?: number,
    secondary?: React.ReactNode,
    shadow?: string,
    sx?: SxProps<Theme>,
    headerSX?: SxProps<Theme>,
    title?: string,
}

const MainCard = React.forwardRef<HTMLDivElement, MainCardProps>((props, ref) => {
  const {
    border = true,
    boxShadow,
    children,
    content = true,
    contentSX = {},
    darkTitle,
    divider = true,
    elevation,
    secondary,
    shadow,
    sx = {},
    title,
    headerSX
  } = props;
  const theme = useTheme();

  return (
    <Card
        elevation={elevation || 0}
        ref={ref}
        sx={{
            ...sx,
            border: border ? '1px solid' : 'none',
            borderRadius: 2,
            borderColor: theme.palette.mode === 'dark' ? theme.palette.divider : theme.palette.grey[700],
            boxShadow: boxShadow && (!border || theme.palette.mode === 'dark') ? shadow || theme.shadows[15] : 'inherit',
            ':hover': {
                boxShadow: boxShadow ? shadow || theme.shadows[15] : 'inherit'
            },
            '& pre': {
                m: 0,
                p: '16px !important',
                fontFamily: theme.typography.fontFamily,
                fontSize: '0.75rem'
            }
        }}
    >
        {/* card header and action */}
        {!darkTitle && title && (
            <CardHeader sx={headerSX} titleTypographyProps={{ variant: 'subtitle1' }} title={title} action={secondary} />
        )}
        {darkTitle && title && (
            <CardHeader sx={headerSX} title={<Typography variant="h3">{title}</Typography>} action={secondary} />
        )}

        {/* content & header divider */}
        {title && divider && <Divider />}

        {/* card content */}
        {content && <CardContent sx={contentSX}>{children}</CardContent>}
        {!content && children}
    </Card>
  )
});

MainCard.displayName = "MainCard";

export default MainCard