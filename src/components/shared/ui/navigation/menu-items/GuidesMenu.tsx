import React from 'react';
import { motion } from 'framer-motion';
import { ListItem } from '../ListItem';
import { menuVariants } from '../animations';

export const GuidesMenu = () => (
  <motion.ul
    variants={menuVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="grid w-[400px] gap-3 p-4 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl"
  >
    <ListItem href="/maker-space/guides/getting-started" title="Getting Started">
      Essential guides for beginners in 3D printing
    </ListItem>
    <ListItem href="/maker-space/guides/advanced" title="Advanced Tutorials">
      Deep dive into advanced techniques and modifications
    </ListItem>
    <ListItem href="/maker-space/guides/troubleshooting" title="Troubleshooting">
      Solutions to common problems and maintenance guides
    </ListItem>
  </motion.ul>
);