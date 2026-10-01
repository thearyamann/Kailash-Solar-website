import React from 'react';

const TrustStrip = () => {
  return (
    <section className="bg-white border-b border-slate-100 py-6 md:py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 opacity-80">
          
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest text-center md:text-left">
            Trusted &<br className="hidden md:block" /> Certified By
          </div>

          <div className="hidden md:block w-[1px] h-10 bg-slate-200" />

          <div className="flex items-center flex-wrap justify-center gap-8 md:gap-16">
            {/* MNRE */}
            <img 
              src="/mnre-logo.svg" 
              alt="MNRE Approved" 
              loading="lazy"
              className="h-10 md:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105"
            />
            
            {/* ISO */}
            <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all duration-300 cursor-default hover:scale-105">
              <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-slate-800 rounded-full flex items-center justify-center">
                <span className="text-[12px] md:text-[14px] font-bold text-slate-800">ISO</span>
              </div>
              <div className="text-slate-700 text-[10px] md:text-[11px] font-semibold leading-tight tracking-widest uppercase">
                Certified<br/>Company
              </div>
            </div>

            {/* Future Logo */}
            <div className="h-10 md:h-12 px-6 border-2 border-slate-300 border-dashed rounded flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-wider hover:scale-105 transition-transform">
              Partner Logo
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
