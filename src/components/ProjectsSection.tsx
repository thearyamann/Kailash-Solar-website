"use client";
import { useState } from 'react';
import { Star, Quote, Home, Building2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import project1 from '@/assets/solar-project-1.jpg';
import project2 from '@/assets/solar-project-2.jpg';
import project3 from '@/assets/solar-project-3.jpg';
import residential1 from '@/assets/residential-1.webp';
import residential2 from '@/assets/residential-2.webp';
import residential3 from '@/assets/residential-3.jpg';
import { BookVisitModal } from '@/components/BookVisitModal';

type Category = 'all' | 'residential' | 'ci';

const ProjectsSection = () => {
  const [filter, setFilter] = useState<Category>('all');

  const projects = [
    {
      category: 'residential' as const,
      image: residential1,
      title: 'Family Home — 3 kW Rooftop',
      location: 'Meerut, UP',
      capacity: '3 kWp',
      annualSavings: '₹42,000',
      payback: '4 Years',
      testimonial: 'Kailash Solar handled the entire PM Surya Ghar subsidy paperwork. Our monthly bill is now near zero — couldn\'t be happier.',
      clientName: 'Sandeep Verma',
      clientRole: 'Homeowner',
    },
    {
      category: 'ci' as const,
      image: project1,
      title: 'Tyre Manufacturing Unit',
      location: 'Meerut, UP',
      capacity: '250 kWp',
      annualSavings: '₹28 Lakhs',
      payback: '3.8 Years',
      testimonial: 'Kailash Solar delivered exceptional quality. Our electricity bills dropped by 75% and the installation was completed ahead of schedule.',
      clientName: 'Rajesh Gupta',
      clientRole: 'Factory Owner',
    },
    {
      category: 'residential' as const,
      image: residential2,
      title: 'Villa Rooftop — 5 kW System',
      location: 'Modipuram, Meerut',
      capacity: '5 kWp',
      annualSavings: '₹72,000',
      payback: '3.9 Years',
      testimonial: 'Professional team, clean installation, and they got us the full UPNEDA + central subsidy. Highly recommended.',
      clientName: 'Neha Aggarwal',
      clientRole: 'Homeowner',
    },
    {
      category: 'ci' as const,
      image: project2,
      title: 'Cold Storage Facility',
      location: 'Ghaziabad, UP',
      capacity: '180 kWp',
      annualSavings: '₹22 Lakhs',
      payback: '4.2 Years',
      testimonial: 'The team understood our high-consumption needs perfectly. Professional execution and great post-installation support.',
      clientName: 'Amit Sharma',
      clientRole: 'Managing Director',
    },
    {
      category: 'residential' as const,
      image: residential3,
      title: 'Bungalow Rooftop — 2 kW',
      location: 'Shastri Nagar, Meerut',
      capacity: '2 kWp',
      annualSavings: '₹28,000',
      payback: '4.5 Years',
      testimonial: 'Got ₹90,000 in combined subsidy. The whole process was hands-off for us — exactly as promised.',
      clientName: 'Pooja Mittal',
      clientRole: 'Homeowner',
    },
    {
      category: 'ci' as const,
      image: project3,
      title: 'Pharma Manufacturing Plant',
      location: 'Haridwar, Uttarakhand',
      capacity: '500 kWp',
      annualSavings: '₹52 Lakhs',
      payback: '3.5 Years',
      testimonial: 'One of the best decisions we made for our business. Kailash Solar\'s expertise in industrial projects is unmatched.',
      clientName: 'Dr. Priya Singh',
      clientRole: 'CEO',
    },
  ];

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-24 bg-background border-t border-border/50 relative overflow-hidden">
      <div className="container-custom relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-5 py-2 mb-6 border border-primary/20">
            <Star className="w-4 h-4" />
            <span className="font-bold uppercase tracking-widest text-[11px]">Our Portfolio</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-montserrat tracking-tight leading-tight">
            Powering Homes & Industries <br className="hidden sm:block" />
            <span className="text-primary">Across North India</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            From PM Surya Ghar home rooftops to multi-megawatt industrial plants — see how we've helped families and businesses go completely solar.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            className={`rounded-full px-6 h-12 font-bold transition-all ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/5'}`}
            onClick={() => setFilter('all')}
          >
            All Projects
          </Button>
          <Button 
            variant={filter === 'residential' ? 'default' : 'outline'} 
            className={`rounded-full px-6 h-12 font-bold transition-all ${filter === 'residential' ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/5'}`}
            onClick={() => setFilter('residential')}
          >
            <Home className="w-4 h-4 mr-2" /> Residential
          </Button>
          <Button 
            variant={filter === 'ci' ? 'default' : 'outline'} 
            className={`rounded-full px-6 h-12 font-bold transition-all ${filter === 'ci' ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/5'}`}
            onClick={() => setFilter('ci')}
          >
            <Building2 className="w-4 h-4 mr-2" /> Commercial & Industrial
          </Button>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project, index) => (
            <BookVisitModal key={index}>
              <div className="flex flex-col bg-card border border-border rounded-[2rem] overflow-hidden group hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 cursor-pointer text-left h-full">
                
                {/* Project Image */}
                <div className="relative h-60 overflow-hidden bg-muted flex-shrink-0">
                  <img 
                    src={project.image.src} 
                    alt={project.title} 
                    loading="lazy" 
                    decoding="async" 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                  />
                  <div className="absolute top-5 right-5 bg-accent text-accent-foreground px-4 py-1.5 rounded-xl text-sm font-bold shadow-lg">
                    {project.capacity}
                  </div>
                  <div className="absolute top-5 left-5 bg-background/90 backdrop-blur-sm text-foreground px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-border/50">
                    {project.category === 'residential' ? 'Residential' : 'C&I'}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-8 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-foreground mb-2 font-montserrat leading-tight group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center text-muted-foreground text-sm mb-6 font-medium">
                    <MapPin className="w-4 h-4 mr-1 text-primary/70" />
                    {project.location}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-8 p-5 bg-primary/5 border border-primary/10 rounded-2xl">
                    <div>
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Savings</div>
                      <div className="text-lg font-bold text-accent">{project.annualSavings}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Payback</div>
                      <div className="text-lg font-bold text-primary">{project.payback}</div>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="relative flex-grow flex flex-col justify-between mt-auto">
                    <Quote className="absolute -top-3 -left-2 w-8 h-8 text-primary/10 -z-10" />
                    <p className="text-muted-foreground text-sm italic leading-relaxed mb-6 z-10 relative">
                      "{project.testimonial}"
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm font-montserrat">
                          {project.clientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-sm font-montserrat">{project.clientName}</div>
                        <div className="text-xs text-muted-foreground font-medium">{project.clientRole}</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </BookVisitModal>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default ProjectsSection;