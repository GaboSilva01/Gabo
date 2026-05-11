export type Product = {
  id: string;
  name: string;
  description: string;
  price: number; // interno: usado en el PDF, no se muestra en la UI
  category: string;
  unit: string;
  imageUrl: string;
  isSpecialOffer?: boolean;
  minOrder: number;
  customizable?: boolean; // false = oculta el botón "Personalizar"
};

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Cuñete de 19L",
    description: "Cuñete plástico resistente ideal para pinturas y químicos. Pedido mínimo de 500 unidades.",
    price: 4500,
    category: "Cuñetes",
    unit: "Unidad",
    imageUrl: "/cuñete 19L.png",
    isSpecialOffer: true,
    minOrder: 500,
  },
  {
    id: "2",
    name: "Vaso sobre copa",
    description: "Vasos de alta calidad modelo sobre copa. Pedido mínimo de 3500 unidades.",
    price: 1500,
    category: "Vasos",
    unit: "Unidad",
    imageUrl: "/vasos sobre de copa.png",
    isSpecialOffer: true,
    minOrder: 3500,
  },
  {
    id: "3",
    name: "Jeringa 5cc",
    description: "Jeringa plástica desechable de 5cc. Pedido mínimo según disponibilidad.",
    price: 800,
    category: "Jeringas",
    unit: "Unidad",
    imageUrl: "/jeringas 5cc.png",
    isSpecialOffer: true,
    minOrder: 1000,
    customizable: false,
  },
  {
    id: "4",
    name: "Tina Iraní 250g",
    description: "Tina plástica Iraní de 250g ideal para alimentos.",
    price: 1200,
    category: "Tinas",
    unit: "Unidad",
    imageUrl: "/Tina Irani 250g.png",
    isSpecialOffer: true,
    minOrder: 1000,
  },
  {
    id: "5",
    name: "Tina Iraní 500g",
    description: "Tina plástica Iraní de 500g ideal para alimentos.",
    price: 1800,
    category: "Tinas",
    unit: "Unidad",
    imageUrl: "/Tina Irani 500g.png",
    isSpecialOffer: true,
    minOrder: 1000,
  },
  {
    id: "6",
    name: "Envase Margarina 500g",
    description: "Envase especial para margarina de 500g.",
    price: 1500,
    category: "Envases",
    unit: "Unidad",
    imageUrl: "/Envase Margarina 500g.png",
    isSpecialOffer: true,
    minOrder: 1000,
  },
  {
    id: "7",
    name: "Tapas 28mm",
    description: "Tapas plásticas de 28mm para diversos envases.",
    price: 300,
    category: "Tapas",
    unit: "Unidad",
    imageUrl: "/Tapas 28mm.png",
    isSpecialOffer: true,
    minOrder: 5000,
  },
  {
    id: "8",
    name: "Cajetines",
    description: "Cajetines plásticos de uso eléctrico o construcción.",
    price: 900,
    category: "Cajetines",
    unit: "Unidad",
    imageUrl: "/Cajetines.png",
    isSpecialOffer: true,
    minOrder: 1000,
  },
  {
    id: "9",
    name: "Centro de Piso",
    description: "Centro de piso plástico resistente.",
    price: 1100,
    category: "Ferretería",
    unit: "Unidad",
    imageUrl: "/Centro de Piso.png",
    isSpecialOffer: true,
    minOrder: 1000,
    customizable: false,
  }
];
