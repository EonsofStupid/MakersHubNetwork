
import { atom } from 'jotai';
import { FeatureItemProps, BuildItem } from '../types';

// Hero section state
export const heroAnimationActiveAtom = atom<boolean>(false);
export const heroHoveredButtonAtom = atom<string | null>(null);

// Features section state
export const featuresAtom = atom<FeatureItemProps[]>([
  {
    type: "database",
    title: "3D Printer Database",
    description: "Access our comprehensive database of 3D printer builds, parts, and specifications.",
    ctaText: "Explore Database",
    ctaLink: "/database"
  },
  {
    type: "forum",
    title: "Maker Forums",
    description: "Join discussions with fellow makers, share your knowledge, and get help with your builds.",
    ctaText: "Join Forums",
    ctaLink: "/forums"
  },
  {
    type: "chat",
    title: "Live Chat",
    description: "Get real-time advice and connect with makers around the world through our chat platform.",
    ctaText: "Start Chatting",
    ctaLink: "/chat"
  }
]);

// Featured builds state
export const featuredBuildsAtom = atom<BuildItem[]>([
  {
    id: "build-1",
    title: "Ender 3 V2 Dual Z-Axis Mod",
    creator: "PrintMaster3000",
    imageUrl: "https://images.unsplash.com/photo-1615412704911-55ca9cffdca9?q=80&w=640",
    category: "Modification",
    likes: 342,
    views: 1245
  },
  {
    id: "build-2",
    title: "Prusa i3 MK3S+ Enclosure",
    creator: "3DCreator",
    imageUrl: "https://images.unsplash.com/photo-1611117775350-ac3950990985?q=80&w=640",
    category: "Enclosure",
    likes: 278,
    views: 982
  },
  {
    id: "build-3",
    title: "CR-10 Direct Drive Conversion",
    creator: "PrintingPro",
    imageUrl: "https://images.unsplash.com/photo-1593106410886-d48cb1a7a47f?q=80&w=640",
    category: "Upgrade",
    likes: 412,
    views: 1567
  },
  {
    id: "build-4",
    title: "Voron 2.4 Full Build",
    creator: "VoronEnthusiast",
    imageUrl: "https://images.unsplash.com/photo-1612282131293-37332d3cea00?q=80&w=640",
    category: "Complete Build",
    likes: 587,
    views: 2143
  }
]);

// Component state for each build card
export const buildCardHoverAtom = atom<Record<string, boolean>>({});
