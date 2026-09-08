import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Car, 
  Heart, 
  RefreshCw, 
  Globe, 
  Gavel, 
  MessageSquare, 
  Bell, 
  ShieldCheck, 
  LogOut, 
  CheckCircle2, 
  PlusCircle,
  Eye,
  Lock,
  AlertCircle
} from 'lucide-react';
import { Navbar } from '../components/navigation/Navbar';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { AuthService } from '../lib/auth/auth.service';
import type { AuthUser } from '../lib/auth/session';
import { VehicleService } from '../lib/vehicles/vehicle.service';
import { FavoriteService } from '../lib/favorites/favorite.service';
import { TradeInService } from '../lib/tradein/tradein.service';
import { ImportService } from '../lib/import/import.service';
import { AuctionService } from '../lib/auctions/auction.service';
import { InquiryService } from '../lib/inquiries/inquiry.service';
import { NotificationService } from '../lib/notifications/notification.service';
import { 
  Vehicle, 
  Favorite, 
  TradeInRequest, 
  ImportRequest, 
  Auction, 
  VehicleInquiry, 
  NotificationItem 
} from '../types/database';

export const AccountDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'profile' | 'listings' | 'favorites' | 'tradeins' | 'imports' | 'auctions' | 'inquiries' | 'notifications'>('profile');

  // Data states
  const [myListings, setMyListings] = useState<Vehicle[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [tradeIns, setTradeIns] = useState<TradeInRequest[]>([]);
  const [imports, setImports] = useState<ImportRequest[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [inquiries, setInquiries] = useState<VehicleInquiry[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Profile Edit State
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBusiness, setEditBusiness] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAccountData() {
      try {
        const user = await AuthService.getCurrentUser();
        if (!user) {
          navigate('/login');
          return;
        }
        setCurrentUser(user);
        setEditName(user.full_name || '');
        setEditPhone(user.phone || '');
        setEditBusiness(user.business_name || '');

        // Fetch datasets for current user
        const [vList, favList, trdList, impList, aucList, inqList, notifList] = await Promise.all([
          VehicleService.getAll(),
          FavoriteService.getByUserId(user.id),
          TradeInService.getAll(),
          ImportService.getAll(),
          AuctionService.getAll(),
          InquiryService.getAll(),
          NotificationService.getByUserId(user.id)
        ]);

        setMyListings(vList.filter((v: Vehicle) => v.dealer_name === user.full_name || v.dealer_name === user.business_name));
        setFavorites(favList);
        setTradeIns(trdList.filter((t: TradeInRequest) => t.user_id === user.id || t.email === user.email));
        setImports(impList.filter((i: ImportRequest) => i.user_id === user.id || i.email === user.email));
        setAuctions(aucList);
        setInquiries(inqList.filter((inq: VehicleInquiry) => inq.buyer_id === user.id || inq.email === user.email));
        setNotifications(notifList);

      } catch (err) {
        console.error('Failed to load user profile data', err);
      } finally {
        setLoading(false);
      }
    }

    loadAccountData();
  }, [navigate]);

  const handleSignOut = async () => {
    await AuthService.signOut();
    navigate('/');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSavingProfile(true);
    setProfileError(null);
    try {
      const res = await AuthService.updateProfile({
        full_name: editName,
        phone: editPhone,
        business_name: editBusiness
      });
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setProfileError(res.error || 'Failed to update profile.');
      }
    } catch (err: any) {
      setProfileError(err.message || 'An error occurred while saving profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#050505] text-[#0F241C] dark:text-[#F2F7F3] flex flex-col justify-center items-center">
        <Navbar />
        <div className="my-auto text-xs font-bold text-[#355347] dark:text-[#8EA79C]">Loading your account dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#050505] text-[#0F241C] dark:text-[#F2F7F3] flex flex-col font-sans selection:bg-[#0251B8] selection:text-white dark:selection:bg-[#0251B8] dark:selection:bg-[#2D7DFF] dark:selection:text-[#050505]">
      <Navbar />

      {/* Account Header */}
      <div className="bg-gradient-to-r from-[#EBF2FC] via-[#EDF7F2] to-[#F4F8F6] dark:from-[#000000] dark:via-[#121212] dark:to-[#0A0A0A] border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] text-[#0F241C] dark:text-[#F2F7F3] py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2D7DFF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.2)] flex items-center justify-center text-[#0251B8] dark:text-[#2D7DFF] text-2xl font-black shadow-xs">
              {currentUser?.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0251B8] dark:text-[#2D7DFF] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Yardly Automotives USER PORTAL</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5 text-[#0F241C] dark:text-[#F2F7F3]">
                {currentUser?.full_name}
              </h1>
              <div className="text-xs text-[#355347] dark:text-[#8EA79C] mt-0.5">
                {currentUser?.email} • Role: <span className="uppercase font-bold text-[#0251B8] dark:text-[#2D7DFF]">{currentUser?.role}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {(currentUser?.role === 'admin' || currentUser?.role === 'yard_admin') && (
              <Link to="/admin">
                <Button size="sm" variant="secondary" icon={<ShieldCheck className="w-4 h-4" />}>
                  Admin Console
                </Button>
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0A0A0A] hover:bg-[#EBF2FC] dark:hover:bg-[#1A1A1A] text-[#0F241C] dark:text-[#F2F7F3] text-xs font-bold border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.2)] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5 text-[#0251B8] dark:text-[#2D7DFF]" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-8 w-full flex-grow">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] pb-4 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'profile' ? 'bg-[#0251B8] text-white dark:bg-[#2D7DFF] dark:text-[#050505] shadow-md' : 'bg-white dark:bg-[#0A0A0A] text-[#355347] dark:text-[#8EA79C] border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.2)] hover:border-[#0251B8] dark:hover:border-[#2D7DFF] hover:text-[#0F241C] dark:hover:text-[#F2F7F3]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </button>

          {(currentUser?.role === 'seller' || currentUser?.role === 'admin' || currentUser?.role === 'yard_admin') && (
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'listings' ? 'bg-[#0251B8] text-white dark:bg-[#2D7DFF] dark:text-[#050505] shadow-md' : 'bg-white dark:bg-[#0A0A0A] text-[#355347] dark:text-[#8EA79C] border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.2)] hover:border-[#0251B8] dark:hover:border-[#2D7DFF] hover:text-[#0F241C] dark:hover:text-[#F2F7F3]'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>My Vehicle Listings ({myListings.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'favorites' ? 'bg-[#0251B8] text-white dark:bg-[#2D7DFF] dark:text-[#050505] shadow-md' : 'bg-white dark:bg-[#0A0A0A] text-[#355347] dark:text-[#8EA79C] border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.2)] hover:border-[#0251B8] dark:hover:border-[#2D7DFF] hover:text-[#0F241C] dark:hover:text-[#F2F7F3]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Vehicles ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tradeins')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'tradeins' ? 'bg-[#0251B8] text-white dark:bg-[#2D7DFF] dark:text-[#050505] shadow-md' : 'bg-white dark:bg-[#0A0A0A] text-[#355347] dark:text-[#8EA79C] border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.2)] hover:border-[#0251B8] dark:hover:border-[#2D7DFF] hover:text-[#0F241C] dark:hover:text-[#F2F7F3]'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Trade-Ins ({tradeIns.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('imports')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'imports' ? 'bg-[#0251B8] text-white dark:bg-[#2D7DFF] dark:text-[#050505] shadow-md' : 'bg-white dark:bg-[#0A0A0A] text-[#355347] dark:text-[#8EA79C] border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.2)] hover:border-[#0251B8] dark:hover:border-[#2D7DFF] hover:text-[#0F241C] dark:hover:text-[#F2F7F3]'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Imports ({imports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('auctions')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'auctions' ? 'bg-[#0251B8] text-white dark:bg-[#2D7DFF] dark:text-[#050505] shadow-md' : 'bg-white dark:bg-[#0A0A0A] text-[#355347] dark:text-[#8EA79C] border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.2)] hover:border-[#0251B8] dark:hover:border-[#2D7DFF] hover:text-[#0F241C] dark:hover:text-[#F2F7F3]'
            }`}
          >
            <Gavel className="w-4 h-4" />
            <span>Auction Activity</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'notifications' ? 'bg-[#0251B8] text-white dark:bg-[#2D7DFF] dark:text-[#050505] shadow-md' : 'bg-white dark:bg-[#0A0A0A] text-[#355347] dark:text-[#8EA79C] border border-[rgba(0,60,40,0.1)] dark:border-[rgba(255, 255, 255,0.2)] hover:border-[#0251B8] dark:hover:border-[#2D7DFF] hover:text-[#0F241C] dark:hover:text-[#F2F7F3]'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications ({notifications.filter(n => !n.read).length})</span>
          </button>
        </div>

        {/* TAB 1: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-[#121212]/90 backdrop-blur-md rounded-3xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.15)] p-6 sm:p-8 shadow-sm dark:shadow-glass max-w-2xl space-y-6">
            <h3 className="text-lg font-black text-[#0F241C] dark:text-[#F2F7F3]">Profile & Account Settings</h3>
            
            {saveSuccess && (
              <div className="p-3.5 rounded-xl bg-[#0251B8]/10 dark:bg-[#2D7DFF]/15 border border-[#0251B8]/30 dark:border-[#2D7DFF]/30 text-xs font-semibold text-[#0251B8] dark:text-[#2D7DFF] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#0251B8] dark:text-[#2D7DFF]" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            {profileError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <Input
                label="Full Name *"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
              <Input
                label="Email Address (Account ID)"
                value={currentUser?.email}
                disabled
              />
              <Input
                label="Phone Number"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="+254 7XX XXX XXX"
              />
              {(currentUser?.role === 'seller' || currentUser?.role === 'dealer') && (
                <Input
                  label="Dealership / Business Name"
                  value={editBusiness}
                  onChange={(e) => setEditBusiness(e.target.value)}
                  placeholder="e.g. Mwangi Motors Ltd"
                />
              )}

              <Button type="submit" className="font-extrabold btn-glow" disabled={savingProfile}>
                {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
              </Button>
            </form>
          </div>
        )}

        {/* TAB 2: My Listings */}
        {activeTab === 'listings' && (
          <div className="bg-white dark:bg-[#121212]/90 backdrop-blur-md rounded-3xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.15)] p-6 shadow-sm dark:shadow-glass space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-[#0F241C] dark:text-[#F2F7F3]">My Vehicles & Listings</h3>
              <Link to="/sell">
                <Button size="sm" icon={<PlusCircle className="w-4 h-4" />}>
                  List New Vehicle
                </Button>
              </Link>
            </div>

            {myListings.length === 0 ? (
              <p className="text-xs text-[#355347] dark:text-[#8EA79C] py-6">You have no active vehicle listings. Click "List New Vehicle" to add your car.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myListings.map(v => (
                  <div key={v.id} className="p-4 rounded-2xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] bg-[#F4F8F6] dark:bg-[#0A0A0A] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#0F241C] dark:text-[#F2F7F3] text-sm">{v.year} {v.make} {v.model}</div>
                      <div className="text-xs text-[#0251B8] dark:text-[#2D7DFF] font-black">KES {v.price.toLocaleString()}</div>
                      <Badge variant={v.status === 'active' ? 'success' : 'secondary'} size="sm" className="mt-1">
                        {v.status}
                      </Badge>
                    </div>
                    <Link to={`/vehicles/${v.id}`}>
                      <Button size="sm" variant="ghost" icon={<Eye className="w-4 h-4" />}>View</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Saved Vehicles */}
        {activeTab === 'favorites' && (
          <div className="bg-white dark:bg-[#121212]/90 backdrop-blur-md rounded-3xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.15)] p-6 shadow-sm dark:shadow-glass space-y-4">
            <h3 className="text-lg font-black text-[#0F241C] dark:text-[#F2F7F3]">Saved Vehicles & Bookmarks</h3>
            {favorites.length === 0 ? (
              <p className="text-xs text-[#355347] dark:text-[#8EA79C] py-6">No saved vehicles found. Browse marketplace cars and tap the bookmark icon to save.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favorites.map(f => (
                  <div key={f.id} className="p-4 rounded-2xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] bg-[#F4F8F6] dark:bg-[#0A0A0A] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#0F241C] dark:text-[#F2F7F3] text-sm">{f.vehicle ? `${f.vehicle.year} ${f.vehicle.make} ${f.vehicle.model}` : 'Vehicle'}</div>
                      <div className="text-xs text-[#0251B8] dark:text-[#2D7DFF] font-black">KES {f.vehicle?.price.toLocaleString()}</div>
                    </div>
                    {f.vehicle && (
                      <Link to={`/vehicles/${f.vehicle.id}`}>
                        <Button size="sm" variant="outline">View Car</Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Trade-Ins */}
        {activeTab === 'tradeins' && (
          <div className="bg-white dark:bg-[#121212]/90 backdrop-blur-md rounded-3xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.15)] p-6 shadow-sm dark:shadow-glass space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-[#0F241C] dark:text-[#F2F7F3]">My Trade-In Requests</h3>
              <Link to="/trade-in">
                <Button size="sm" variant="outline">Submit Trade-In</Button>
              </Link>
            </div>
            {tradeIns.length === 0 ? (
              <p className="text-xs text-[#355347] dark:text-[#8EA79C] py-6">No trade-in requests logged.</p>
            ) : (
              <div className="space-y-3">
                {tradeIns.map(t => (
                  <div key={t.id} className="p-4 rounded-2xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] bg-[#F4F8F6] dark:bg-[#0A0A0A] flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#0251B8] dark:text-[#2D7DFF]">{t.reference_id}</span>
                      <div className="font-bold text-[#0F241C] dark:text-[#F2F7F3] mt-0.5">{t.year} {t.make} {t.model}</div>
                      <div className="text-[#355347] dark:text-[#8EA79C]">Expected: KES {t.expected_value.toLocaleString()}</div>
                    </div>
                    <Badge variant={t.status === 'completed' ? 'success' : 'warning'}>{t.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Imports */}
        {activeTab === 'imports' && (
          <div className="bg-white dark:bg-[#121212]/90 backdrop-blur-md rounded-3xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.15)] p-6 shadow-sm dark:shadow-glass space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-[#0F241C] dark:text-[#F2F7F3]">Direct Import Sourcing Orders</h3>
              <Link to="/import">
                <Button size="sm" variant="outline">Request Direct Import</Button>
              </Link>
            </div>
            {imports.length === 0 ? (
              <p className="text-xs text-[#355347] dark:text-[#8EA79C] py-6">No direct import requests active.</p>
            ) : (
              <div className="space-y-3">
                {imports.map(i => (
                  <div key={i.id} className="p-4 rounded-2xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] bg-[#F4F8F6] dark:bg-[#0A0A0A] flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#0251B8] dark:text-[#2D7DFF]">{i.reference_number}</span>
                      <div className="font-bold text-[#0F241C] dark:text-[#F2F7F3] mt-0.5">{i.make} {i.model} ({i.preferred_source_country})</div>
                      <div className="text-[#355347] dark:text-[#8EA79C]">Budget: KES {i.budget.toLocaleString()}</div>
                    </div>
                    <Badge variant="primary">{i.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: Notifications */}
        {activeTab === 'notifications' && (
          <div className="bg-white dark:bg-[#121212]/90 backdrop-blur-md rounded-3xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.15)] p-6 shadow-sm dark:shadow-glass space-y-4">
            <h3 className="text-lg font-black text-[#0F241C] dark:text-[#F2F7F3]">Notifications & Activity Alerts</h3>
            {notifications.length === 0 ? (
              <p className="text-xs text-[#355347] dark:text-[#8EA79C] py-6">No notifications to display.</p>
            ) : (
              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n.id} className="p-4 rounded-2xl border border-[rgba(0,60,40,0.08)] dark:border-[rgba(255, 255, 255,0.12)] bg-[#F4F8F6] dark:bg-[#0A0A0A] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#0F241C] dark:text-[#F2F7F3]">{n.title}</div>
                      <div className="text-[#355347] dark:text-[#8EA79C] mt-0.5">{n.message}</div>
                      <div className="text-[10px] text-[#355347] dark:text-[#8EA79C] mt-1">{new Date(n.created_at).toLocaleString()}</div>
                    </div>
                    <Badge variant={n.read ? 'secondary' : 'warning'}>
                      {n.read ? 'Read' : 'New'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
