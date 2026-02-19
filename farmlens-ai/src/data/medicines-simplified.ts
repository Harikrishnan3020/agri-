/**
 * Scraped Plant Medicines from Flipkart
 * Auto-generated on 19/2/2026, 10:51:29 am
 * Total products: 6
 */

export interface FlipkartMedicine {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviews: string;
  image?: string | null;
  link?: string | null;
  source: string;
  inStock: boolean;
  category: string;
  scrapedAt: string;
}

export const scrapedMedicines: FlipkartMedicine[] = [
  {
    "id": "mock_1",
    "name": "Amistar Top Fungicide (Syngenta)",
    "price": 450,
    "originalPrice": 500,
    "rating": 4.5,
    "reviews": "120",
    "image": "https://rukminim2.flixcart.com/image/416/416/kuk4x3k0/soil-manure/q/v/u/200-amistar-top-syngenta-original-imag7n3g6z3g3g3z.jpeg",
    "link": "https://www.flipkart.com",
    "source": "Mock",
    "inStock": true,
    "category": "fungicide",
    "scrapedAt": "2026-02-19T05:21:29.209Z"
  },
  {
    "id": "mock_2",
    "name": "Neem Oil Organic Pesticide",
    "price": 299,
    "originalPrice": 399,
    "rating": 4.2,
    "reviews": "85",
    "image": "https://rukminim2.flixcart.com/image/416/416/kwdv3bk0/plant-sapling/s/4/w/no-perennial-yes-neem-plant-1-green-nursery-original-imag92q3z3g3g3z.jpeg",
    "link": "https://www.flipkart.com",
    "source": "Mock",
    "inStock": true,
    "category": "organic",
    "scrapedAt": "2026-02-19T05:21:29.210Z"
  },
  {
    "id": "mock_3",
    "name": "Coragen Insecticide (FMC)",
    "price": 850,
    "originalPrice": 950,
    "rating": 4.8,
    "reviews": "210",
    "image": "https://rukminim2.flixcart.com/image/416/416/xif0q/insecticide/w/s/4/30-coragen-30ml-fmc-original-imagzdhyg2y3g3g3.jpeg",
    "link": "https://www.flipkart.com",
    "source": "Mock",
    "inStock": true,
    "category": "pesticide",
    "scrapedAt": "2026-02-19T05:21:29.210Z"
  },
  {
    "id": "mock_4",
    "name": "Roundup Herbicide (Monsanto)",
    "price": 350,
    "originalPrice": 400,
    "rating": 4.3,
    "reviews": "150",
    "image": "https://rukminim2.flixcart.com/image/416/416/k7usyvk0/plant-sapling/g/t/d/perennial-no-roundup-herbicide-1-green-nursery-original-imafpy6z3g3g3z.jpeg",
    "link": "https://www.flipkart.com",
    "source": "Mock",
    "inStock": true,
    "category": "herbicide",
    "scrapedAt": "2026-02-19T05:21:29.210Z"
  },
  {
    "id": "mock_5",
    "name": "NPK 19:19:19 Soluble Fertilizer",
    "price": 150,
    "originalPrice": 200,
    "rating": 4.6,
    "reviews": "320",
    "image": "https://rukminim2.flixcart.com/image/416/416/xif0q/fertilizer/a/b/c/1-npk-19-19-19-100-water-soluble-fertilizer-for-plants-original-imagz3g3g3z.jpeg",
    "link": "https://www.flipkart.com",
    "source": "Mock",
    "inStock": true,
    "category": "fertilizer",
    "scrapedAt": "2026-02-19T05:21:29.210Z"
  },
  {
    "id": "mock_6",
    "name": "Bavistin Fungicide (Crystal)",
    "price": 220,
    "originalPrice": 250,
    "rating": 4.4,
    "reviews": "95",
    "image": "https://rukminim2.flixcart.com/image/416/416/k7usyvk0/plant-sapling/g/t/d/perennial-no-bavistin-fungicide-1-green-nursery-original-imafpy6z3g3g3z.jpeg",
    "link": "https://www.flipkart.com",
    "source": "Mock",
    "inStock": true,
    "category": "fungicide",
    "scrapedAt": "2026-02-19T05:21:29.210Z"
  }
];

export const medicineCategories = {
  fungicide: scrapedMedicines.filter(m => m.category === 'fungicide'),
  pesticide: scrapedMedicines.filter(m => m.category === 'pesticide'),
  herbicide: scrapedMedicines.filter(m => m.category === 'herbicide'),
  organic: scrapedMedicines.filter(m => m.category === 'organic'),
  fertilizer: scrapedMedicines.filter(m => m.category === 'fertilizer'),
  general: scrapedMedicines.filter(m => m.category === 'general'),
};
