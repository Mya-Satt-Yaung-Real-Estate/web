/**
 * Data Loaders
 * 
 * Lazy data loading functions for heavy sections.
 * Simulates API calls with realistic delays.
 */

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dataLoaders = {
  // Load featured advertisements
  async loadFeaturedAdvertisements() {
    await delay(800); // Simulate network delay
    
    return [
      {
        id: '1',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop',
        title: 'Grand Opening Sale - 20% Off on Select Properties',
        description: 'Limited time offer on premium residential properties in prime locations. Don\'t miss this exclusive opportunity!',
        promoted: true,
      },
      {
        id: '2',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop',
        title: 'Investment Opportunity - Commercial Spaces',
        description: 'High-yield commercial properties available in major business districts. Perfect for investors seeking stable returns.',
        promoted: false,
      },
      {
        id: '3',
        image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&auto=format&fit=crop',
        title: 'Luxury Condo Pre-Launch - Early Bird Discount',
        description: 'Be among the first to own a unit in our newest luxury development. Special pricing for early registrations.',
        promoted: true,
      },
      {
        id: '4',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop',
        title: 'Zero Down Payment Housing Scheme',
        description: 'Own your dream home with no initial payment. Flexible financing options with low monthly installments available.',
        promoted: true,
      },
      {
        id: '5',
        image: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&auto=format&fit=crop',
        title: 'Smart Home Upgrade Package - Free Installation',
        description: 'Get complimentary smart home system installation worth 10M MMK with selected property purchases.',
        promoted: false,
      },
      {
        id: '6',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
        title: 'Referral Rewards Program - Earn 5M MMK',
        description: 'Refer a friend and earn up to 5M MMK in rewards. Both you and your referral receive exclusive benefits!',
        promoted: false,
      },
    ];
  },

  // Load premium posts
  async loadPremiumPosts() {
    await delay(600);
    
    return [
      {
        id: '1',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop',
        title: 'Spectacular Waterfront Penthouse',
        price: '7,350M MMK',
        location: 'Inya Lake, Yangon',
        bedrooms: 6,
        bathrooms: 5,
        area: '6,200 sqft',
        type: 'For Sale',
        views: 12500,
        trending: true,
        likes: 342,
        comments: 89,
      },
      {
        id: '2',
        image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&auto=format&fit=crop',
        title: 'Ultra-Modern Smart Mansion',
        price: '8,820M MMK',
        location: 'Golden Valley, Yangon',
        bedrooms: 7,
        bathrooms: 6,
        area: '8,500 sqft',
        type: 'For Sale',
        views: 15300,
        trending: true,
        likes: 521,
        comments: 124,
      },
      {
        id: '3',
        image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop',
        title: 'Luxury Hillside Estate',
        price: '5,985M MMK',
        location: 'Bahan Township, Yangon',
        bedrooms: 5,
        bathrooms: 5,
        area: '5,800 sqft',
        type: 'For Sale',
        views: 9800,
        trending: false,
        likes: 287,
        comments: 63,
      },
      {
        id: '4',
        image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&auto=format&fit=crop',
        title: 'Contemporary Luxury Villa',
        price: '6,510M MMK',
        location: 'Star City, Yangon',
        bedrooms: 6,
        bathrooms: 5,
        area: '7,000 sqft',
        type: 'For Sale',
        views: 11200,
        trending: true,
        likes: 398,
        comments: 91,
      },
    ];
  },

  // Load wanted listings
  async loadWantedListings() {
    await delay(500);
    
    return [
      {
        id: '1',
        title: 'Looking for 3 Bedroom Condo in Yangon',
        propertyType: 'Condominium',
        location: 'Yangon, Myanmar',
        budget: '150M - 200M MMK',
        bedrooms: 3,
        bathrooms: 2,
        postedDate: '2025-10-14',
        status: 'Active' as const,
        description: 'Seeking a modern condominium with parking space, gym access, and good security.',
        poster: 'Ko Aung',
        responses: 12,
        listingType: 'buyer' as const,
      },
      {
        id: '2',
        title: 'Wanted: Commercial Space in Downtown',
        propertyType: 'Commercial Building',
        location: 'Downtown Yangon, Myanmar',
        budget: '300M - 500M MMK',
        area: '2,000 sqft',
        postedDate: '2025-10-12',
        status: 'Active' as const,
        description: 'Looking for ground floor commercial space suitable for retail business.',
        poster: 'Ma Thandar',
        responses: 8,
        listingType: 'renter' as const,
      },
      {
        id: '3',
        title: 'Need Villa with Garden in Golden Valley',
        propertyType: 'Villa',
        location: 'Golden Valley, Yangon',
        budget: '500M - 800M MMK',
        bedrooms: 5,
        bathrooms: 4,
        area: '4,500 sqft',
        postedDate: '2025-10-10',
        status: 'Active' as const,
        description: 'Seeking luxury villa with large garden, swimming pool, and modern amenities.',
        poster: 'U Kyaw Win',
        responses: 15,
        listingType: 'buyer' as const,
      },
      {
        id: '4',
        title: 'Looking for Office Space in Business District',
        propertyType: 'Office Space',
        location: 'Central Business District, Yangon',
        budget: '200M - 350M MMK',
        area: '1,500 sqft',
        postedDate: '2025-10-08',
        status: 'Active' as const,
        description: 'Need office space with good parking facilities and modern infrastructure.',
        poster: 'Daw Aye',
        responses: 6,
        listingType: 'renter' as const,
      },
      {
        id: '5',
        title: 'Seeking Beachfront Property in Ngwe Saung',
        propertyType: 'Beach House',
        location: 'Ngwe Saung Beach',
        budget: '400M - 600M MMK',
        bedrooms: 4,
        bathrooms: 3,
        area: '3,200 sqft',
        postedDate: '2025-10-06',
        status: 'Active' as const,
        description: 'Looking for beachfront villa for vacation rental business.',
        poster: 'Ko Min',
        responses: 9,
        listingType: 'buyer' as const,
      },
      {
        id: '6',
        title: 'Want Studio Apartment Near University',
        propertyType: 'Studio',
        location: 'Near Yangon University',
        budget: '50M - 80M MMK',
        area: '500 sqft',
        postedDate: '2025-10-04',
        status: 'Active' as const,
        description: 'Student accommodation with basic amenities and good transport links.',
        poster: 'Ma Ei',
        responses: 18,
        listingType: 'renter' as const,
      },
    ];
  },

  // Load property listings
  async loadPropertyListings() {
    await delay(700);
    
    return [
      {
        id: '1',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
        title: 'Modern Luxury Villa with Pool',
        price: '2,625M MMK',
        location: 'Golden Valley, Yangon',
        bedrooms: 5,
        bathrooms: 4,
        area: '4,500 sqft',
        type: 'For Sale',
        featured: true,
        likes: 156,
        comments: 42,
      },
      {
        id: '2',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
        title: 'Downtown Luxury Apartment',
        price: '5.25M MMK/month',
        location: 'City Center, Mandalay',
        bedrooms: 3,
        bathrooms: 2,
        area: '1,800 sqft',
        type: 'For Rent',
        featured: false,
        likes: 98,
        comments: 27,
      },
      {
        id: '3',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
        title: 'Contemporary Family Home',
        price: '1,785M MMK',
        location: 'Star City, Yangon',
        bedrooms: 4,
        bathrooms: 3,
        area: '3,200 sqft',
        type: 'For Sale',
        featured: true,
        likes: 134,
        comments: 31,
      },
      {
        id: '4',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop',
        title: 'Luxury Penthouse Suite',
        price: '7.98M MMK/month',
        location: 'Inya Lake, Yangon',
        bedrooms: 4,
        bathrooms: 3,
        area: '2,600 sqft',
        type: 'For Rent',
        featured: false,
        likes: 187,
        comments: 53,
      },
    ];
  },

  // Load advertisements
  async loadAdvertisements() {
    await delay(900);
    
    return [
      {
        id: '1',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop',
        title: 'Grand Opening Sale - 20% Off on Select Properties',
        description: 'Limited time offer on premium residential properties in prime locations. Don\'t miss this exclusive opportunity!',
        company: 'Jade Property Group',
        category: 'Special Offer',
        validUntil: 'Dec 31, 2025',
        promoted: true,
      },
      {
        id: '2',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop',
        title: 'Investment Opportunity - Commercial Spaces',
        description: 'High-yield commercial properties available in major business districts. Perfect for investors seeking stable returns.',
        company: 'Elite Real Estate Partners',
        category: 'Investment',
        validUntil: 'Jan 15, 2026',
        promoted: false,
      },
      {
        id: '3',
        image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&auto=format&fit=crop',
        title: 'Luxury Condo Pre-Launch - Early Bird Discount',
        description: 'Be among the first to own a unit in our newest luxury development. Special pricing for early registrations.',
        company: 'Premium Developers Ltd',
        category: 'New Launch',
        validUntil: 'Nov 30, 2025',
        promoted: true,
      },
    ];
  },

  // Load events and map data
  async loadEventsAndMap() {
    await delay(1000);
    
    const events = [
      {
        id: '1',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
        title: 'Real Estate Investment Summit 2025',
        description: 'Join industry experts to discuss market trends, investment strategies, and networking opportunities.',
        date: '15 Nov',
        time: '9:00 AM - 5:00 PM',
        location: 'Yangon Convention Center',
        attendees: 350,
        category: 'Conference',
        status: 'upcoming' as const,
      },
      {
        id: '2',
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop',
        title: 'First-Time Home Buyer Workshop',
        description: 'Learn everything you need to know about purchasing your first home, from financing to closing.',
        date: '22 Nov',
        time: '2:00 PM - 4:30 PM',
        location: 'Online Webinar',
        attendees: 180,
        category: 'Workshop',
        status: 'upcoming' as const,
      },
      {
        id: '3',
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop',
        title: 'Luxury Property Showcase',
        description: 'Exclusive viewing of premium properties with complimentary consultation from our expert advisors.',
        date: '8 Nov',
        time: '10:00 AM - 6:00 PM',
        location: 'Jade Property Gallery, Mandalay',
        attendees: 125,
        category: 'Open House',
        status: 'ongoing' as const,
      },
    ];

    const propertyLocations = [
      {
        id: '1',
        title: 'Modern Luxury Villa with Pool',
        location: 'Golden Valley, Yangon',
        lat: 16.8661 + (Math.random() - 0.5) * 0.1,
        lng: 96.1951 + (Math.random() - 0.5) * 0.1,
        type: 'For Sale',
      },
      {
        id: '2',
        title: 'Downtown Luxury Apartment',
        location: 'City Center, Mandalay',
        lat: 16.8661 + (Math.random() - 0.5) * 0.1,
        lng: 96.1951 + (Math.random() - 0.5) * 0.1,
        type: 'For Rent',
      },
      {
        id: '3',
        title: 'Contemporary Family Home',
        location: 'Star City, Yangon',
        lat: 16.8661 + (Math.random() - 0.5) * 0.1,
        lng: 96.1951 + (Math.random() - 0.5) * 0.1,
        type: 'For Sale',
      },
    ];

    return { events, propertyLocations };
  },
};




