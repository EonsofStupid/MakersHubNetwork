import React from 'react';
import { motion } from 'framer-motion';
import { ListItem } from '../ListItem';
import { menuVariants } from '../animations';

export const PartsMenu = () => (
  <motion.ul
    variants={menuVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="grid w-[400px] gap-3 p-4 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl"
  >
    <ListItem href="/maker-space/parts" title="Browse Parts">
      Find the perfect parts for your 3D printer build or upgrade
    </ListItem>
    <ListItem href="/maker-space/parts/manufacturers" title="Manufacturers">
      Explore parts by manufacturer and brand
    </ListItem>
    <ListItem href="/maker-space/parts/compatibility" title="Compatibility Guide">
      Check part compatibility with your printer model
    </ListItem>
  </motion.ul>
);