import React from 'react';
import { motion } from 'framer-motion';
import { ListItem } from '../ListItem';
import { menuVariants } from '../animations';

export const BuildsMenu = () => (
  <motion.ul
    variants={menuVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="grid w-[400px] gap-3 p-4 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-[#8000ff]/5"
  >
    <ListItem href="/maker-space/builds" title="Featured Builds">
      Explore our curated collection of outstanding 3D printer builds
    </ListItem>
    <ListItem href="/maker-space/builds/latest" title="Latest Builds">
      Check out the newest community builds and modifications
    </ListItem>
    <ListItem href="/maker-space/builds/categories" title="Build Categories">
      Browse builds by printer type, modification type, or purpose
    </ListItem>
  </motion.ul>
);