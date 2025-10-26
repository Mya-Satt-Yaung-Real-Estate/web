import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFAQs } from '@/hooks/queries/useFAQ';
import { SEOHead } from '@/components/seo/SEOHead';

interface FAQItemProps {
  faq: {
    id: number;
    question_en: string;
    question_mm: string;
    answer_en: string;
    answer_mm: string;
  };
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem = ({ faq, isOpen, onToggle }: FAQItemProps) => {
  const { language } = useLanguage();

  const question = language === 'mm' 
    ? (faq.question_mm || faq.question_en)
    : (faq.question_en || faq.question_mm);
  
  const answer = language === 'mm' 
    ? (faq.answer_mm || faq.answer_en)
    : (faq.answer_en || faq.answer_mm);

  return (
    <div className="border-b last:border-b-0">
      <Button
        variant="ghost"
        onClick={onToggle}
        className="w-full justify-between p-4 text-left transition-all outline-none hover:bg-transparent hover:text-inherit"
      >
        <span className="text-sm font-medium pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </Button>
      {isOpen && (
        <div className="px-4 pb-4">
          <p className="text-muted-foreground text-sm">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default function FAQ() {
  const { language } = useLanguage();
  const { data: faqData, isLoading, error } = useFAQs();
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };


  const filteredFAQs = faqData?.data?.filter(faq => {
    if (!searchTerm) return true;
    const question = language === 'mm' 
      ? (faq.question_mm || faq.question_en)
      : (faq.question_en || faq.question_mm);
    const answer = language === 'mm' 
      ? (faq.answer_mm || faq.answer_en)
      : (faq.answer_en || faq.answer_mm);
    
    return question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           answer.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <SEOHead 
          seo={{
            title: "FAQ",
            description: "Frequently Asked Questions",
            keywords: "FAQ, frequently asked questions, help, support",
            image: "/jade.png",
            type: "website"
          }}
          path="/faq"
        />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-[#4a9b82] mb-4">
                <HelpCircle className="h-8 w-8 text-white animate-pulse" />
              </div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                FAQ
              </h1>
              <p className="text-muted-foreground mt-2">Loading frequently asked questions...</p>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="border-0 shadow-sm bg-white">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <SEOHead 
          seo={{
            title: "FAQ",
            description: "Frequently Asked Questions",
            keywords: "FAQ, frequently asked questions, help, support",
            image: "/jade.png",
            type: "website"
          }}
          path="/faq"
        />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 mb-4">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent">
              FAQ
            </h1>
            <p className="text-muted-foreground mt-2 mb-8">Unable to load frequently asked questions.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-lg gradient-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SEOHead 
        seo={{
          title: "FAQ",
          description: "Frequently Asked Questions",
          keywords: "FAQ, frequently asked questions, help, support",
          image: "/jade.png",
          type: "website"
        }}
        path="/faq"
      />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-[#4a9b82] mb-4">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
              FAQ
            </h1>
            <p className="text-muted-foreground mt-2">
              {language === 'mm' 
                ? 'အမေးများသော မေးခွန်းများ'
                : 'Find answers to commonly asked questions'
              }
            </p>
          </div>

        {/* Search Bar */}
        <Card className="glass border-border/50 p-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={language === 'mm' 
                ? 'မေးခွန်းများကို ရှာဖွေရန်...'
                : 'Search for answers...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

          {/* FAQ Items */}
          <Card className="glass border-border/50 p-6">
            <div className="space-y-4">
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-base font-semibold mb-2">
                    {language === 'mm' ? 'မေးခွန်းမတွေ့ရှိပါ' : 'No questions found'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'mm' 
                      ? 'သင့်ရှာဖွေမှုနှင့်ကိုက်ညီသော မေးခွန်းများ မတွေ့ရှိပါ။'
                      : 'No questions match your search criteria.'
                    }
                  </p>
                </div>
              ) : (
                filteredFAQs.map((faq) => (
                  <FAQItem
                    key={faq.id}
                    faq={faq}
                    isOpen={openItems.has(faq.id)}
                    onToggle={() => toggleItem(faq.id)}
                  />
                ))
              )}
            </div>
          </Card>

          {/* Contact Support */}
          <Card className="glass border-border/50 p-6 mt-8 text-center">
            <h3 className="mb-2">
              {language === 'mm' ? 'အခြားမေးခွန်းများရှိပါသလား?' : 'Still have questions?'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {language === 'mm' 
                ? 'ကျွန်ုပ်တို့၏အဖွဲ့သားများနှင့် ဆက်သွယ်ပြီး သင့်မေးခွန်းများကို ဖြေကြားပေးပါမည်။'
                : 'Our support team is here to help you'
              }
            </p>
            <button className="px-6 py-2 rounded-lg gradient-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all">
              {language === 'mm' ? 'ဆက်သွယ်ရန်' : 'Contact Support'}
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
