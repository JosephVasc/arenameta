'use client';

import { Box } from '@mui/material';
import Image from 'next/image';

export default function WoWLogo() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 120,
        height: 40,
        cursor: 'pointer',
        '&:hover': {
          opacity: 0.8,
        },
      }}
    >
      {/* <Image
        src=""
        alt="World of Warcraft: Mists of Pandaria"
        fill
        style={{ objectFit: 'contain' }}
        priority
      /> */}
    </Box>
  );
} 