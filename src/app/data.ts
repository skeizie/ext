export interface ChromeExtension {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  screenshots: string[];
  price: string;
  installCount: string;
  rating: number;
  url: string;
  features: string[];
}

export const extensions: ChromeExtension[] = [
  {
    id: "rehistoria",
    name: "Rehistoria",
    tagline: "The ultimate night eye for your browser.",
    description: "Dark Mode Pro automatically turns every website into a beautiful dark theme, saving your eyes and your battery. Custom contrast and brightness settings included.",
    icon: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=128&h=128&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1575388902449-6bca946ad549?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop"
    ],
    price: "Free",
    installCount: "800+",
    rating: 4.6,
    url: "#",
    features: [
      "Custom dark themes for every site",
      "Brightness & Contrast control",
      "Scheduling (Auto-dark at night)",
      "Sync across all your devices"
    ]
  },
  {
    id: "bys",
    name: "BYS",
    tagline: "The ultimate night eye for your browser.",
    description: "Better YouTube Screenshot. Dark Mode Pro automatically turns every website into a beautiful dark theme, saving your eyes and your battery. Custom contrast and brightness settings included.",
    icon: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=128&h=128&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1575388902449-6bca946ad549?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop"
    ],
    price: "Freemium",
    installCount: "~100",
    rating: 5,
    url: "#",
    features: [
      "Custom dark themes for every site",
      "Brightness & Contrast control",
      "Scheduling (Auto-dark at night)",
      "Sync across all your devices"
    ]
  },
  {
    id: "repinia",
    name: "Repinia",
    tagline: "Stay focused by managing your tabs intelligently.",
    description: "FocusTab helps you reduce distractions by grouping inactive tabs and providing a beautiful dashboard to manage your workflow.",
    icon: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=128&h=128&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1753998943228-73470750c597?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504868584819-f8e905263543?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop"
    ],
    price: "Free",
    installCount: "~100",
    rating: 5,
    url: "#",
    features: [
      "Automatic tab grouping",
      "Deep focus mode (blocks distracting sites)",
      "Daily productivity statistics",
      "Customizable new tab page"
    ]
  },
  {
    id: "chatgptrtl",
    name: "ChatGPT RTL",
    tagline: "Pick colors from any pixel on your screen.",
    description: "A professional-grade color picker for designers and developers. Get HEX, RGB, HSL codes instantly and save palettes to your account.",
    icon: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=128&h=128&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1716471330459-063b3baf247e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=1200&auto=format&fit=crop"
    ],
    price: "Free",
    installCount: "~100",
    rating: 5,
    url: "#",
    features: [
      "Precision magnifying glass",
      "Color history palette",
      "Export to CSS, SASS, and Figma",
      "Auto-detect webpage color scheme"
    ]
  }
];
