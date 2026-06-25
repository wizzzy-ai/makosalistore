export const DEPARTMENTS = [
  {
    id: 'fashion_accessories',
    label: 'Fashion & Apparel',
    items: [
      {
        label: 'Apparel',
        links: ['Tops', 'Bottoms', 'Outerwear', 'Traditional Wear']
      },
      {
        label: 'Footwear',
        links: ['Sneakers', 'Formal', 'Boots', 'Sandals']
      },
      {
        label: 'Accessories',
        links: ['Watches', 'Fine Jewelry', 'Bags', 'Belts']
      }
    ]
  },
  {
    id: 'electronics_electrical',
    label: 'Electronics & Electrical',
    items: [
      {
        label: 'Electrical Supplies',
        links: ['Wiring', 'Switches', 'Breakers', 'Lighting']
      },
      {
        label: 'Tools',
        links: ['Hand Tools', 'Power Tools', 'Test Equipment']
      },
      {
        label: 'Safety Gear',
        links: ['Gloves', 'Helmets', 'High-Vis vests']
      }
    ]
  },
  {
    id: 'home_living',
    label: 'Home & Living',
    items: [
      {
        label: 'Appliances',
        links: ['Microwaves', 'Blenders', 'Refrigerators']
      },
      {
        label: 'Household Essentials',
        links: ['Cleaning supplies', 'Storage solutions']
      },
      {
        label: 'Hardware',
        links: ['Plumbing', 'Fixtures', 'DIY equipment']
      }
    ]
  },
  {
    id: 'sports_outdoors',
    label: 'Sports & Outdoors',
    items: [
      {
        label: 'Gym Equipment',
        links: ['Dumbbells', 'Yoga mats', 'Resistance bands']
      },
      {
        label: 'Team Sports',
        links: ['Football', 'Basketball', 'Tennis gear']
      },
      {
        label: 'Activewear',
        links: ['Sport-specific clothing', 'Performance shoes']
      }
    ]
  },
  {
    id: 'food_drinks',
    label: 'Food & Drinks',
    items: [
      {
        label: 'Soft Drinks',
        links: ['Soda', 'Juices', 'Energy Drinks']
      },
      {
        label: 'Liquor & Spirits',
        links: ['Wine', 'Beer', 'Whiskey']
      },
      {
        label: 'Water & Hydration',
        links: ['Bulk water', 'Sparkling water']
      }
    ]
  },
  {
    id: 'offers_deals',
    label: 'Offers/Deals',
    items: [
      {
        label: 'Discounts',
        links: ["Today's Deals", 'Clearance', 'Bundle Offers']
      }
    ]
  }
];

// Contextual filter “words” — show only when relevant to the user’s current department.
export const FILTER_ATTRIBUTES = [
  {
    key: 'power_source',
    label: 'Power Source',
    appliesTo: ['electronics_electrical', 'home_living'],
    values: ['Battery', 'Corded', 'Solar']
  },
  {
    key: 'material',
    label: 'Material',
    appliesTo: ['fashion_accessories'],
    values: ['Cotton', 'Leather', 'Gold-plated', 'Stainless Steel']
  },
  {
    key: 'volume_size',
    label: 'Volume/Size',
    appliesTo: ['food_drinks'],
    values: ['500ml', '1L', 'Case of 24']
  },
  {
    key: 'condition',
    label: 'Condition',
    appliesTo: ['electronics_electrical', 'home_living', 'sports_outdoors'],
    values: ['New', 'Refurbished']
  }
];

const normalizeLabel = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase();

export const resolveDepartmentForCategory = (categoryLabel) => {
  const needle = normalizeLabel(categoryLabel);
  if (!needle) return null;

  for (const dept of DEPARTMENTS) {
    if (normalizeLabel(dept.label) === needle) return dept;
    for (const group of dept.items ?? []) {
      if (normalizeLabel(group.label) === needle) return dept;
      for (const link of group.links ?? []) {
        if (normalizeLabel(link) === needle) return dept;
      }
    }
  }

  return null;
};

export const getApplicableFilterAttributes = (categoryLabel) => {
  const dept = resolveDepartmentForCategory(categoryLabel);
  if (!dept) return [];
  return FILTER_ATTRIBUTES.filter((attr) => (attr.appliesTo ?? []).includes(dept.id));
};

