import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Gavel, Clock, ArrowUpRight, ShieldCheck, AlertCircle, CheckCircle2, User, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { AuctionService } from '../lib/auctions/auction.service';
import { AuthService } from '../lib/auth/auth.service';
import type { AuthUser } from '../lib/auth/session';
import { Auction, AuctionBid, Vehicle } from '../types/database';
import { getVehiclePrimaryImage } from '../lib/utils/imageResolver';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../lib/hooks/useSEO';
import { siteConfig } from '../config/site';

export const AuctionMarketplace: React.FC = () => {
  useSEO({
    title: 'Vehicle Auctions & Live Bidding | Yardly Automotives',
    description: 'Participate in verified live automotive auctions across Kenya. Transparent bidding, verified yard vehicles, and instant notifications.',
    canonical: `${siteConfig.url}/auction`
  });

  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'ending_soon' | 'upcoming' | 'ended'>('all');
  
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [bidAmountInput, setBidAmountInput] = useState<number>(0);
  const [biddingLoading, setBiddingLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadAuctions = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);

      const list = await AuctionService.getAll();
      setAuctions(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuctions();
    const interval = setInterval(loadAuctions, 10000); // Live sync every 10s
    return () => clearInterval(interval);
  }, []);

  const filteredAuctions = auctions.filter(a => {
    if (activeTab === 'all') return true;
    return a.status === activeTab;
  });

  const handleOpenAuction = (auc: Auction) => {
    setSelectedAuction(auc);
    setBidAmountInput(auc.current_bid + (auc.minimum_increment || 10000));
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentUser) {
      setErrorMsg('You must be signed in as a buyer to place a bid.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (!selectedAuction) return;

    setBiddingLoading(true);

    try {
      const res = await AuctionService.placeBid(selectedAuction.id, currentUser, bidAmountInput);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to place bid.');
      } else {
        setSuccessMsg(`Congratulations! Your bid of KES ${bidAmountInput.toLocaleString()} was placed successfully.`);
        await loadAuctions();
        if (res.auction) {
          setSelectedAuction({
            ...selectedAuction,
            current_bid: res.auction.current_bid,
            bid_count: res.auction.bid_count,
            bids: res.auction.bids
          });
          setBidAmountInput(res.auction.current_bid + (res.auction.minimum_increment || 10000));
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An unexpected error occurred while processing your bid.');
    } finally {
      setBiddingLoading(false);
    }
  };

  const formatCountdown = (endTimeStr: string) => {
    const diff = new Date(endTimeStr).getTime() - new Date().getTime();
    if (diff <= 0) return 'Ended';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#050505] text-[#0F241C] dark:text-[#F2F7F3] flex flex-col font-sans selection:bg-[#0251B8] dark:selection:bg-[#2D7DFF] selection:text-[#050505]">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#EDF5F1] via-[#E4EFEA] to-[#DBE9E2] dark:from-[#000000] dark:via-[#121212] dark:to-[#0A0A0A] border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] text-[#0F241C] dark:text-[#F2F7F3] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2D7DFF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0251B8]/10 dark:bg-[#2D7DFF]/10 border border-[#0251B8]/20 dark:border-[#2D7DFF]/30 text-xs font-extrabold uppercase tracking-wider text-[#0251B8] dark:text-[#2D7DFF] mb-3">
              <Gavel className="w-4 h-4 text-[#0251B8] dark:text-[#2D7DFF]" />
              <span>LIVE AUTOMOTIVE AUCTIONS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F241C] dark:text-[#F2F7F3]">
              Yardly Verified Vehicle Auctions
            </h1>
            <p className="text-sm text-[#355347] dark:text-[#8EA79C] mt-1 max-w-xl">
              Bid with confidence on inspected vehicles from certified Kenyan car yards and direct importers with transparent reserve prices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white dark:bg-[#0A0A0A] backdrop-blur-md px-5 py-3 rounded-2xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.15)] text-center shadow-sm">
              <div className="text-2xl font-black text-[#0251B8] dark:text-[#2D7DFF]">{auctions.filter(a => a.status === 'live' || a.status === 'ending_soon').length}</div>
              <div className="text-[10px] font-bold uppercase text-[#355347] dark:text-[#8EA79C]">Live Auctions</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-8 w-full flex-grow">
        
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] pb-4 mb-8">
          {(['all', 'live', 'ending_soon', 'upcoming', 'ended'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#0251B8] dark:bg-[#2D7DFF] text-white dark:text-[#050505] shadow-md'
                  : 'bg-white dark:bg-[#0A0A0A] text-[#355347] dark:text-[#8EA79C] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.2)] hover:border-[#0251B8] dark:hover:border-[#2D7DFF] hover:text-[#0F241C] dark:hover:text-[#F2F7F3]'
              }`}
            >
              {tab.replace('_', ' ')} ({auctions.filter(a => tab === 'all' || a.status === tab).length})
            </button>
          ))}
        </div>

        {/* Auctions Grid */}
        {filteredAuctions.length === 0 ? (
          <div className="bg-white dark:bg-[#121212]/90 backdrop-blur-md rounded-3xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.15)] p-12 text-center space-y-3 shadow-sm">
            <Gavel className="w-12 h-12 text-[#0251B8] dark:text-[#2D7DFF] mx-auto opacity-40" />
            <h3 className="text-lg font-bold text-[#0F241C] dark:text-[#F2F7F3]">No auctions found in this category</h3>
            <p className="text-xs text-[#355347] dark:text-[#8EA79C]">Check back soon for newly published verified auctions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map((auc) => {
              const v = auc.vehicle;
              const primaryImg = v ? (getVehiclePrimaryImage(v)?.image_url || '/logo.jpeg') : '/logo.jpeg';
              
              return (
                <div key={auc.id} className="group bg-white dark:bg-[#121212]/90 backdrop-blur-md rounded-3xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.15)] shadow-sm dark:shadow-glass hover:shadow-lg dark:hover:shadow-glass-hover hover:border-[#0251B8]/40 dark:hover:border-[#2D7DFF]/40 transition-all duration-300 overflow-hidden flex flex-col hover-lift">
                  
                  {/* Image & Status Badge */}
                  <div className="relative h-48 bg-[#EDF5F1] dark:bg-[#0A0A0A] overflow-hidden">
                    <img
                      src={primaryImg}
                      alt={v ? `${v.make} ${v.model}` : 'Auction Vehicle'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge variant={auc.status === 'ending_soon' ? 'warning' : auc.status === 'live' ? 'success' : 'secondary'}>
                        {auc.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>

                    {auc.status !== 'ended' && (
                      <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-[#000000]/90 backdrop-blur-md text-[#0F241C] dark:text-[#F2F7F3] text-[11px] font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.15)]">
                        <Clock className="w-3.5 h-3.5 text-[#0251B8] dark:text-[#2D7DFF]" />
                        <span>{formatCountdown(auc.end_time)}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-xs font-bold text-[#355347] dark:text-[#8EA79C] uppercase">
                        {v?.year} • {v?.location || 'Nairobi'} • {v?.mileage.toLocaleString()} KM
                      </div>
                      <h3 className="text-lg font-black text-[#0F241C] dark:text-[#F2F7F3] mt-0.5 group-hover:text-[#0251B8] dark:group-hover:text-[#2D7DFF] transition-colors">
                        {v ? `${v.make} ${v.model} ${v.variant || ''}` : `Auction #${auc.id}`}
                      </h3>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#F4F8F6] dark:bg-[#0A0A0A] border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-[#355347] dark:text-[#8EA79C] uppercase">Current High Bid</div>
                        <div className="text-xl font-black text-[#0251B8] dark:text-[#2D7DFF]">
                          KES {auc.current_bid.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-[#355347] dark:text-[#8EA79C] uppercase">Total Bids</div>
                        <div className="text-sm font-extrabold text-[#0F241C] dark:text-[#F2F7F3]">{auc.bid_count || 0} bids</div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleOpenAuction(auc)}
                      fullWidth
                      className="font-extrabold py-2.5 btn-glow"
                      icon={<Gavel className="w-4 h-4" />}
                    >
                      {auc.status === 'ended' ? 'View Auction Results' : 'Place Bid Now'}
                    </Button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Auction Detail & Bidding Modal */}
      {selectedAuction && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#121212] rounded-3xl border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.2)] max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-8 text-[#0F241C] dark:text-[#F2F7F3]">
            
            <button
              onClick={() => setSelectedAuction(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F4F8F6] dark:bg-[#0A0A0A] border border-[rgba(0,60,40,0.12)] dark:border-[rgba(255, 255, 255,0.2)] text-[#0F241C] dark:text-[#F2F7F3] font-bold flex items-center justify-center hover:bg-[#E4EFEA] dark:hover:bg-[#1A1A1A] transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div>
              <div className="flex items-center gap-2">
                <Badge variant={selectedAuction.status === 'ending_soon' ? 'warning' : 'success'}>
                  {selectedAuction.status.toUpperCase()}
                </Badge>
                <span className="text-xs font-mono text-[#355347] dark:text-[#8EA79C]">Time remaining: {formatCountdown(selectedAuction.end_time)}</span>
              </div>
              <h2 className="text-2xl font-black text-[#0F241C] dark:text-[#F2F7F3] mt-1">
                {selectedAuction.vehicle ? `${selectedAuction.vehicle.year} ${selectedAuction.vehicle.make} ${selectedAuction.vehicle.model}` : 'Auction Details'}
              </h2>
            </div>

            {/* Bidding Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F4F8F6] dark:bg-[#0A0A0A] border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)]">
              <div>
                <div className="text-[10px] font-bold text-[#355347] dark:text-[#8EA79C] uppercase">Current High Bid</div>
                <div className="text-lg font-black text-[#0251B8] dark:text-[#2D7DFF]">KES {selectedAuction.current_bid.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#355347] dark:text-[#8EA79C] uppercase">Min Increment</div>
                <div className="text-sm font-bold text-[#0F241C] dark:text-[#F2F7F3]">KES {(selectedAuction.minimum_increment || 10000).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#355347] dark:text-[#8EA79C] uppercase">Next Min Bid</div>
                <div className="text-sm font-extrabold text-[#0251B8] dark:text-[#2D7DFF]">
                  KES {(selectedAuction.current_bid + (selectedAuction.minimum_increment || 10000)).toLocaleString()}
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-500/30 text-xs font-semibold text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 dark:text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-[#EBF2FC] dark:bg-[#2D7DFF]/15 border border-[#0251B8]/30 dark:border-[#2D7DFF]/30 text-xs font-semibold text-[#0251B8] dark:text-[#2D7DFF] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#0251B8] dark:text-[#2D7DFF]" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Place Bid Form */}
            {selectedAuction.status !== 'ended' && selectedAuction.status !== 'cancelled' && (
              <form onSubmit={handlePlaceBid} className="space-y-4">
                <Input
                  label="Your Bid Amount (KES) *"
                  type="number"
                  value={bidAmountInput}
                  onChange={(e) => setBidAmountInput(parseInt(e.target.value) || 0)}
                  required
                />
                <Button type="submit" fullWidth loading={biddingLoading} className="font-extrabold py-3 btn-glow">
                  Submit Official Bid
                </Button>
              </form>
            )}

            {/* Recent Bid History */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#355347] dark:text-[#8EA79C] mb-2">Bid History Log</h4>
              <div className="max-h-40 overflow-y-auto space-y-2 border-t border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] pt-2">
                {selectedAuction.bids && selectedAuction.bids.length > 0 ? (
                  selectedAuction.bids.map((b: AuctionBid) => (
                    <div key={b.id} className="p-2.5 rounded-xl bg-[#F4F8F6] dark:bg-[#0A0A0A] border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.1)] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#0F241C] dark:text-[#F2F7F3]">{b.buyer_name}</span>
                        <span className="text-[10px] text-[#355347] dark:text-[#8EA79C] ml-2">{new Date(b.created_at).toLocaleTimeString()}</span>
                      </div>
                      <span className="font-mono font-black text-[#0251B8] dark:text-[#2D7DFF]">KES {b.amount.toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#355347] dark:text-[#8EA79C]">No bids placed yet. Be the first bidder!</p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
