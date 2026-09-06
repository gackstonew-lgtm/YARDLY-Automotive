import React from 'react';
import { Link } from 'react-router-dom';
import { Info, ArrowRight, ShieldCheck, CheckCircle2, Award, HeartHandshake } from 'lucide-react';
import { Reveal } from '../motion/Reveal';
import { Button } from '../ui/Button';

export const AboutSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#001A13] border-b border-[rgba(180,255,210,0.1)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          
          <Reveal direction="up" className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002B1F] border border-[rgba(180,255,210,0.15)] text-xs font-extrabold uppercase tracking-wider text-[#00E878]">
              <Info className="w-3.5 h-3.5 text-[#00E878]" />
              <span>Driven By Quality. Built Around You.</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#F2F7F3] leading-tight">
              About Yardly Automotives
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#8EA79C] leading-relaxed text-left sm:text-center max-w-3xl mx-auto">
              <p>
                Yardly Automotives is built around a simple idea: making automotive services easier to discover, access and manage.
              </p>
              <p>
                From buying and selling vehicles to importation, trade-ins, auctions, vehicle hire, automotive spares, accessories, tracking and dealership marketing, our platform brings multiple automotive services together in one convenient digital experience.
              </p>
              <p>
                Our focus is on clear information, convenient access and a customer experience that helps people make confident automotive decisions.
              </p>
            </div>
          </Reveal>

          {/* Three Foundational Pillars */}
          <Reveal direction="up" delay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-left">
              <div className="bg-[#00251B] p-6 rounded-3xl border border-[rgba(180,255,210,0.12)] space-y-3 shadow-lg">
                <div className="w-10 h-10 rounded-2xl bg-[#003D2D] text-[#00E878] border border-[rgba(180,255,210,0.15)] flex items-center justify-center font-black">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-[#F2F7F3]">Quality-Focused</h3>
                <p className="text-xs text-[#8EA79C] leading-relaxed">
                  We present vehicles with clear information and verified specifications to help you make confident choices.
                </p>
              </div>

              <div className="bg-[#00251B] p-6 rounded-3xl border border-[rgba(180,255,210,0.12)] space-y-3 shadow-lg">
                <div className="w-10 h-10 rounded-2xl bg-[#003D2D] text-[#00E878] border border-[rgba(180,255,210,0.15)] flex items-center justify-center font-black">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-[#F2F7F3]">Customer-First Service</h3>
                <p className="text-xs text-[#8EA79C] leading-relaxed">
                  Your needs come first, from your first enquiry to your final decision, with dedicated support at every step.
                </p>
              </div>

              <div className="bg-[#00251B] p-6 rounded-3xl border border-[rgba(180,255,210,0.12)] space-y-3 shadow-lg">
                <div className="w-10 h-10 rounded-2xl bg-[#003D2D] text-[#00E878] border border-[rgba(180,255,210,0.15)] flex items-center justify-center font-black">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-[#F2F7F3]">Transparent Information</h3>
                <p className="text-xs text-[#8EA79C] leading-relaxed">
                  We make it easier to understand the vehicles and options available to you with straightforward guidance.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.25} className="pt-2">
            <Link to="/about">
              <Button variant="outline" className="font-extrabold bg-[#00251B] border-[rgba(180,255,210,0.25)] text-[#F2F7F3] hover:border-[#00E878] hover:text-[#00E878] inline-flex items-center gap-2">
                <span>Discover Yardly Automotives</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Reveal>

        </div>
      </div>
    </section>
  );
};
