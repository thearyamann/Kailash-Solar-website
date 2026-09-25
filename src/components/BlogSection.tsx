import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import pmSuryaGharHero from '@/assets/pm-surya-ghar-meerut-hero.webp';

const BlogSection = () => {
  const posts = [
    {
      title: 'Solar Panel Loan in Meerut: EMI, SBI & PNB Loan Options',
      excerpt:
        'Learn how to finance a 3kW, 4kW, or 5kW solar system in Meerut. Compare bank loans, calculate EMI, and understand how the PM Surya Ghar subsidy works.',
      category: 'Financing',
      readTime: '15 min read',
      href: '/blog/solar-panel-loan-meerut',
      image: { src: '/loansolar.png' },
    },
    {
      title: 'How to Get PM Surya Ghar Subsidy in Meerut (Step-by-Step Guide 2025)',
      excerpt:
        'Claim up to ₹1,08,000 in combined central + UP state subsidy. Eligibility, documents, PVVNL net metering, and the full step-by-step process for Meerut homeowners.',
      category: 'PM Surya Ghar',
      readTime: '12 min read',
      href: '/blog/pm-surya-ghar-subsidy-meerut',
      image: pmSuryaGharHero,
    },
    {
      title: 'Solar Panel Price in Meerut (2026): Costs, Subsidies & ROI Complete Guide',
      excerpt:
        'Discover the exact solar panel cost in Meerut for residential and commercial systems. Learn how to calculate your savings and choose the right system size.',
      category: 'Pricing Guide',
      readTime: '15 min read',
      href: '/blog/solar-panel-price-meerut',
      image: { src: '/priceflyer.png' },
    },
    {
      title: 'Why Kailash Solar Is a Leading Solar Company in Meerut',
      excerpt:
        'Discover why hundreds of Meerut homeowners choose Kailash Solar for premium panels, expert in-house installation, and seamless PM Surya Ghar subsidy support.',
      category: 'Meerut Guide',
      readTime: '10 min read',
      href: '/blog/best-solar-company-in-meerut',
      image: { src: '/Happyfamily.png' },
    },
    {
      title: '3kW vs 5kW Solar System in Meerut: Price, Subsidy & Guide',
      excerpt:
        'Deciding between a 3kW and 5kW solar system? Compare prices, PM Surya Ghar subsidy, generation, roof space, and find the right size based on your bill.',
      category: 'System Sizing',
      readTime: '12 min read',
      href: '/blog/3kw-vs-5kw-solar-system-meerut',
      image: { src: '/van.png' }, // placeholder image
    },
    {
      title: 'Powering Meerut with Solar: How Kailash Solar Is Helping Homes Save',
      excerpt:
        'See how Kailash Solar is helping homes in Meerut switch to rooftop solar, reduce electricity bills, and make solar installation simple with easy options.',
      category: 'Solar Guide',
      readTime: '8 min read',
      href: '/blog/powering-meerut-with-solar-kailash-solar',
      image: { src: '/vaniimage.png' },
    },
    {
      title: 'How to Choose the Right Solar Panel for Your Home in Meerut',
      excerpt:
        'A complete guide for Meerut homeowners on choosing the best solar panels. Learn about efficiency, warranty, types, and how to select a reliable installer.',
      category: 'Buying Guide',
      readTime: '10 min read',
      href: '/blog/how-to-choose-solar-panels-home-meerut',
      image: { src: '/solarpanelbest.png' },
    }
  ];

  return (
    <section className="py-24 bg-background border-t border-border/50 relative overflow-hidden">
      <div className="container-custom relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-5 py-2 mb-6 border border-primary/20">
              <BookOpen className="w-4 h-4" />
              <span className="font-bold uppercase tracking-widest text-[11px]">Solar Insights</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-montserrat tracking-tight leading-tight">
              Learn About <br className="hidden md:block" />
              <span className="text-accent">Solar Energy</span>
            </h2>
            <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
              Expert guides, industry insights, and practical tips to help you make highly informed decisions about your solar investment.
            </p>
          </div>
          <Button asChild className="h-14 px-8 rounded-xl font-bold bg-foreground hover:bg-primary text-background transition-all duration-300">
            <a href="/blog/pm-surya-ghar-subsidy-meerut" target="_blank" rel="noopener noreferrer">
              View All Guides
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
        </div>

        {/* Scalable Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <a key={index} href={post.href} target="_blank" rel="noopener noreferrer" className="block focus:outline-none group h-full">
              <div className="h-full flex flex-col bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                
                {/* Image Area with Floating Badges */}
                <div className="relative h-60 overflow-hidden bg-muted flex-shrink-0">
                  {(post as any).isVideo ? (
                    <video
                      src={post.image.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <img
                      src={post.image.src}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  )}
                  <div className="absolute top-5 left-5 flex gap-2 z-10">
                    <span className="bg-background/90 backdrop-blur-sm text-foreground font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg border border-border shadow-sm">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                {/* Content Area */}
                <div className="p-8 flex-grow flex flex-col bg-card group-hover:bg-primary/5 transition-colors duration-500">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-bold uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      {post.readTime}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-4 font-montserrat leading-tight group-hover:text-primary transition-colors duration-300">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-grow">
                    {post.excerpt}
                  </p>
                  
                  <div className="inline-flex items-center gap-2 text-primary font-bold text-sm group-hover:translate-x-2 transition-transform duration-300 mt-auto">
                    <span className="border-b-2 border-transparent group-hover:border-primary pb-0.5 transition-colors">
                      Read Guide
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

              </div>
            </a>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default BlogSection;
