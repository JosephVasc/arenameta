'use client';

import { Box } from '@mui/material';
import Image from 'next/image';

export default function WoWLogo() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 200,
        height: 60,
        cursor: 'pointer',
        '&:hover': {
          opacity: 0.8,
        },
      }}
    >
      <Image
        src="/images/logo.png"
        alt="ArenaMeta.io"
        fill
        style={{ objectFit: 'contain' }}
        priority
      />
    </Box>
  );
} 