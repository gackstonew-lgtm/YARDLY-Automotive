import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ArrowRight, Package, ShieldCheck, Check } from 'lucide-react';
import { Reveal } from '../motion/Reveal';
import { StaggerContainer, StaggerItem } from '../motion/Stagger';
import { Button } from '../ui/Button';

export const SparesAccessoriesSection: React.FC = () => {
  const products = [
    {
      title: 'Brake Rotors & Ceramic Pads',
      category: 'Braking Systems',
      image: '/spares/brakes.jpg',
      desc: 'Ventilated slotted rotors and low-dust ceramic pads engineered for high stopping power.',
    },
    {
      title: 'Engine Filters & Spark Plugs',
      category: 'Engine Maintenance',
      image: '/spares/filters_plugs.jpg',
      desc: 'Synthetic oil filters, high-flow air intake elements, and platinum iridium spark plugs.',
    },
    {
      title: 'Diamond-Cut Alloy Wheels',
      category: 'Wheels & Tyres',
      image: '/spares/wheels_tyres.jpg',
      desc: 'Precision machined lightweight alloy wheels fitted with high-performance sport tyres.',
    },
    {
      title: '12V Sealed AGM Batteries',
      category: 'Electrical & Power',
      image: '/spares/battery.jpg',
      desc: 'Heavy-duty maintenance-free automotive batteries with high cold cranking performance.',
    },
    {
      title: 'LED Projector Headlight Units',
      category: 'Lighting & Electronics',
      image: '/spares/lighting.jpg',
      desc: 'High-intensity LED projector assemblies with crystal daylight running lamps.',
    },
    {
      title: 'Custom Diamond-Stitched Mats',
      category: 'Interior Accessories',
      image: '/spares/interior.jpg',
      desc: 'Tailored 7D waterproof floor mats, leather key fobs, and interior protection essentials.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#001711] border-b border-[rgba(180,255,210,0.1)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <Reveal direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[rgba(180,255,210,0.12)] pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002B1F] border border-[rgba(180,255,210,0.15)] text-xs font-extrabold uppercase tracking-wider text-[#00E878]">
                <Wrench className="w-3.5 h-3.5 text-[#00E878]" />
                <span>Genuine Auto Parts & Upgrades</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#F2F7F3]">
                Quality Spares & Accessories
              </h2>
              <p className="text-sm sm:text-base text-[#8EA79C]">
                Find the parts, accessories and automotive essentials you need to keep your vehicle ready for the road.
              </p>
            </div>

            <Link to="/accessories" className="shrink-0">
              <Button variant="primary" className="font-extrabold shadow-md flex items-center gap-2">
                <span>Shop Spares & Accessories</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Reveal>

        {/* Professional Commercial Product Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item, idx) => (
            <StaggerItem key={idx}>
              <div className="bg-[#00251B] rounded-3xl border border-[rgba(180,255,210,0.12)] overflow-hidden shadow-lg hover-lift group h-full flex flex-col justify-between">
                <div>
                  <div className="relative h-52 sm:h-60 overflow-hidden bg-[#00140F]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#00251B] via-transparent to-transparent opacity-60" />
                    
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#001A13]/85 backdrop-blur-md border border-[rgba(180,255,210,0.2)] text-[11px] font-extrabold text-[#00E878]">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-extrabold text-[#F2F7F3] group-hover:text-[#00E878] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#8EA79C] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-[rgba(180,255,210,0.08)] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#A7BDB3]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00E878]" />
                    <span>Verified Fitment</span>
                  </div>
                  <Link
                    to="/accessories"
                    className="text-xs font-black text-[#00E878] hover:text-[#55FF78] inline-flex items-center gap-1"
                  >
                    <span>Inquire</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>
    </section>
  );
};
