import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'mm';

interface Translations {
  [key: string]: {
    en: string;
    mm: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', mm: 'ပင်မ' },
  'nav.about': { en: 'About Us', mm: 'ကျွန်ုပ်တို့အကြောင်း' },
  'nav.properties': { en: 'Properties', mm: 'အိမ်ခြံမြေများ' },
  'nav.companies': { en: 'Companies', mm: 'ကုမ္ပဏီများ' },
  'nav.appointments': { en: 'Appointments', mm: 'ချိန်းဆိုမှုများ' },
  'nav.postProperty': { en: 'Post Property', mm: 'အိမ်ခြံမြေတင်ရန်' },
  'nav.createListing': { en: 'Create Listing', mm: 'ပို့စ်တင်ရန်' },
  'nav.calculator': { en: 'Calculator', mm: 'တွက်ချက်စက်' },
  'nav.knowledges': { en: 'Knowledges', mm: 'သိကောင်းစရာ' },
  'nav.signIn': { en: 'Sign In', mm: 'ဝင်ရောက်ရန်' },
  'nav.signOut': { en: 'Sign Out', mm: 'ထွက်ရန်' },
  
  // Home Page
  'home.newProperties': { en: 'Find your dream property', mm: 'သင့်အိပ်မက် အိမ်ခြံမြေကိုရှာပါ' },
  'home.propertiesListed': { en: 'Properties Listed', mm: 'အိမ်ခြံမြေများတင်ထားပြီး' },
  'home.wantedListing': { en: 'Wanted Listings', mm: 'လိုချင်သောစာရင်းများ' },
  'home.citiesCovered': { en: 'Cities Covered', mm: 'မြို့များဖုံးလွှမ်းထား' },
  'home.yearsExperience': { en: 'Years Experience', mm: 'နှစ်များအတွေ့အကြုံ' },
  'home.whyChoose': { en: 'Why Choose Jade Property?', mm: 'Jade Property ကိုဘာ့ကြောင့်ရွေးချယ်ရမှာလဲ?' },
  'home.ourServices': { en: 'Our Services', mm: 'ကျွန်ုပ်တို့၏ဝန်ဆောင်မှုများ' },
  'home.getStarted': { en: 'Get Started Today', mm: 'ယနေ့စတင်ပါ' },
  'home.cta.title': { en: 'Ready to Find Your Dream Property?', mm: 'သင့်အိပ်မက်အိမ်ခြံမြေကိုရှာဖွေရန်အဆင်သင့်ဖြစ်ပြီလား?' },
  'home.cta.description': { en: 'Join thousands of satisfied clients who found their perfect property with us', mm: 'ကျွန်ုပ်တို့နှင့်အတူ သင့်အတွက်အကောင်းဆုံးအိမ်ခြံမြေကိုရှာတွေ့ခဲ့သော ကျေနပ်သောဖောက်သည်ထောင်ပေါင်းများစွာနှင့်ပါဝင်ပါ' },
  
  // Categories
  'categories.searchAllProperty': { en: 'Search All Property', mm: 'အိမ်ခြံမြေအားလုံးရှာဖွေရန်' },
  'categories.tantantan': { en: 'Tantantan', mm: 'တန်တန်တန်' },
  'categories.premiumProperties': { en: 'Premium Properties', mm: 'အဆင့်မြင့်အိမ်ခြံမြေများ' },
  'categories.preSale': { en: 'Pre-Sale', mm: 'ကြိုတင်ရောင်းချမှု' },
  'categories.installment': { en: 'Installment', mm: 'အရစ်ကျ' },
  'categories.buyerPosts': { en: 'Buyer Posts', mm: 'ဝယ်သူများ၏စာရင်း' },
  'categories.renterPosts': { en: 'Renter Posts', mm: 'ငှားသူများ၏စာရင်း' },
  'categories.vacanciesJobs': { en: 'Vacancies & Jobs', mm: 'အလုပ်လစ်လပ်မှုများနှင့်အလုပ်များ' },
  'categories.companies': { en: 'Companies', mm: 'ကုမ္ပဏီများ' },
  'categories.realEstateAgency': { en: 'Real Estate Agency', mm: 'အိမ်ခြံမြေအေဂျင်စီ' },
  'categories.constructionCompany': { en: 'Construction Company', mm: 'ဆောက်လုပ်ရေးကုမ္ပဏီ' },
  'categories.propertyManagement': { en: 'Property Management', mm: 'အိမ်ခြံမြေစီမံခန့်ခွဲမှု' },
  'categories.propertyDeveloper': { en: 'Property Developer', mm: 'အိမ်ခြံမြေဖွံ့ဖြိုးတိုးတက်ရေးကုမ္ပဏီ' },
  'categories.realEstateConsultant': { en: 'Real Estate Consultant', mm: 'အိမ်ခြံမြေအကြံပေးကုမ္ပဏီ' },
  
  // Listings
  'listings.forSale': { en: 'For Sale', mm: 'ရောင်းချရန်' },
  'listings.forRent': { en: 'For Rent', mm: 'ငှားရန်ရှိသည်' },
  'listings.title': { en: 'Featured Properties', mm: 'အထူးအိမ်ခြံမြေများ' },
  'listings.subtitle': { en: 'Discover premium properties handpicked for you', mm: 'သင့်အတွက်ရွေးချယ်ထားသောအဆင့်မြင့်အိမ်ခြံမြေများကိုရှာဖွေပါ' },
  'listings.viewAll': { en: 'View All Properties', mm: 'အိမ်ခြံမြေအားလုံးကြည့်ရန်' },
  'listings.viewDetails': { en: 'View Details', mm: 'အသေးစိတ်ကြည့်ရန်' },
  'listings.featured': { en: 'Featured', mm: 'အထူးဖြစ်သော' },
  'listings.sqft': { en: 'sqft', mm: 'စတုရန်းပေ' },
  
  // Create Listing
  'createListing.title': { en: 'Create Listing', mm: 'စာရင်းဖန်တီးရန်' },
  'createListing.propertyPost': { en: 'Property Post', mm: 'အိမ်ခြံမြေတင်ရန်' },
  'createListing.wantedPost': { en: 'Wanted Post', mm: 'လိုချင်သောစာရင်း' },
  'createListing.advertisementPost': { en: 'Advertisement Post', mm: 'ကြော်ငြာတင်ရန်' },
  'createListing.appointmentRequest': { en: 'Appointment Request', mm: 'ချိန်းဆိုမှုတောင်းဆိုရန်' },
  'createListing.giveYourReview': { en: 'Give Your Review', mm: 'သင်၏သုံးသပ်ချက်ပေးပါ' },
  'createListing.jobPostCreate': { en: 'Job Post Create', mm: 'အလုပ်စာရင်းဖန်တီးရန်' },
  
  // Calculators
  'calculators.loanCalculator': { en: 'Loan Calculator', mm: 'ချေးငွေတွက်စက်' },
  'calculators.yarPyatTaxCalculator': { en: 'Yar Pyat Tax Calculator', mm: 'ရာပြတ်ခွန်တွက်စက်' },
  
  // Services
  'services.ourServices': { en: 'Our Services', mm: 'ကျွန်ုပ်တို့၏ဝန်ဆောင်မှုများ' },
  'services.propertyManagement': { en: 'Property Management', mm: 'အိမ်ခြံမြေစီမံခန့်ခွဲမှု' },
  'services.pointManagement': { en: 'Point Management', mm: 'ပွိုင့်စီမံခန့်ခွဲမှု' },
  'services.pointManagementDesc': { en: 'Manage your reward points', mm: 'သင့်ဆုလာဘ်ပွိုင့်များကို စီမံပါ' },
  'services.createListing': { en: 'Create Listing', mm: 'စာရင်းဖန်တီးရန်' },
  'services.createListingDesc': { en: 'Post new property listings', mm: 'အိမ်ခြံမြေစာရင်းအသစ်တင်ရန်' },
  'services.wantedListing': { en: 'Wanted Listing', mm: 'လိုချင်သောစာရင်း' },
  'services.wantedListingDesc': { en: 'Post your property requirements', mm: 'သင့်အိမ်ခြံမြေလိုအပ်ချက်များတင်ရန်' },
  'services.history': { en: 'History', mm: 'မှတ်တမ်း' },
  'services.historyDesc': { en: 'View your activity history', mm: 'သင့်လုပ်ဆောင်ချက်မှတ်တမ်းကြည့်ရန်' },
  'services.appointmentRequest': { en: 'Appointment Request', mm: 'ချိန်းဆိုမှုတောင်းဆိုမှု' },
  'services.appointmentRequestDesc': { en: 'Schedule property viewings', mm: 'အိမ်ခြံမြေကြည့်ရှုမှုချိန်းဆိုရန်' },
  'services.advertisement': { en: 'Advertisement Create & History', mm: 'ကြော်ငြာဖန်တီးမှုနှင့်မှတ်တမ်း' },
  'services.advertisementDesc': { en: 'Create and manage ads', mm: 'ကြော်ငြာများဖန်တီး၍စီမံပါ' },
  'services.companies': { en: 'Companies', mm: 'ကုမ္ပဏီများ' },
  'services.companiesDesc': { en: 'Browse real estate companies', mm: 'အိမ်ခြံမြေကုမ္ပဏီများကြည့်ရန်' },
  'services.knowledgeHub': { en: 'Knowledge Hub', mm: 'အသိပညာဗဟို' },
  'services.knowledgeHubDesc': { en: 'Learn about real estate', mm: 'အိမ်ခြံမြေအကြောင်းလေ့လာပါ' },
  'services.legalTeam': { en: 'Legal Team', mm: 'ဥပဒေအဖွဲ့' },
  'services.legalTeamDesc': { en: 'Legal consultation services', mm: 'ဥပဒေအကြံပြုဝန်ဆောင်မှု' },
  'services.housingEvent': { en: 'Housing Event', mm: 'အိမ်ရာပွဲများ' },
  'services.housingEventDesc': { en: 'Upcoming property events', mm: 'လာမည့်အိမ်ခြံမြေပွဲများ' },
  'services.faq': { en: 'FAQ', mm: 'မကြာခဏမေးလေ့ရှိသောမေးခွန်းများ' },
  'services.faqDesc': { en: 'Frequently asked questions', mm: 'မကြာခဏမေးလေ့ရှိသောမေးခွန်းများ' },
  'services.contactUs': { en: 'Contact Us', mm: 'ဆက်သွယ်ရန်' },
  'services.contactUsDesc': { en: 'Get in touch with us', mm: 'ကျွန်ုပ်တို့နှင့်ဆက်သွယ်ပါ' },
  'services.newsUpdates': { en: 'News & Updates', mm: 'သတင်းနှင့်အပ်ဒိတ်များ' },
  'services.newsUpdatesDesc': { en: 'Latest real estate news', mm: 'နောက်ဆုံးအိမ်ခြံမြေသတင်းများ' },
  'services.applyFeedback': { en: 'Apply Feedback', mm: 'အကြံပြုချက်တင်သွင်းရန်' },
  'services.applyFeedbackDesc': { en: 'Share your suggestions', mm: 'သင့်အကြံပြုချက်များမျှဝေပါ' },
  'services.favorite': { en: 'Favorite', mm: 'အကြိုက်ဆုံး' },
  'services.favoriteDesc': { en: 'Your saved properties', mm: 'သင်သိမ်းထားသောအိမ်ခြံမြေများ' },
  'services.recentViews': { en: 'Recent Views', mm: 'မကြာသေးမီကြည့်ရှုမှုများ' },
  'services.recentViewsDesc': { en: 'Recently viewed properties', mm: 'မကြာသေးမီကြည့်ရှုခဲ့သောအိမ်ခြံမြေများ' },
  'services.profile': { en: 'Profile', mm: 'ပရိုဖိုင်' },
  'services.profileDesc': { en: 'Manage your account', mm: 'သင့်အကောင့်စီမံပါ' },
  'services.setting': { en: 'Setting', mm: 'ဆက်တင်' },
  'services.settingDesc': { en: 'App preferences and settings', mm: 'အက်ပ်နှစ်သက်မှုနှင့်ဆက်တင်များ' },
  'services.aboutApp': { en: 'About App', mm: 'အက်ပ်အကြောင်း' },
  'services.aboutAppDesc': { en: 'App information and version', mm: 'အက်ပ်အချက်အလက်နှင့်ဗားရှင်း' },
  'services.informationCenter': { en: 'Information Center', mm: 'သတင်းအချက်အလက်ဗဟို' },
  'services.userFeatures': { en: 'User Features', mm: 'အသုံးပြုသူဝန်ဆောင်မှုများ' },
  'services.loanRequest': { en: 'Loan Request', mm: 'ချေးငွေတောင်းဆိုမှု' },
  'services.loanRequestDesc': { en: 'Apply for property loans and financing', mm: 'အိမ်ခြံမြေချေးငွေနှင့်ဘဏ္ဍာရေးတောင်းဆိုရန်' },
  'services.loanCalculator': { en: 'Loan Calculator', mm: 'ချေးငွေတွက်စက်' },
  'services.loanCalculatorDesc': { en: 'Calculate your monthly loan payments', mm: 'သင့်လစဉ်ချေးငွေပေးချေမှုကိုတွက်ချက်ပါ' },
  'services.jobPostListing': { en: 'Job Post Listing', mm: 'အလုပ်ခန့်စာရင်း' },
  'services.jobPostListingDesc': { en: 'Browse available job opportunities', mm: 'ရရှိနိုင်သောအလုပ်အကိုင်အခွင့်အလမ်းများကြည့်ရှုပါ' },
  'services.reviewPost': { en: 'Review Post', mm: 'သုံးသပ်ချက်တင်ရန်' },
  'services.reviewPostDesc': { en: 'Share your property reviews and experiences', mm: 'သင်၏အိမ်ခြံမြေသုံးသပ်ချက်နှင့်အတွေ့အကြုံများမျှဝေပါ' },
  'services.searchAll': { en: 'Search All Property', mm: 'အိမ်ခြံမြေအားလုံးရှာဖွေရန်' },
  'services.searchAllDesc': { en: 'Search properties, advertisements, and events', mm: 'အိမ်ခြံမြေများ၊ ကြော်ငြာများနှင့် အခမ်းအနားများကို ရှာဖွေပါ' },
  
  // Property Types
  'propertyTypes.recommendedTitle': { en: 'Recommended Property Types', mm: 'အကြံပြုထားသောအိမ်ခြံမြေအမျိုးအစားများ' },
  'propertyTypes.apartment': { en: 'Apartment', mm: 'တိုက်ခန်း' },
  'propertyTypes.beachHouse': { en: 'Beach House', mm: 'ပင်လယ်ကမ်းခြေအိမ်' },
  'propertyTypes.commercialBuilding': { en: 'Commercial Building', mm: 'စီးပွားရေးအဆောက်အအုံ' },
  'propertyTypes.condo': { en: 'Condominium', mm: 'ကွန်ဒို' },
  'propertyTypes.duplex': { en: 'Duplex', mm: 'ဒူပလက်စ်' },
  'propertyTypes.factory': { en: 'Factory', mm: 'စက်ရုံ' },
  'propertyTypes.farm': { en: 'Farm', mm: 'လယ်ယာ' },
  'propertyTypes.garden': { en: 'Garden', mm: 'ဥယျာဉ်' },
  'propertyTypes.guestHouse': { en: 'Guest House', mm: 'ဧည့်အိမ်' },
  'propertyTypes.hotel': { en: 'Hotel', mm: 'ဟိုတယ်' },
  'propertyTypes.house': { en: 'House', mm: 'အိမ်' },
  'propertyTypes.land': { en: 'Land', mm: 'မြေ' },
  'propertyTypes.officeSpace': { en: 'Office Space', mm: 'ရုံးခန်း' },
  'propertyTypes.penthouse': { en: 'Penthouse', mm: 'ပင်တဟောက်' },
  'propertyTypes.restaurant': { en: 'Restaurant', mm: 'စားသောက်ဆိုင်' },
  'propertyTypes.shop': { en: 'Shop', mm: 'ဆိုင်' },
  'propertyTypes.studio': { en: 'Studio', mm: 'စတူဒီယို' },
  'propertyTypes.townhouse': { en: 'Townhouse', mm: 'မြို့အိမ်' },
  'propertyTypes.villa': { en: 'Villa', mm: 'ဗီလာ' },
  'propertyTypes.warehouse': { en: 'Warehouse', mm: 'ကုန်သိုလှောင်ရုံ' },
  
  // Search
  'search.keywords': { en: 'Keywords', mm: 'သော့ချက်စာလုံးများ' },
  'search.propertyType': { en: 'Property Type', mm: 'အိမ်ခြံမြေအမျိုးအစား' },
  'search.allTypes': { en: 'All Types', mm: 'အမျိုးအစားအားလုံး' },
  'search.residential': { en: 'Residential', mm: 'နေထိုင်ရေးအိမ်ခြံမြေ' },
  'search.commercial': { en: 'Commercial', mm: 'စီးပွားရေးအိမ်ခြံမြေ' },
  'search.industrial': { en: 'Industrial', mm: 'စက်မှုအိမ်ခြံမြေ' },
  'search.land': { en: 'Land', mm: 'မြေ' },
  'search.regionState': { en: 'Region/State', mm: 'တိုင်း/ပြည်နယ်' },
  'search.all': { en: 'All', mm: 'အားလုံး' },
  'search.yangon': { en: 'Yangon', mm: 'ရန်ကုန်' },
  'search.mandalay': { en: 'Mandalay', mm: 'မန္တလေး' },
  'search.naypyidaw': { en: 'Naypyidaw', mm: 'နေပြည်တော်' },
  'search.bago': { en: 'Bago', mm: 'ပဲခူး' },
  'search.ayeyarwady': { en: 'Ayeyarwady', mm: 'ဧရာဝတီ' },
  'search.shan': { en: 'Shan', mm: 'ရှမ်း' },
  'search.kachin': { en: 'Kachin', mm: 'ကချင်' },
  'search.kayah': { en: 'Kayah', mm: 'ကယား' },
  'search.kayin': { en: 'Kayin', mm: 'ကရင်' },
  'search.chin': { en: 'Chin', mm: 'ချင်း' },
  'search.mon': { en: 'Mon', mm: 'မွန်' },
  'search.rakhine': { en: 'Rakhine', mm: 'ရခိုင်' },
  'search.sagaing': { en: 'Sagaing', mm: 'စစ်ကိုင်း' },
  'search.tanintharyi': { en: 'Tanintharyi', mm: 'တနင်္သာရီ' },
  'search.magway': { en: 'Magway', mm: 'မကွေး' },
  'search.propertyListing': { en: 'Property Listing', mm: 'အိမ်ခြံမြေစာရင်း' },
  'search.forSale': { en: 'For Sale', mm: 'ရောင်းချရန်' },
  'search.forRent': { en: 'For Rent', mm: 'ငှားရန်ရှိသည်' },
  'search.forLease': { en: 'For Lease', mm: 'ငှားရမ်းရန်' },
  'search.propertyCondition': { en: 'Property Condition', mm: 'အိမ်ခြံမြေအခြေအနေ' },
  'search.brandNew': { en: 'Brand New', mm: 'အသစ်စက်စက်' },
  'search.excellent': { en: 'Excellent', mm: 'အလွန်ကောင်းမွန်' },
  'search.good': { en: 'Good', mm: 'ကောင်းမွန်' },
  'search.fair': { en: 'Fair', mm: 'အလယ်အလတ်' },
  'search.needsRenovation': { en: 'Needs Renovation', mm: 'ပြန်လည်ပြင်ဆင်ရန်လိုအပ်' },
  'search.region': { en: 'Region', mm: 'တိုင်း' },
  'search.township': { en: 'Township', mm: 'မြို့နယ်' },
  'search.bahan': { en: 'Bahan', mm: 'ဗဟန်း' },
  'search.kamayut': { en: 'Kamayut', mm: 'ကမာရွတ်' },
  'search.yankin': { en: 'Yankin', mm: 'ရန်ကင်း' },
  'search.sanchaung': { en: 'Sanchaung', mm: 'စမ်းချောင်း' },
  'search.hlaing': { en: 'Hlaing', mm: 'လှိုင်' },
  'search.mayangone': { en: 'Mayangone', mm: 'မရမ်းကုန်း' },
  'search.priceRange': { en: 'Price Range', mm: 'ဈေးနှုန်းအကွာအဝေး' },
  'search.bedrooms': { en: 'Bedrooms', mm: 'အိပ်ခန်းများ' },
  'search.bathrooms': { en: 'Bathrooms', mm: 'ရေချိုးခန်းများ' },
  'search.any': { en: 'Any', mm: 'မည်သည့်အရာ' },
  'search.areaSize': { en: 'Area Size', mm: 'ဧရိယာအရွယ်အစား' },
  'search.min': { en: 'Min', mm: 'အနည်းဆုံး' },
  'search.max': { en: 'Max', mm: 'အများဆုံး' },
  'search.furnished': { en: 'Furnished', mm: 'ပရိဘောဂပါ' },
  'search.unfurnished': { en: 'Unfurnished', mm: 'ပရိဘောဂမပါ' },
  'search.semiFurnished': { en: 'Semi-Furnished', mm: 'ပရိဘောဂတစ်ပိုင်းပါ' },
  'search.parking': { en: 'Parking', mm: 'ကားရပ်နားရန်' },
  'search.yearBuilt': { en: 'Year Built', mm: 'တည်ဆောက်သည့်နှစ်' },
  'search.amenities': { en: 'Amenities', mm: 'အဆောက်အအုံများ' },
  'search.pool': { en: 'Pool', mm: 'ရေကူးကန်' },
  'search.gym': { en: 'Gym', mm: 'အားကစားခန်း' },
  'search.security': { en: 'Security', mm: 'လုံခြုံရေး' },
  'search.elevator': { en: 'Elevator', mm: 'ဓာတ်လှေကား' },
  'search.garden': { en: 'Garden', mm: 'ဥယျာဉ်' },
  'search.balcony': { en: 'Balcony', mm: 'ပြတင်းပေါက်' },
  'search.wifi': { en: 'WiFi', mm: 'ဝိုင်ဖိုင်' },
  'search.ac': { en: 'Air Conditioning', mm: 'လေအေးပေးစက်' },
  'search.clearFilters': { en: 'Clear Filters', mm: 'စစ်ထုတ်မှုများရှင်းလင်းရန်' },
  'search.searchProperties': { en: 'Search Properties', mm: 'အိမ်ခြံမြေများရှာဖွေရန်' },
  
  // Advertisements
  'ads.title': { en: 'Featured Advertisements', mm: 'အထူးကြော်ငြာများ' },
  'ads.subtitle': { en: 'Discover exclusive offers and promotions', mm: 'သီးသန့်ကမ်းလှမ်းမှုများနှင့်ကြော်ငြာများကိုရှာဖွေပါ' },
  'ads.viewAll': { en: 'View All', mm: 'အားလုံးကြည့်ရန်' },
  'ads.promoted': { en: 'Promoted', mm: 'ကြော်ငြာပေးထား' },
  'ads.validUntil': { en: 'Valid Until', mm: 'သက်တမ်းကုန်ဆုံးရက်' },
  'ads.learnMore': { en: 'Learn More', mm: 'ပိုမိုလေ့လာရန်' },
  
  // Premium
  'premium.title': { en: 'Premium Properties', mm: 'အဆင့်မြင့်အိမ်ခြံမြေများ' },
  'premium.subtitle': { en: 'Exclusive luxury properties for discerning buyers', mm: 'ရွေးချယ်တတ်သောဝယ်သူများအတွက်သီးသန့်ဇိမ်ခံအိမ်ခြံမြေများ' },
  'premium.viewAll': { en: 'View All Premium', mm: 'အဆင့်မြင့်အားလုံးကြည့်ရန်' },
  'premium.badge': { en: 'Premium', mm: 'အဆင့်မြင့်' },
  'premium.trending': { en: 'Trending', mm: 'ခေတ်စားနေ' },
  
  // Events
  'events.title': { en: 'Upcoming Events', mm: 'လာမည့်အခမ်းအနားများ' },
  'events.subtitle': { en: 'Join our real estate events and workshops', mm: 'ကျွန်ုပ်တို့၏အိမ်ခြံမြေအခမ်းအနားများနှင့်လုပ်ငန်းဆိုင်ရာသင်တန်းများတွင်ပါဝင်ပါ' },
  'events.viewAll': { en: 'View All Events', mm: 'အခမ်းအနားအားလုံးကြည့်ရန်' },
  'events.liveNow': { en: 'Live Now', mm: 'ယခုတိုက်ရိုက်ထုတ်လွှင့်နေ' },
  'events.upcoming': { en: 'Upcoming', mm: 'လာမည့်' },
  'events.ended': { en: 'Ended', mm: 'ပြီးဆုံးပြီ' },
  'events.attending': { en: 'attending', mm: 'တက်ရောက်မည်' },
  'events.eventEnded': { en: 'Event Ended', mm: 'အခမ်းအနားပြီးဆုံးပြီ' },
  'events.registerNow': { en: 'Register Now', mm: 'ယခုစာရင်းသွင်းပါ' },
  
  // Jobs
  'jobs.title': { en: 'Job Opportunities', mm: 'အလုပ်အကိုင်အခွင့်အလမ်းများ' },
  'jobs.subtitle': { en: 'Find your next career in real estate', mm: 'အိမ်ခြံမြေတွင်သင်၏နောက်အလုပ်အကိုင်ကိုရှာဖွေပါ' },
  'jobs.viewAll': { en: 'View All Jobs', mm: 'အလုပ်အားလုံးကြည့်ရန်' },
  'jobs.fullTime': { en: 'Full Time', mm: 'အချိန်ပြည့်' },
  'jobs.postedOn': { en: 'Posted on', mm: 'တင်ထားသည့်ရက်' },
  'jobs.viewDetails': { en: 'View Details', mm: 'အသေးစိတ်ကြည့်ရန်' },
  
  // Legal Team
  'legalTeam.title': { en: 'Our Legal Team', mm: 'ကျွန်ုပ်တို့၏ဥပဒေအဖွဲ့' },
  'legalTeam.subtitle': { en: 'Expert legal advice for your property needs', mm: 'သင်၏အိမ်ခြံမြေလိုအပ်ချက်များအတွက်ကျွမ်းကျင်သောဥပဒေအကြံပြုချက်' },
  'legalTeam.viewAll': { en: 'View All Team', mm: 'အဖွဲ့အားလုံးကြည့်ရန်' },
  
  // Language
  'language.english': { en: 'English', mm: 'အင်္ဂလိပ်' },
  'language.myanmar': { en: 'Myanmar', mm: 'မြန်မာ' },
  
  // Footer
  'footer.description': { en: 'Your trusted partner in finding the perfect property.', mm: 'သင့်အတွက် အကောင်းဆုံး အိမ်ခြံမြေကို ရှာဖွေရာတွင် ယုံကြည်စိတ်ချရသော လုပ်ဖော်ကိုင်ဖက်' },
  'footer.quickLinks': { en: 'Quick Links', mm: 'အမြန်လင့်ခ်များ' },
  'footer.legal': { en: 'Legal', mm: 'ဥပဒေဆိုင်ရာ' },
  'footer.contact': { en: 'Contact Us', mm: 'ဆက်သွယ်ရန်' },
  'footer.privacy': { en: 'Privacy Policy', mm: 'ကိုယ်ရေးကိုယ်တာမူဝါဒ' },
  'footer.terms': { en: 'Terms of Service', mm: 'ဝန်ဆောင်မှုစည်းမျဉ်းများ' },
  'footer.rights': { en: 'All rights reserved.', mm: 'မူပိုင်ခွင့်များ လုံးဝ ရယူထားပါသည်။' },
  
  // About Us
  'about.story': { en: 'Our Story', mm: 'ကျွန်ုပ်တို့၏ ဇာတ်လမ်း' },
  'about.title': { en: 'About Jade Property', mm: 'Jade Property အကြောင်း' },
  'about.intro': { en: 'We are dedicated to transforming the real estate experience by providing comprehensive, transparent, and technology-driven property solutions that empower our clients to make informed decisions and find their perfect property.', mm: 'ကျွန်ုပ်တို့သည် ဖောက်သည်များအား အကောင်းဆုံးဆုံးဖြတ်ချက်များချနိုင်ရန်နှင့် ၎င်းတို့၏ အကောင်းဆုံးအိမ်ခြံမြေကို ရှာတွေ့နိုင်ရန် ပြည့်စုံသော၊ ပွင့်လင်းမြင်သာသော နှင့် နည်းပညာမောင်းနှင်သော အိမ်ခြံမြေဖြေရှင်းချက်များဖြင့် အိမ်ခြံမြေအတွေ့အကြုံကို ပြောင်းလဲပေးရန် ရည်ရွယ်ပါသည်။' },
  'about.whatWeDo': { en: 'What We Do', mm: 'ကျွန်ုပ်တို့ လုပ်ဆောင်ချက်များ' },
  'about.description1': { en: 'Jade Property is a comprehensive real estate platform that connects buyers, sellers, and investors with their ideal properties. Our platform combines cutting-edge technology with personalized service to deliver an exceptional property search and transaction experience.', mm: 'Jade Property သည် ဝယ်သူများ၊ ရောင်းသူများနှင့် ရင်းနှီးမြှုပ်နှံသူများကို ၎င်းတို့၏ အကောင်းဆုံး အိမ်ခြံမြေများနှင့် ချိတ်ဆက်ပေးသော ပြည့်စုံသော အိမ်ခြံမြေပလက်ဖောင်းတစ်ခုဖြစ်ပါသည်။ ကျွန်ုပ်တို့၏ ပလက်ဖောင်းသည် ထူးခြားသော အိမ်ခြံမြေရှာဖွေမှုနှင့် အရောင်းအဝယ် အတွေ့အကြုံကို ပေးအပ်ရန် အဆင့်မြင့် နည်းပညာနှင့် ပုဂ္ဂိုလ်ရေးဆိုင်ရာ ဝန်ဆောင်မှုကို ပေါင်းစပ်ထားပါသည်။' },
  'about.description2': { en: 'We work with experienced real estate professionals and leverage advanced market analytics to provide our clients with accurate property valuations and investment insights. Whether you\'re a first-time homebuyer or a seasoned investor, our team is dedicated to helping you achieve your real estate goals.', mm: 'ကျွန်ုပ်တို့သည် အတွေ့အကြုံရှိ အိမ်ခြံမြေ ပညာရှင်များနှင့် အလုပ်လုပ်ပြီး ဖောက်သည်များအား တိကျသော အိမ်ခြံမြေတန်ဖိုးသတ်မှတ်ချက်များနှင့် ရင်းနှီးမြှုပ်နှံမှု အသိအမြင်များ ပေးအပ်ရန် အဆင့်မြင့် စျေးကွက်ခွဲခြမ်းစိတ်ဖြာမှုများကို အသုံးပြုပါသည်။ သင်သည် ပထမဆုံးအကြိမ် အိမ်ဝယ်သူဖြစ်စေ၊ အတွေ့အကြုံရှိ ရင်းနှီးမြှုပ်နှံသူဖြစ်စေ၊ ကျွန်ုပ်တို့အဖွဲ့သည် သင်၏ အိမ်ခြံမြေပန်းတိုင်များကို အောင်မြင်အောင် ကူညီပေးရန် ရည်စူးပါသည်။' },
  'about.ourValues': { en: 'Our Values', mm: 'ကျွန်ုပ်တို့၏ တန်ဖိုးများ' },
  'about.mission': { en: 'Our Mission', mm: 'ကျွန်ုပ်တို့၏ မျှော်မှန်းချက်' },
  'about.missionDesc': { en: 'To revolutionize real estate by making property search transparent, efficient, and accessible to everyone through innovative technology.', mm: 'ဆန်းသစ်သော နည်းပညာမှတဆင့် အိမ်ခြံမြေရှာဖွေမှုကို ပွင့်လင်းမြင်သာစေခြင်း၊ ထိရောက်စေခြင်းနှင့် လူတိုင်းအတွက် လက်လှမ်းမီစေခြင်းဖြင့် အိမ်ခြံမြေကို တော်လှန်ပြောင်းလဲရန်။' },
  'about.clientCentric': { en: 'Client-Centric', mm: 'ဖောက်သည်ဗဟိုပြု' },
  'about.clientDesc': { en: 'We prioritize our clients\' needs and work tirelessly to exceed expectations in every transaction.', mm: 'ကျွန်ုပ်တို့သည် ဖောက်သည်များ၏ လိုအပ်ချက်များကို ဦးစားပေးပြီး အရောင်းအဝယ် တိုင်းတွင် မျှော်မှန်းချက်များကို ကျော်လွန်အောင် ကြိုးစားဆောင်ရွက်ပါသည်။' },
  'about.integrity': { en: 'Integrity & Trust', mm: 'သမာဓိနှင့် ယုံကြည်မှု' },
  'about.integrityDesc': { en: 'We are committed to maintaining the highest standards of honesty, transparency, and professionalism in all our dealings.', mm: 'ကျွန်ုပ်တို့၏ ရောင်းဝယ်ဖောက်ကားမှုအားလုံးတွင် ရိုးသားမှု၊ ပွင့်လင်းမြင်သာမှုနှင့် ပညာရှင်ဆန်မှု၏ အမြင့်ဆုံးစံနှုန်းများကို ထိန်းသိမ်းရန် ကတိပြုပါသည်။' },
  'about.meetTeam': { en: 'Meet Our Team', mm: 'ကျွန်ုပ်တို့၏ အဖွဲ့ကို တွေ့ဆုံပါ' },
  'about.contactInfo': { en: 'Contact Information', mm: 'ဆက်သွယ်ရန် အချက်အလက်' },
  'about.email': { en: 'Email', mm: 'အီးမေးလ်' },
  'about.phone': { en: 'Phone', mm: 'ဖုန်း' },
  'about.address': { en: 'Address', mm: 'လိပ်စာ' },
  'about.experience': { en: 'Years of Experience', mm: 'နှစ်များ အတွေ့အကြုံ' },
  'about.experienceDesc': { en: 'Over a decade of expertise in Myanmar\'s real estate market', mm: 'မြန်မာနိုင်ငံ၏ အိမ်ခြံမြေစျေးကွက်တွင် ဆယ်စုနှစ်တစ်ခုကျော် ကျွမ်းကျင်မှု' },
  'about.marketLeader': { en: 'Market Leadership', mm: 'စျေးကွက်ခေါင်းဆောင်မှု' },
  'about.marketLeaderDesc': { en: 'Trusted by thousands for buying, selling, and investing in properties', mm: 'အိမ်ခြံမြေ ဝယ်ယူခြင်း၊ ရောင်းချခြင်းနှင့် ရင်းနှီးမြှုပ်နှံခြင်းတွင် လူထောင်ပေါင်းများစွာမှ ယုံကြည်ခံရသော' },
  'about.innovation': { en: 'Innovation Focus', mm: 'ဆန်းသစ်တီထွင်မှု အာရုံစိုက်မှု' },
  'about.innovationDesc': { en: 'Leveraging cutting-edge technology to enhance your property journey', mm: 'သင်၏ အိမ်ခြံမြေခရီးကို မြှင့်တင်ရန် အဆင့်မြင့် နည်းပညာကို အသုံးပြုခြင်း' },
  
  // Carousel
  'carousel.villa': { en: 'Modern Luxury Villa', mm: 'ခေတ်မီဇိမ်ခံ အိမ်ကြီး' },
  'carousel.villaDesc': { en: 'Stunning contemporary architecture with premium amenities', mm: 'အဆင့်မြင့် အဆောက်အအုံနှင့် ထူးခြားလှပသော ခေတ်မီဗိသုကာ' },
  'carousel.apartment': { en: 'Urban Apartment', mm: 'မြို့တွင်း တိုက်ခန်း' },
  'carousel.apartmentDesc': { en: 'City living at its finest with modern conveniences', mm: 'ခေတ်မီအဆင်ပြေမှုများဖြင့် မြို့တွင်းနေထိုင်မှု အကောင်းဆုံး' },
  'carousel.office': { en: 'Commercial Office Space', mm: 'စီးပွားရေး ရုံးခန်း' },
  'carousel.officeDesc': { en: 'Prime business location for your success', mm: 'သင်၏အောင်မြင်မှုအတွက် အကောင်းဆုံး စီးပွားရေးတည်နေရာ' },
  'carousel.estate': { en: 'Luxury Estate with Pool', mm: 'ရေကူးကန်ပါ ဇိမ်ခံအိမ်' },
  'carousel.estateDesc': { en: 'Resort-style living with exclusive amenities', mm: 'သီးသန့် အဆောက်အအုံများဖြင့် အပန်းဖြေစခန်းပုံစံ နေထိုင်မှု' },
  'carousel.condo': { en: 'Downtown Condominium', mm: 'မြို့လယ်ခေါင် ကွန်ဒို' },
  'carousel.condoDesc': { en: 'Modern urban lifestyle in the heart of the city', mm: 'မြို့၏ နှလုံးသားတွင် ခေတ်မီမြို့ပြဘဝပုံစံ' },
  'carousel.scrollDown': { en: 'Scroll Down', mm: 'အောက်သို့ဆွဲကြည့်ရန်' },
  
  // Companies
  'companies.title': { en: 'Real Estate Companies', mm: 'အိမ်ခြံမြေကုမ္ပဏီများ' },
  'companies.subtitle': { en: 'Browse verified property companies', mm: 'အတည်ပြုထားသော အိမ်ခြံမြေကုမ္ပဏီများကို ကြည့်ရှုပါ' },
  'companies.search': { en: 'Search companies...', mm: 'ကုမ္ပဏီများရှာဖွေရန်...' },
  'companies.verified': { en: 'Verified', mm: 'အတည်ပြုပြီး' },
  'companies.properties': { en: 'properties', mm: 'အိမ်ခြံမြေများ' },
  'companies.viewProperties': { en: 'View Properties', mm: 'အိမ်ခြံမြေများကြည့်ရန်' },
  'companies.contact': { en: 'Contact', mm: 'ဆက်သွယ်ရန်' },
  'companies.noResults': { en: 'No Companies Found', mm: 'ကုမ္ပဏီများမတွေ့ပါ' },
  'companies.noResultsDesc': { en: 'Try adjusting your search criteria', mm: 'သင့်ရှာဖွေမှုစံနှုန်းများကို ပြင်ဆင်ကြည့်ပါ' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}