import React, { useState, useEffect } from 'react'
import { 
  Camera, 
  MapPin, 
  Trash2, 
  Bell, 
  Award, 
  User, 
  Home, 
  ChevronRight, 
  Check, 
  Search, 
  AlertTriangle, 
  Leaf, 
  Compass, 
  ArrowRight, 
  ArrowLeft,
  Calendar, 
  Gift, 
  ThumbsUp, 
  Info,
  Clock,
  Sparkles,
  CheckCircle2,
  X,
  RefreshCw,
  LogOut,
  Map as MapIcon
} from 'lucide-react'

// Waste Sorter Database
const WASTE_DATABASE = [
  { 
    id: 1, 
    name: "Plastic bottle", 
    category: "Recyclable", 
    tip: "Always rinse your plastic containers before putting them in the recycling bin to prevent contamination.",
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=150&q=80" 
  },
  { 
    id: 2, 
    name: "Banana peel", 
    category: "Biodegradable", 
    tip: "Compost organic waste like fruit peels to create nutrient-rich soil for local campus gardens.",
    image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=150&q=80"
  },
  { 
    id: 3, 
    name: "AA Battery", 
    category: "Hazardous", 
    tip: "Batteries contain toxic chemicals. Do not put them in regular trash; bring them to the e-waste bin in Building A.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=150&q=80" 
  },
  { 
    id: 4, 
    name: "Styrofoam cup", 
    category: "Residual", 
    tip: "Styrofoam cannot be easily recycled. Avoid using single-use cups; switch to a reusable tumbler to earn reusable points.",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=150&q=80" 
  },
  { 
    id: 5, 
    name: "Aluminum can", 
    category: "Recyclable", 
    tip: "Aluminum is infinitely recyclable. Crushing cans saves storage volume in sorting bins.",
    image: "https://images.unsplash.com/photo-1525992985160-c3d690a9058b?auto=format&fit=crop&w=150&q=80" 
  },
  { 
    id: 6, 
    name: "Cardboard box", 
    category: "Recyclable", 
    tip: "Make sure cardboard boxes are empty, clean, flattened, and kept dry before disposal.",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=150&q=80" 
  },
  { 
    id: 7, 
    name: "Apple core", 
    category: "Biodegradable", 
    tip: "Apples decay cleanly. Throw them into composting bins to nourish garden landscapes.",
    image: "https://images.unsplash.com/photo-1568702846914-96b3e6d855c7?auto=format&fit=crop&w=150&q=80"
  },
  { 
    id: 8, 
    name: "Expired medicine", 
    category: "Hazardous", 
    tip: "Never flush expired pills or throw them in standard garbage. Turn them in at the health office collection box.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=150&q=80"
  }
]

// Mock Maps Clean-Up Events
const CLEANUP_EVENTS = [
  {
    id: "canal",
    title: "Canal Clean-Up",
    date: "Sat, 10:00 AM",
    distance: "2km away",
    points: 100,
    attendees: 28,
    lat: 40,
    lng: 35,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
    description: "Join the local student community to clean up blockages and debris in the main canal lines ahead of the heavy rainy season."
  },
  {
    id: "park",
    title: "Park Trash Sweep",
    date: "Sun, 2:00 PM",
    distance: "3km away",
    points: 100,
    attendees: 19,
    lat: 65,
    lng: 60,
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=400&q=80",
    description: "Let's clean and restore the central central walk area. Biodegradables will be composted immediately on site."
  },
  {
    id: "campus",
    title: "Eco Campus Clean-Up",
    date: "Fri, 4:00 PM",
    distance: "1.5km away",
    points: 80,
    attendees: 45,
    lat: 30,
    lng: 70,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80",
    description: "Clear modern recycling drives around dorm corridors and organize plastic bottle disposal stations."
  }
]

function App() {
  // Navigation & Splash Screen
  const [screen, setScreen] = useState('splash') // 'splash' | 'main'
  const [activeTab, setActiveTab] = useState('home') // 'home' | 'report' | 'waste' | 'map' | 'rewards' | 'profile'

  // Points & Profile Metrics (Global States)
  const [ecoPoints, setEcoPoints] = useState(350) // Spendable Balance
  const [totalPoints, setTotalPoints] = useState(2450) // Cumulative Lifetime Points
  const [reportsCount, setReportsCount] = useState(42)
  const [cleanupsCount, setCleanupsCount] = useState(15)

  // Submissions lists & state interactions
  const [joinedEvents, setJoinedEvents] = useState([]) // e.g. ['canal']
  const [submittedReports, setSubmittedReports] = useState([
    {
      id: 101,
      type: 'Trash/Litter',
      address: 'Central Plaza Fountain Quad',
      description: 'Accumulation of discarded plastic cups and food containers near the main outdoor study benches.',
      photo: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=400&q=80',
      date: '3 days ago'
    }
  ]) // Prepopulated mock history item
  
  // Custom toast notification system
  const [toast, setToast] = useState(null)

  // Report Tab States
  const [reportType, setReportType] = useState('Trash/Litter')
  const [reportPhoto, setReportPhoto] = useState(null) // Mock photo url/base64
  const [reportAddress, setReportAddress] = useState('Detecting street address...')
  const [reportDescription, setReportDescription] = useState('')
  const [isLocating, setIsLocating] = useState(false)
  const [isSnapping, setIsSnapping] = useState(false)

  // Waste Sorter States
  const [searchQuery, setSearchQuery] = useState('')
  const [activeWasteCategory, setActiveWasteCategory] = useState(null) // Filter by grid click
  const [recentSearchResult, setRecentSearchResult] = useState(WASTE_DATABASE[0])

  // Map Screen States
  const [selectedMapEventId, setSelectedMapEventId] = useState('canal')

  // Alerts States
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'schedule',
      badge: 'Schedule',
      badgeBg: 'bg-blue-100 text-blue-800',
      title: 'Garbage collection: Monday and Thursday',
      time: '2 hours ago',
      description: 'Barangay garbage collection trucks arrive around 8:00 AM. Keep recyclables segregated ahead of time.',
      read: false
    },
    {
      id: 2,
      type: 'event',
      badge: 'Event',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      title: 'Clean-up drive this Saturday',
      time: '1 day ago',
      description: 'Join the community canal sweep. Sign up in the Map section to earn points and level badges.',
      read: false,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 3,
      type: 'notice',
      badge: 'Notice',
      badgeBg: 'bg-rose-100 text-rose-800',
      title: 'Avoid throwing waste in canals',
      time: '3 days ago',
      description: 'Local heavy rains forecasted this week. Dumping rubbish leads directly to street-level flooding in standard areas.',
      read: true
    }
  ])

  // Rewards Vouchers State
  const [redeemedVouchers, setRedeemedVouchers] = useState([])
  const [activeVoucherModal, setActiveVoucherModal] = useState(null) // Displays active barcode modal

  // Auto trigger addresses mock loading
  useEffect(() => {
    if (activeTab === 'report' && reportAddress === 'Detecting street address...') {
      setIsLocating(true)
      const timer = setTimeout(() => {
        setReportAddress('108 Green Meadows Avenue, Campus Area')
        setIsLocating(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [activeTab])

  // Helper: Trigger beautiful toast feedbacks
  const showToast = (message, pointsGained = 0) => {
    setToast({ message, points: pointsGained })
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  // Action Handlers
  const handleGetStarted = () => {
    setScreen('main')
    showToast("Welcome Eco Hero! Have fun saving the planet.", 0)
  }

  const handleReportSubmit = (e) => {
    e.preventDefault()
    if (!reportDescription.trim()) {
      showToast("Please enter a description for the issue.", 0)
      return
    }

    const newReport = {
      id: Date.now(),
      type: reportType,
      address: reportAddress,
      description: reportDescription,
      photo: reportPhoto || "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=300&q=80",
      date: 'Just now'
    }

    // Update global points & counts
    setEcoPoints(prev => prev + 50)
    setTotalPoints(prev => prev + 50)
    setReportsCount(prev => prev + 1)
    setSubmittedReports(prev => [newReport, ...prev])

    // Prepend to alerts list as a personal success indicator
    const newAlert = {
      id: Date.now(),
      type: 'event',
      badge: 'My Report',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      title: `Submitted Report: ${reportType}`,
      time: 'Just now',
      description: `Report verified! Located at ${reportAddress}. You earned 50 eco points.`,
      read: false
    }
    setAlerts(prev => [newAlert, ...prev])

    showToast("Report submitted successfully! +50 Earth Points", 50)

    // Reset report state values
    setReportDescription('')
    setReportPhoto(null)
    // Send user back to home or profile to see their new report render in real-time
    setActiveTab('profile')
  }

  const handleToggleJoinCleanup = (event) => {
    const isJoined = joinedEvents.includes(event.id)
    if (isJoined) {
      setJoinedEvents(prev => prev.filter(id => id !== event.id))
      setCleanupsCount(prev => Math.max(15, prev - 1))
      setEcoPoints(prev => Math.max(0, prev - event.points))
      setTotalPoints(prev => Math.max(0, prev - event.points))
      showToast(`Left ${event.title}. Points removed.`, 0)
    } else {
      setJoinedEvents(prev => [...prev, event.id])
      setCleanupsCount(prev => prev + 1)
      setEcoPoints(prev => prev + event.points)
      setTotalPoints(prev => prev + event.points)
      showToast(`Joined ${event.title}! +${event.points} Earth Points!`, event.points)
    }
  }

  const handleRedeemVoucher = (voucherId, cost, name) => {
    if (ecoPoints < cost) {
      showToast("Insufficient Eco Points to redeem this voucher.", 0)
      return
    }

    setEcoPoints(prev => prev - cost)
    const newRedemption = {
      id: Date.now(),
      voucherId,
      name,
      cost,
      code: `ECO-${Math.floor(100000 + Math.random() * 900000)}`
    }
    setRedeemedVouchers(prev => [...prev, newRedemption])
    setActiveVoucherModal(newRedemption)
    showToast(`Redeemed ${name}! Coupon code generated.`, 0)
  }

  const handleMarkAllAlertsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })))
    showToast("All announcements marked as read.", 0)
  }

  const handleMockPhotoCapture = () => {
    setIsSnapping(true)
    setTimeout(() => {
      // Set to a mock visual evidence photograph
      const mockImages = [
        "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=400&q=80", // rubbish pile
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80", // waste plastic bin
        "https://images.unsplash.com/photo-1604187351574-c75c7e215093?auto=format&fit=crop&w=400&q=80"  // smoke exhaust
      ]
      const randomImg = mockImages[Math.floor(Math.random() * mockImages.length)]
      setReportPhoto(randomImg)
      setIsSnapping(false)
      showToast("Visual evidence captured!", 0)
    }, 1200)
  }

  // Live filter waste database
  const filteredWaste = WASTE_DATABASE.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase())
    if (activeWasteCategory) {
      return matchesSearch && item.category.toLowerCase() === activeWasteCategory.toLowerCase()
    }
    return matchesSearch
  })

  // Level computation logic
  const computeLevel = (points) => {
    return Math.floor(points / 500) + 1
  }

  const currentLevel = computeLevel(totalPoints)
  const currentLevelProgress = totalPoints % 500
  const pointsNeededForNextLevel = 500 - currentLevelProgress

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-0 md:p-6 antialiased">
      {/* Sleek simulated Smartphone Frame */}
      <div className="relative w-full max-w-md bg-stone-50 md:rounded-[40px] md:shadow-2xl overflow-hidden flex flex-col min-h-screen md:min-h-[840px] md:max-h-[880px] border border-stone-200/80 mobile-frame-glow">
        
        {/* Dynamic Toast Feedback Notification */}
        {toast && (
          <div className="absolute top-14 left-4 right-4 z-50 bg-emerald-950/95 text-stone-100 p-3 rounded-2xl shadow-xl flex items-center justify-between border border-emerald-500/30 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 text-emerald-950 p-2 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-400">SUCCESSFUL ACTION</p>
                <p className="text-sm font-medium text-stone-200">{toast.message}</p>
              </div>
            </div>
            {toast.points > 0 && (
              <div className="bg-amber-400 text-stone-900 font-extrabold px-3 py-1 rounded-full text-xs">
                +{toast.points} XP
              </div>
            )}
          </div>
        )}

        {/* Dynamic Voucher Barcode Modal */}
        {activeVoucherModal && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-scale-in">
            <div className="bg-stone-50 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative border border-emerald-500/10">
              <button 
                onClick={() => setActiveVoucherModal(null)} 
                className="absolute top-4 right-4 p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mt-2">
                <div className="inline-flex bg-emerald-50 p-3 rounded-full text-emerald-600 mb-3">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-emerald-950">Voucher Ticket</h3>
                <p className="text-xs text-stone-500 mt-1">Show this screen at the service counter</p>
              </div>

              <div className="my-6 bg-stone-100 rounded-2xl p-4 border border-stone-200/60 text-center">
                <p className="text-xs font-semibold text-emerald-700 tracking-wider uppercase mb-1">REWARD BENEFIT</p>
                <p className="text-lg font-bold text-stone-800">{activeVoucherModal.name}</p>
                <p className="text-xs text-stone-500 mt-0.5">Redemption cost: {activeVoucherModal.cost} points</p>
                
                {/* Simulated Barcode block */}
                <div className="mt-5 mb-3 flex flex-col items-center justify-center gap-1.5 bg-white p-4 rounded-xl border border-stone-200">
                  <div className="flex gap-1 h-12 w-full max-w-[200px] justify-center items-stretch bg-white">
                    <div className="w-1.5 bg-stone-950"></div>
                    <div className="w-0.5 bg-stone-950"></div>
                    <div className="w-1 bg-stone-950"></div>
                    <div className="w-2 bg-stone-950"></div>
                    <div className="w-0.5 bg-stone-950"></div>
                    <div className="w-1.5 bg-stone-950"></div>
                    <div className="w-1 bg-stone-950"></div>
                    <div className="w-0.5 bg-stone-950"></div>
                    <div className="w-2 bg-stone-950"></div>
                    <div className="w-1.5 bg-stone-950"></div>
                    <div className="w-0.5 bg-stone-950"></div>
                    <div className="w-1 bg-stone-950"></div>
                  </div>
                  <code className="text-xs font-mono font-bold tracking-widest text-stone-700 mt-1">
                    {activeVoucherModal.code}
                  </code>
                </div>
              </div>

              <button 
                onClick={() => setActiveVoucherModal(null)} 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-stone-50 font-bold py-3 rounded-xl transition-all shadow-md active:scale-98"
              >
                Close Ticket
              </button>
            </div>
          </div>
        )}

        {/* 1. SPLASH SCREEN (Initial view overlay) */}
        {screen === 'splash' && (
          <div className="absolute inset-0 bg-stone-50 z-50 flex flex-col justify-between items-center p-6 md:p-8 animate-slide-up">
            <div></div>

            {/* Centered branding logo */}
            <div className="flex flex-col items-center text-center">
              {/* Green Camera Icon with Leaf Cutout */}
              <div className="relative w-40 h-40 bg-white rounded-[40px] shadow-xl flex items-center justify-center border border-stone-100 mb-6 animate-pulse-slow">
                <div className="absolute w-36 h-36 border-4 border-emerald-500/10 rounded-[36px]"></div>
                
                {/* Simulated Lens Aperture with Leaf cutout */}
                <div className="w-24 h-24 bg-emerald-600 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-inner">
                  {/* Lens circles */}
                  <div className="absolute inset-2 border-2 border-white/20 rounded-2xl"></div>
                  <div className="absolute w-12 h-12 bg-emerald-900 rounded-full flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-emerald-400 fill-emerald-400" />
                  </div>
                  {/* Flash indicator */}
                  <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-emerald-400 rounded-full"></div>
                </div>
              </div>

              <h1 className="text-4xl font-extrabold text-emerald-700 tracking-tight leading-none mb-1 font-display">
                EcoSnap
              </h1>
              <p className="text-emerald-950/80 font-medium tracking-wide text-sm mb-4 font-display">
                Snap. Report. Protect.
              </p>
            </div>

            {/* Footer with Subtitle & Action */}
            <div className="w-full flex flex-col items-center gap-6 mt-auto">
              <p className="text-stone-500 text-xs text-center max-w-[280px] leading-relaxed">
                Join a community of students making the campus greener, one snap at a time.
              </p>

              <button 
                onClick={handleGetStarted}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-stone-50 font-bold py-4 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2 tracking-wide text-md cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN CONTAINER (Top bar, main panel scroll container, bottom nav) */}
        
        {/* Mobile Header Bar */}
        <header className="sticky top-0 bg-stone-50 border-b border-stone-200/60 z-30 px-5 py-4.5 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            {activeTab !== 'home' ? (
              <button 
                onClick={() => setActiveTab('home')} 
                className="p-1.5 hover:bg-stone-200/50 rounded-lg text-stone-700 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-4.5 h-4.5 text-stone-50 fill-stone-50" />
              </div>
            )}
            
            <span className="font-extrabold text-lg text-emerald-800 tracking-tight font-display">
              {activeTab === 'home' ? 'EcoSnap' : activeTab === 'waste' ? 'Waste Sorter' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Points bubble */}
            <div className="bg-amber-50 border border-amber-200/60 text-amber-800 font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
              <Award className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{ecoPoints} XP</span>
            </div>

            {/* Notification Bell */}
            <button 
              onClick={() => setActiveTab('alerts')} 
              className="relative p-1.5 hover:bg-stone-200/50 rounded-full text-stone-600 transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {alerts.some(a => !a.read) && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-stone-50 rounded-full"></span>
              )}
            </button>
          </div>
        </header>

        {/* SCROLLABLE MAIN VIEWS PANEL */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-6 bg-stone-50">
          
          {/* TAB 1: HOME DASHBOARD */}
          {activeTab === 'home' && (
            <div className="p-4 space-y-5 animate-slide-up">
              
              {/* Greeting Header */}
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-emerald-950 leading-tight">
                  Hello, Eco Hero!
                </h2>
                <p className="text-stone-500 text-xs font-medium">
                  What would you like to do today?
                </p>
              </div>

              {/* Impact Banner Card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-green-700 rounded-3xl p-5 text-stone-50 shadow-md">
                {/* Abstract graphic cutouts */}
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="absolute right-4 top-4 w-12 h-12 bg-emerald-400/25 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-emerald-200 fill-emerald-200" />
                </div>

                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">
                  Monthly Impact
                </p>
                <p className="text-2xl font-black mt-0.5 tracking-tight font-display">
                  12.5 kg saved
                </p>
                
                <div className="mt-4 flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span className="text-xs font-bold tracking-wide">
                    Level {currentLevel} Eco Guardian
                  </span>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest px-1">
                  Quick Actions
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Action 1: Eco Report - Full Row */}
                  <button 
                    onClick={() => setActiveTab('report')}
                    className="col-span-2 bg-white hover:bg-stone-50 active:scale-98 text-left p-4 rounded-3xl border border-stone-200/50 shadow-xs flex items-center justify-between transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Camera className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-stone-900 text-sm leading-snug">Eco Report</h4>
                        <p className="text-[11px] text-stone-400 font-medium">Capture & document environmental issues</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-emerald-600 transition-colors" />
                  </button>

                  {/* Action 2: Waste Sorter Guide */}
                  <button 
                    onClick={() => setActiveTab('waste')}
                    className="bg-white hover:bg-stone-50 active:scale-98 text-left p-4 rounded-3xl border border-stone-200/50 shadow-xs flex flex-col justify-between h-[120px] transition-all duration-200 group cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-stone-900 text-xs">Waste Sorter</h4>
                      <p className="text-[10px] text-stone-400 mt-0.5">Disposal guide</p>
                    </div>
                  </button>

                  {/* Action 3: Clean-Up Map */}
                  <button 
                    onClick={() => setActiveTab('map')}
                    className="bg-white hover:bg-stone-50 active:scale-98 text-left p-4 rounded-3xl border border-stone-200/50 shadow-xs flex flex-col justify-between h-[120px] transition-all duration-200 group cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-stone-900 text-xs">Clean-Up Map</h4>
                      <p className="text-[10px] text-stone-400 mt-0.5">Explore events</p>
                    </div>
                  </button>

                  {/* Action 4: Eco Points */}
                  <button 
                    onClick={() => setActiveTab('rewards')}
                    className="bg-white hover:bg-stone-50 active:scale-98 text-left p-4 rounded-3xl border border-stone-200/50 shadow-xs flex flex-col justify-between h-[120px] transition-all duration-200 group cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-stone-900 text-xs">Eco Points</h4>
                      <p className="text-[10px] text-stone-400 mt-0.5">Voucher store</p>
                    </div>
                  </button>

                  {/* Action 5: Daily Eco Tips */}
                  <button 
                    onClick={() => {
                      showToast("Pro Tip: Switch to a reusable bottle to save 150 plastic cups annually!", 10)
                      setEcoPoints(p => p + 10)
                      setTotalPoints(p => p + 10)
                    }}
                    className="bg-white hover:bg-stone-50 active:scale-98 text-left p-4 rounded-3xl border border-stone-200/50 shadow-xs flex flex-col justify-between h-[120px] transition-all duration-200 group cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Sparkles className="w-5 h-5 text-amber-500 fill-amber-300" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-stone-900 text-xs">Daily Eco Tips</h4>
                      <p className="text-[10px] text-stone-400 mt-0.5">Claim +10 XP</p>
                    </div>
                  </button>

                  {/* Action 6: Barangay Alert - Full Row */}
                  <button 
                    onClick={() => setActiveTab('alerts')}
                    className="col-span-2 bg-white hover:bg-stone-50 active:scale-98 text-left p-4 rounded-3xl border border-stone-200/50 shadow-xs flex items-center justify-between transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Bell className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-stone-900 text-sm leading-snug">Barangay Alert</h4>
                        <p className="text-[11px] text-stone-400 font-medium">Stay updated with local announcements</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-rose-600 transition-colors" />
                  </button>
                </div>
              </div>

              {/* Community Progress Section */}
              <div className="bg-white rounded-3xl p-5 border border-stone-200/60 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest">
                    Community Progress
                  </h3>
                  <button 
                    type="button"
                    onClick={() => showToast("Rank #4 on local school environmental leaderboard!", 0)} 
                    className="text-emerald-700 hover:text-emerald-800 text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    View Leaderboard
                  </button>
                </div>

                <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-2xl">
                  {/* Overlapping profile avatars */}
                  <div className="flex -space-x-2.5 overflow-hidden">
                    <img 
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" 
                      alt="Student" 
                    />
                    <img 
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" 
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80" 
                      alt="Student" 
                    />
                    <img 
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" 
                      alt="Student" 
                    />
                    <div className="inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-emerald-500 text-[9px] font-bold text-white uppercase tracking-tighter">
                      +42
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-stone-700 leading-snug">
                    Your neighborhood recycled <span className="font-extrabold text-emerald-700">420kg</span> this week!
                  </p>
                </div>

                {/* Progress loader */}
                <div className="space-y-1.5">
                  <div className="w-full bg-stone-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-stone-200/50">
                    <div 
                      className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-stone-400 font-bold uppercase tracking-wider px-0.5">
                    <span>Current Goal</span>
                    <span>75% Complete</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ECO REPORT FORM */}
          {activeTab === 'report' && (
            <form onSubmit={handleReportSubmit} className="p-4 space-y-5 animate-slide-up">
              
              {/* Image Capture Area */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest px-1">
                  Visual Evidence
                </label>
                
                <div className="relative border-2 border-dashed border-stone-200 bg-stone-50 rounded-3xl overflow-hidden aspect-video flex flex-col items-center justify-center p-4 text-center transition-all">
                  {reportPhoto ? (
                    <div className="absolute inset-0 w-full h-full group">
                      <img src={reportPhoto} alt="Mock upload" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button 
                          type="button" 
                          onClick={() => setReportPhoto(null)} 
                          className="bg-stone-50 hover:bg-stone-100 text-rose-600 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                          Remove Photo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="inline-flex bg-stone-100 p-4 rounded-full text-stone-400 mb-2">
                        <Camera className="w-8 h-8" />
                      </div>
                      <h4 className="font-extrabold text-stone-800 text-sm">Capture visual evidence</h4>
                      <p className="text-[11px] text-stone-400 mt-1 max-w-[200px]">Click below to simulate taking an instant field snapshot</p>
                    </>
                  )}
                </div>

                {!reportPhoto && (
                  <button
                    type="button"
                    onClick={handleMockPhotoCapture}
                    disabled={isSnapping}
                    className="w-full bg-emerald-900 hover:bg-emerald-950 text-stone-50 font-bold py-3 px-4 rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 text-sm disabled:opacity-75 cursor-pointer"
                  >
                    {isSnapping ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Snapping mock photo...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 text-emerald-400" />
                        Take Photo
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Problem Type Chips */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black text-stone-400 uppercase tracking-widest">
                    Problem Type
                  </label>
                  <span className="text-[10px] text-stone-400 font-extrabold uppercase">Required</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {['Trash/Litter', 'Clogged Drainage', 'Illegal Dumping', 'Smoke Pollution', 'Tree Cutting'].map((type) => {
                    const isActive = reportType === type
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setReportType(type)}
                        className={`px-3 py-2 rounded-full text-xs font-bold border transition-all duration-200 cursor-pointer ${
                          isActive 
                            ? 'bg-emerald-600 border-emerald-600 text-stone-50 shadow-xs' 
                            : 'bg-white border-stone-200 hover:border-stone-300 text-stone-600'
                        }`}
                      >
                        {type}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Add Location */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest px-1">
                  Add Location
                </label>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <MapPin className="w-4.5 h-4.5 text-emerald-600" />
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={reportAddress}
                    className="block w-full pl-10 pr-10 py-3 bg-stone-100 border border-stone-200/50 rounded-2xl text-xs text-stone-650 font-medium focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsLocating(true)
                      setTimeout(() => {
                        setReportAddress('Building C Corridors, West Campus')
                        setIsLocating(false)
                        showToast("Location updated successfully", 0)
                      }, 1000)
                    }}
                    disabled={isLocating}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-705 hover:text-emerald-950 disabled:opacity-50 cursor-pointer"
                  >
                    {isLocating ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-stone-400" />
                    ) : (
                      <Compass className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Add Description */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest px-1">
                  Add Description
                </label>
                <textarea
                  rows="3"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Describe the environmental issue..."
                  className="block w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-850 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                ></textarea>
              </div>

              {/* Action Submit Button */}
              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-stone-50 font-bold py-3.5 px-4 rounded-2xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                Submit Report
              </button>

              {/* Blue Info Banner Card */}
              <div className="bg-blue-50 border border-blue-100 rounded-3xl p-4 flex gap-3 text-blue-900 animate-pulse-slow">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-xs">Community Impact</h4>
                  <p className="text-[10px] text-blue-800 mt-1 leading-relaxed">
                    Reporting local environmental issues helps the EcoSnap team prioritize cleanup and earn you up to 50 Earth Points.
                  </p>
                </div>
              </div>

            </form>
          )}

          {/* TAB 3: WASTE SORTER GUIDE */}
          {activeTab === 'waste' && (
            <div className="p-4 space-y-5 animate-slide-up">
              
              {/* Header block */}
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-emerald-950 leading-tight">
                  Waste Sorter
                </h2>
                <p className="text-stone-500 text-xs font-medium leading-relaxed">
                  Identify and dispose of items the right way to help our planet.
                </p>
              </div>

              {/* Search input bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Search className="w-4.5 h-4.5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search waste item"
                  className="block w-full pl-10 pr-10 py-3 bg-stone-100 border border-stone-200/50 rounded-2xl text-xs text-stone-800 font-medium placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Active Category Header tag indicator */}
              {activeWasteCategory && (
                <div className="flex justify-between items-center bg-emerald-50 border border-emerald-200/60 px-4 py-2.5 rounded-2xl text-xs animate-scale-in">
                  <span className="font-semibold text-stone-700">
                    Category Filter: <span className="font-black text-emerald-800 tracking-wide">{activeWasteCategory}</span>
                  </span>
                  <button 
                    type="button"
                    onClick={() => setActiveWasteCategory(null)} 
                    className="text-rose-600 hover:text-rose-800 font-extrabold uppercase text-[10px] tracking-wider cursor-pointer"
                  >
                    Clear Filter
                  </button>
                </div>
              )}

              {/* Category selector grid */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* Biodegradable Card (Green) */}
                <button 
                  onClick={() => setActiveWasteCategory(activeWasteCategory === 'Biodegradable' ? null : 'Biodegradable')}
                  className={`relative p-4 rounded-3xl text-left border flex flex-col justify-between h-[110px] transition-all cursor-pointer ${
                    activeWasteCategory === 'Biodegradable'
                      ? 'bg-emerald-600 border-emerald-600 text-stone-50 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-emerald-50 border-emerald-100 text-emerald-900 hover:bg-emerald-100/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeWasteCategory === 'Biodegradable' ? 'bg-white/20' : 'bg-emerald-100 text-emerald-700'}`}>
                    <Leaf className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs">Biodegradable</h4>
                    <p className={`text-[9px] mt-0.5 ${activeWasteCategory === 'Biodegradable' ? 'text-emerald-100' : 'text-emerald-700'}`}>Organic waste</p>
                  </div>
                </button>

                {/* Recyclable Card (Blue) */}
                <button 
                  onClick={() => setActiveWasteCategory(activeWasteCategory === 'Recyclable' ? null : 'Recyclable')}
                  className={`relative p-4 rounded-3xl text-left border flex flex-col justify-between h-[110px] transition-all cursor-pointer ${
                    activeWasteCategory === 'Recyclable'
                      ? 'bg-blue-600 border-blue-600 text-stone-50 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-blue-50 border-blue-100 text-blue-900 hover:bg-blue-100/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeWasteCategory === 'Recyclable' ? 'bg-white/20' : 'bg-blue-100 text-blue-700'}`}>
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs">Recyclable</h4>
                    <p className={`text-[9px] mt-0.5 ${activeWasteCategory === 'Recyclable' ? 'text-blue-200' : 'text-blue-600'}`}>Bottles, cans, paper</p>
                  </div>
                </button>

                {/* Residual Card (Gray) */}
                <button 
                  onClick={() => setActiveWasteCategory(activeWasteCategory === 'Residual' ? null : 'Residual')}
                  className={`relative p-4 rounded-3xl text-left border flex flex-col justify-between h-[110px] transition-all cursor-pointer ${
                    activeWasteCategory === 'Residual'
                      ? 'bg-slate-600 border-slate-600 text-stone-50 shadow-md ring-2 ring-slate-500/20'
                      : 'bg-slate-100 border-slate-200 text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeWasteCategory === 'Residual' ? 'bg-white/20' : 'bg-slate-200 text-slate-700'}`}>
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs">Residual</h4>
                    <p className={`text-[9px] mt-0.5 ${activeWasteCategory === 'Residual' ? 'text-slate-200' : 'text-slate-500'}`}>Non-recyclable trash</p>
                  </div>
                </button>

                {/* Hazardous Card (Pink/Red) */}
                <button 
                  onClick={() => setActiveWasteCategory(activeWasteCategory === 'Hazardous' ? null : 'Hazardous')}
                  className={`relative p-4 rounded-3xl text-left border flex flex-col justify-between h-[110px] transition-all cursor-pointer ${
                    activeWasteCategory === 'Hazardous'
                      ? 'bg-rose-600 border-rose-600 text-stone-50 shadow-md ring-2 ring-rose-500/20'
                      : 'bg-rose-50 border-rose-100 text-rose-900 hover:bg-rose-100/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeWasteCategory === 'Hazardous' ? 'bg-white/20' : 'bg-rose-100 text-rose-700'}`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs">Hazardous</h4>
                    <p className={`text-[9px] mt-0.5 ${activeWasteCategory === 'Hazardous' ? 'text-rose-200' : 'text-rose-600'}`}>Toxic chemical/e-waste</p>
                  </div>
                </button>

              </div>

              {/* Dynamic Search Result Card */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest px-1">
                  {searchQuery || activeWasteCategory ? 'Filtered Matches' : 'Recent Search Result'}
                </h3>

                {filteredWaste.length > 0 ? (
                  <div className="space-y-3">
                    {filteredWaste.map(item => (
                      <div 
                        key={item.id}
                        onClick={() => {
                          setRecentSearchResult(item)
                          showToast(`Selected ${item.name}`, 0)
                        }}
                        className={`bg-white p-4 rounded-3xl border transition-all duration-200 cursor-pointer ${
                          recentSearchResult?.id === item.id 
                            ? 'border-emerald-500 shadow-xs ring-1 ring-emerald-500/10' 
                            : 'border-stone-200/50 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl border border-stone-100 shadow-2xs" />
                          <div className="flex-1">
                            <h4 className="font-extrabold text-stone-900 text-sm leading-snug">{item.name}</h4>
                            
                            {/* Badges based on categorization */}
                            <span className={`inline-block text-[9px] font-black uppercase mt-1 px-2.5 py-0.5 rounded-full ${
                              item.category === 'Biodegradable' ? 'bg-emerald-100 text-emerald-800' :
                              item.category === 'Recyclable' ? 'bg-blue-100 text-blue-800' :
                              item.category === 'Hazardous' ? 'bg-rose-100 text-rose-800' :
                              'bg-slate-100 text-slate-800'
                            }`}>
                              {item.category}
                            </span>
                          </div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            item.category === 'Biodegradable' ? 'bg-emerald-50 text-emerald-600' :
                            item.category === 'Recyclable' ? 'bg-blue-50 text-blue-600' :
                            item.category === 'Hazardous' ? 'bg-rose-50 text-rose-600' :
                            'bg-slate-50 text-slate-600'
                          }`}>
                            <Check className="w-4.5 h-4.5" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-stone-50 border border-stone-200/60 p-6 rounded-3xl text-center space-y-2">
                    <AlertTriangle className="w-8 h-8 text-stone-400 mx-auto" />
                    <h4 className="font-extrabold text-stone-800 text-sm">No items found</h4>
                    <p className="text-xs text-stone-400 max-w-[200px] mx-auto leading-relaxed">Try typing general items like "bottle", "peel", "cardboard" or "battery".</p>
                  </div>
                )}

                {/* Pro Tip Box showing selected item details */}
                {recentSearchResult && (
                  <div className="bg-emerald-50/60 border border-emerald-100 rounded-3xl p-4 flex gap-3 text-emerald-950 animate-slide-up">
                    <Leaf className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-black text-xs uppercase tracking-wider text-emerald-800">Pro Tip</h4>
                      <p className="text-[10px] text-emerald-900 leading-relaxed">
                        {recentSearchResult.tip}
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: CLEAN-UP MAP */}
          {activeTab === 'map' && (
            <div className="flex flex-col h-full animate-slide-up">
              
              {/* Header details */}
              <div className="p-4 bg-stone-50 border-b border-stone-200/50 space-y-1">
                <h2 className="text-2xl font-black text-emerald-950 leading-tight">
                  Clean-Up Map
                </h2>
                <p className="text-stone-500 text-xs font-medium">
                  Tap leaves to locate community campus events.
                </p>
              </div>

              {/* Map Canvas - CSS simulated vector map layout */}
              <div className="relative w-full h-[280px] bg-slate-200 overflow-hidden border-b border-stone-200/50 shadow-inner">
                {/* Simulated geometric streets & water blocks */}
                <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none"></div>
                {/* River block */}
                <div className="absolute top-0 right-0 w-24 h-full bg-blue-100/60 rotate-12 border-l-4 border-r-4 border-blue-200/40 pointer-events-none"></div>
                {/* Roads */}
                <div className="absolute top-1/3 left-0 w-full h-8 bg-white/70 shadow-2xs border-t border-b border-stone-300/30 -rotate-2 pointer-events-none"></div>
                <div className="absolute left-1/3 top-0 w-8 h-full bg-white/70 shadow-2xs border-l border-r border-stone-300/30 rotate-12 pointer-events-none"></div>
                {/* Park block */}
                <div className="absolute top-12 left-6 w-32 h-20 bg-emerald-100/60 rounded-3xl border border-emerald-200/40 pointer-events-none"></div>
                <div className="absolute bottom-6 right-16 w-28 h-20 bg-teal-100/60 rounded-3xl border border-teal-200/40 pointer-events-none"></div>

                {/* Simulated leaf pin 1 (Canal Cleanup) */}
                <button 
                  onClick={() => setSelectedMapEventId('canal')}
                  className={`absolute top-[40%] left-[35%] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-md ${
                    selectedMapEventId === 'canal' 
                      ? 'bg-emerald-600 text-stone-50 scale-120 ring-4 ring-emerald-500/25' 
                      : 'bg-white text-emerald-600 hover:scale-110'
                  }`}
                >
                  <Leaf className="w-5 h-5 fill-current" />
                </button>

                {/* Simulated leaf pin 2 (Park Trash Sweep) */}
                <button 
                  onClick={() => setSelectedMapEventId('park')}
                  className={`absolute top-[65%] left-[60%] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-md ${
                    selectedMapEventId === 'park' 
                      ? 'bg-emerald-600 text-stone-50 scale-120 ring-4 ring-emerald-500/25' 
                      : 'bg-white text-emerald-600 hover:scale-110'
                  }`}
                >
                  <Leaf className="w-5 h-5 fill-current" />
                </button>

                {/* Simulated leaf pin 3 (Eco Campus Cleanup) */}
                <button 
                  onClick={() => setSelectedMapEventId('campus')}
                  className={`absolute top-[30%] left-[70%] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-md ${
                    selectedMapEventId === 'campus' 
                      ? 'bg-emerald-600 text-stone-50 scale-120 ring-4 ring-emerald-500/25' 
                      : 'bg-white text-emerald-600 hover:scale-110'
                  }`}
                >
                  <Leaf className="w-5 h-5 fill-current" />
                </button>

                {/* Compass HUD icon */}
                <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-xs p-2.5 rounded-full shadow-md text-stone-600 border border-stone-200/50">
                  <Compass className="w-5 h-5 animate-spin-slow" />
                </div>
              </div>

              {/* Event slider cards at the bottom */}
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    Available Campaigns
                  </h3>
                  <div className="flex gap-1.5">
                    {CLEANUP_EVENTS.map(evt => (
                      <button
                        key={evt.id}
                        type="button"
                        onClick={() => setSelectedMapEventId(evt.id)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                          selectedMapEventId === evt.id ? 'bg-emerald-600 w-5' : 'bg-stone-300'
                        }`}
                      ></button>
                    ))}
                  </div>
                </div>

                {/* Currently selected Event card overlay layout */}
                {(() => {
                  const event = CLEANUP_EVENTS.find(e => e.id === selectedMapEventId)
                  if (!event) return null
                  const isJoined = joinedEvents.includes(event.id)

                  return (
                    <div className="bg-white rounded-3xl border border-stone-200/50 overflow-hidden shadow-xs animate-scale-in">
                      <div className="relative h-32 w-full">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        <span className="absolute top-3 right-3 bg-emerald-950/80 text-stone-50 text-[10px] font-black uppercase px-3 py-1 rounded-full backdrop-blur-xs tracking-wider">
                          {event.distance}
                        </span>
                        
                        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-stone-950/60 to-transparent"></div>
                        <h4 className="absolute bottom-3 left-4 font-black text-stone-50 text-base tracking-tight font-display">
                          {event.title}
                        </h4>
                      </div>

                      <div className="p-4 space-y-3.5">
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[11px] font-bold text-stone-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-emerald-600" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-emerald-600" />
                            <span>{event.attendees + (isJoined ? 1 : 0)} Attending</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200/40">
                            <Award className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>+{event.points} XP</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-stone-500 leading-relaxed">
                          {event.description}
                        </p>

                        <button 
                          onClick={() => handleToggleJoinCleanup(event)}
                          className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all duration-200 active:scale-98 cursor-pointer shadow-xs flex items-center justify-center gap-2 ${
                            isJoined 
                              ? 'bg-amber-500 hover:bg-amber-600 text-stone-900 shadow-md ring-2 ring-amber-400/25' 
                              : 'bg-emerald-600 hover:bg-emerald-700 text-stone-50'
                          }`}
                        >
                          {isJoined ? (
                            <>
                              <CheckCircle2 className="w-4.5 h-4.5 fill-current" />
                              Joined! (Cancel)
                            </>
                          ) : (
                            <>
                              <PlusCircle className="w-4.5 h-4.5" />
                              Join Clean-Up
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })()}

              </div>

            </div>
          )}

          {/* TAB 5: REWARDS & ACHIEVEMENTS */}
          {activeTab === 'rewards' && (
            <div className="p-4 space-y-5 animate-slide-up">
              
              {/* Header card display */}
              <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-3xl p-5 text-stone-50 shadow-md space-y-4">
                <div className="text-center py-2 space-y-0.5">
                  <p className="text-xs font-semibold text-emerald-200 tracking-widest uppercase">Your Eco Points</p>
                  <p className="text-4xl font-black tracking-tight font-display">{ecoPoints} pts</p>
                </div>
                
                {/* Level Tracker */}
                <div className="space-y-2 border-t border-white/10 pt-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold tracking-wide text-emerald-100">
                      Level {computeLevel(totalPoints)}: Earth Guardian
                    </span>
                    <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      2x multiplier active
                    </span>
                  </div>

                  {/* progress loader */}
                  <div className="w-full bg-emerald-900/40 rounded-full h-3 p-0.5 border border-white/5">
                    <div 
                      className="bg-amber-400 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(currentLevelProgress / 500) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-[9px] text-emerald-200 font-bold uppercase">
                    <span>{totalPoints} / {Math.ceil((totalPoints + 1) / 500) * 500} Total XP</span>
                    <span>{pointsNeededForNextLevel} XP to Level {currentLevel + 1}</span>
                  </div>
                </div>
              </div>

              {/* Achievements/Badges section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest px-1">
                  Badges & Achievements
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Badge 1: Eco Hero */}
                  <div className="bg-white p-4 rounded-3xl border border-stone-200/50 shadow-2xs text-center space-y-2 flex flex-col items-center">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-xs">
                      <Award className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-stone-900 text-xs leading-snug">Eco Hero</h4>
                      <p className="text-[9px] text-emerald-600 font-bold uppercase mt-0.5">Unlocked</p>
                    </div>
                  </div>

                  {/* Badge 2: Recycling Star */}
                  <div className="bg-white p-4 rounded-3xl border border-stone-200/50 shadow-2xs text-center space-y-2 flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-xs">
                      <Trash2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-stone-900 text-xs leading-snug">Recycling Star</h4>
                      <p className="text-[9px] text-blue-600 font-bold uppercase mt-0.5">Unlocked</p>
                    </div>
                  </div>

                  {/* Badge 3: Volunteer */}
                  <div className={`p-4 rounded-3xl border text-center space-y-2 flex flex-col items-center transition-all ${
                    cleanupsCount >= 16 
                      ? 'bg-white border-stone-200/50 text-stone-800' 
                      : 'bg-stone-50 border-stone-100 text-stone-400 opacity-60'
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xs ${cleanupsCount >= 16 ? 'bg-indigo-50 text-indigo-600' : 'bg-stone-200 text-stone-400'}`}>
                      <Compass className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs leading-snug">Clean-Up Hero</h4>
                      <p className="text-[9px] font-bold uppercase mt-0.5">
                        {cleanupsCount >= 16 ? 'Unlocked' : '15/16 Clean-ups'}
                      </p>
                    </div>
                  </div>

                  {/* Badge 4: Plastic Saver */}
                  <div className={`p-4 rounded-3xl border text-center space-y-2 flex flex-col items-center transition-all ${
                    totalPoints >= 3000 
                      ? 'bg-white border-stone-200/50 text-stone-800' 
                      : 'bg-stone-50 border-stone-100 text-stone-400 opacity-60'
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xs ${totalPoints >= 3000 ? 'bg-amber-50 text-amber-600' : 'bg-stone-200 text-stone-400'}`}>
                      <Leaf className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs leading-snug">Plastic Saver</h4>
                      <p className="text-[9px] font-bold uppercase mt-0.5">
                        {totalPoints >= 3000 ? 'Unlocked' : `${totalPoints}/3000 XP`}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Redemption Vouchers */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest px-1">
                  Redeemable Vouchers
                </h3>

                <div className="space-y-3">
                  
                  {/* Voucher 1: Free Transit Pass */}
                  <div className="bg-white p-4 rounded-3xl border border-stone-200/50 shadow-2xs flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-black">
                        <Gift className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-stone-900 text-sm">Free Transit Pass</h4>
                        <p className="text-[10px] text-stone-400 font-semibold">150 Points needed</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleRedeemVoucher('transit', 150, 'Free Transit Pass')}
                      disabled={ecoPoints < 150}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-200 disabled:text-stone-400 text-stone-50 text-xs font-black px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Redeem
                    </button>
                  </div>

                  {/* Voucher 2: Sustainable Cafe 20% Off */}
                  <div className="bg-white p-4 rounded-3xl border border-stone-200/50 shadow-2xs flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black">
                        <Gift className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-stone-900 text-sm">Campus Cafe 20% Off</h4>
                        <p className="text-[10px] text-stone-400 font-semibold">200 Points needed</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleRedeemVoucher('cafe', 200, 'Sustainable Cafe 20% Off')}
                      disabled={ecoPoints < 200}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-200 disabled:text-stone-400 text-stone-50 text-xs font-black px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Redeem
                    </button>
                  </div>

                </div>
              </div>

              {/* Dynamic Redeemed Vouchers History Feed */}
              {redeemedVouchers.length > 0 && (
                <div className="space-y-3 pt-3">
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest px-1">
                    My Active Tickets ({redeemedVouchers.length})
                  </h3>
                  
                  <div className="space-y-2.5">
                    {redeemedVouchers.map(voucher => (
                      <div 
                        key={voucher.id}
                        onClick={() => setActiveVoucherModal(voucher)}
                        className="bg-emerald-50/40 hover:bg-emerald-50 border border-emerald-250/30 p-4 rounded-3xl flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 bg-emerald-600 text-stone-50 rounded-2xl flex items-center justify-center font-black shadow-2xs">
                            <Check className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-stone-900 text-xs leading-snug">{voucher.name}</h4>
                            <code className="text-[10px] text-emerald-750 font-mono tracking-widest mt-0.5 block">{voucher.code}</code>
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-black group-hover:underline uppercase tracking-wider">Show Code</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 6: BARANGAY ALERTS */}
          {activeTab === 'alerts' && (
            <div className="p-4 space-y-5 animate-slide-up">
              
              {/* Header and Toggle actions */}
              <div className="flex justify-between items-center px-1">
                <div className="space-y-0.5">
                  <h2 className="text-2xl font-black text-emerald-950 leading-tight">
                    Barangay Alerts
                  </h2>
                  <p className="text-stone-500 text-xs font-medium">
                    Local municipal announcements
                  </p>
                </div>
                
                <button 
                  type="button"
                  onClick={handleMarkAllAlertsRead}
                  className="text-xs font-black uppercase text-emerald-700 hover:text-emerald-950 transition-colors cursor-pointer animate-pulse-slow"
                >
                  Mark All as Read
                </button>
              </div>

              {/* Stacked Announcement Feed */}
              <div className="space-y-3.5">
                {alerts.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      setAlerts(prev => prev.map(a => a.id === item.id ? { ...a, read: true } : a))
                      showToast(`Opened ${item.badge} notice`, 0)
                    }}
                    className={`bg-white p-4.5 rounded-3xl border transition-all duration-200 shadow-2xs cursor-pointer relative ${
                      !item.read ? 'border-emerald-500/30 bg-emerald-50/10' : 'border-stone-200/50'
                    }`}
                  >
                    {/* Unread indicator dot */}
                    {!item.read && (
                      <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${item.badgeBg}`}>
                          {item.badge}
                        </span>
                        <span className="text-[10px] text-stone-400 font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {item.time}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-stone-900 text-sm leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
                        {item.description}
                      </p>

                      {item.image && (
                        <div className="rounded-2xl overflow-hidden mt-3 h-28 border border-stone-100">
                          <img src={item.image} alt="Alert image" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 7: PROFILE */}
          {activeTab === 'profile' && (
            <div className="p-4 space-y-5 animate-slide-up">
              
              {/* User Header and progress border */}
              <div className="flex flex-col items-center text-center space-y-3.5 py-4">
                
                {/* Circular Avatar framed by border progress ring */}
                <div className="relative">
                  <div className="absolute inset-0 border-4 border-emerald-500 rounded-full animate-spin-slow opacity-25"></div>
                  <div className="w-24 h-24 rounded-full p-1 bg-stone-50 border-2 border-emerald-500/80 shadow-md">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                      alt="Student Avatar" 
                      className="w-full h-full object-cover rounded-full" 
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 text-stone-950 font-black text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {currentLevel}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <h3 className="font-black text-emerald-950 text-lg leading-tight">Student Eco Hero</h3>
                  <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">
                    LEVEL {currentLevel} GREEN GUARDIAN
                  </p>
                </div>
              </div>

              {/* Scoreboard Metrics layout */}
              <div className="bg-white p-5 rounded-3xl border border-stone-200/50 shadow-2xs space-y-4">
                <div className="text-center border-b border-stone-100 pb-3">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider">Accumulated Lifetime Points</p>
                  <p className="text-2xl font-black text-emerald-800 tracking-tight font-display mt-0.5">{totalPoints} Points</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-stone-50 p-3 rounded-2xl text-center space-y-0.5 border border-stone-100">
                    <p className="text-[9px] font-black text-stone-400 uppercase">Reports Submitted</p>
                    <p className="text-lg font-black text-stone-800">{reportsCount}</p>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-2xl text-center space-y-0.5 border border-stone-100">
                    <p className="text-[9px] font-black text-stone-400 uppercase">Clean-ups Joined</p>
                    <p className="text-lg font-black text-stone-800">{cleanupsCount}</p>
                  </div>
                </div>
              </div>

              {/* Dynamic Environmental Reports History Feed */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest px-1">
                  My Environmental Reports ({submittedReports.length})
                </h3>

                {submittedReports.length > 0 ? (
                  <div className="space-y-3.5">
                    {submittedReports.map(report => (
                      <div key={report.id} className="bg-white rounded-3xl border border-stone-200/50 overflow-hidden shadow-2xs animate-scale-in">
                        <div className="relative h-24 bg-stone-100">
                          <img src={report.photo} alt={report.type} className="w-full h-full object-cover" />
                          <span className="absolute top-2.5 right-2.5 bg-emerald-950/80 text-stone-50 text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                            {report.date}
                          </span>
                        </div>
                        <div className="p-4 space-y-2">
                          <div className="flex justify-between items-center gap-2">
                            <span className="inline-block text-[9px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {report.type}
                            </span>
                            <span className="text-[10px] text-stone-400 font-semibold flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              {report.address.length > 25 ? report.address.slice(0, 25) + '...' : report.address}
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-600 font-medium leading-relaxed">
                            {report.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-stone-200/50 p-6 rounded-3xl text-center space-y-2">
                    <Camera className="w-8 h-8 text-stone-300 mx-auto" />
                    <h4 className="font-extrabold text-stone-700 text-xs">No reports filed yet</h4>
                    <p className="text-[10px] text-stone-400 max-w-[200px] mx-auto leading-relaxed">
                      Use the "Report" tab to snap campus issues and earn your first 50 Eco Points.
                    </p>
                  </div>
                )}
              </div>

              {/* Menu options stack list */}
              <div className="bg-white rounded-3xl border border-stone-200/50 shadow-2xs divide-y divide-stone-100 overflow-hidden">
                <button 
                  onClick={() => showToast("Account details loaded (simulation)", 0)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-stone-50 transition-colors group cursor-pointer"
                >
                  <span className="text-xs font-bold text-stone-850">Account Details</span>
                  <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-600 transition-colors" />
                </button>

                <button 
                  onClick={() => setActiveTab('alerts')}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-stone-50 transition-colors group cursor-pointer"
                >
                  <span className="text-xs font-bold text-stone-850">Notifications</span>
                  <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-600 transition-colors" />
                </button>

                <button 
                  onClick={() => showToast("Help Desk: Email support@ecosnap.edu", 0)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-stone-50 transition-colors group cursor-pointer"
                >
                  <span className="text-xs font-bold text-stone-855">Support & FAQ</span>
                  <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-600 transition-colors" />
                </button>

                <button 
                  onClick={() => {
                    setScreen('splash')
                    showToast("Logged out successfully.", 0)
                  }}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-stone-50 transition-colors group cursor-pointer text-rose-600"
                >
                  <span className="text-xs font-extrabold flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </span>
                  <ChevronRight className="w-4 h-4 text-rose-205 group-hover:text-rose-600 transition-colors" />
                </button>
              </div>

            </div>
          )}

        </main>

        {/* BOTTOM NAVIGATION BAR */}
        <nav className="sticky bottom-0 bg-stone-50 border-t border-stone-200/80 px-2 py-2.5 z-30">
          <div className="grid grid-cols-6 items-center">
            
            {/* Nav Button 1: Home */}
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1.5 py-1 transition-all cursor-pointer ${
                activeTab === 'home' ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <div className={`p-1 rounded-full transition-colors ${activeTab === 'home' ? 'bg-emerald-50' : ''}`}>
                <Home className="w-5 h-5 fill-current" />
              </div>
              <span className="text-[9px] font-bold tracking-tight">Home</span>
            </button>

            {/* Nav Button 2: Report */}
            <button 
              onClick={() => setActiveTab('report')}
              className={`flex flex-col items-center gap-1.5 py-1 transition-all cursor-pointer ${
                activeTab === 'report' ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <div className={`p-1 rounded-full transition-colors ${activeTab === 'report' ? 'bg-emerald-50' : ''}`}>
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold tracking-tight">Report</span>
            </button>

            {/* Nav Button 3: Waste Sorter */}
            <button 
              onClick={() => setActiveTab('waste')}
              className={`flex flex-col items-center gap-1.5 py-1 transition-all cursor-pointer ${
                activeTab === 'waste' ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <div className={`p-1 rounded-full transition-colors ${activeTab === 'waste' ? 'bg-emerald-50' : ''}`}>
                <Trash2 className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold tracking-tight">Sorter</span>
            </button>

            {/* Nav Button 4: Clean-Up Map */}
            <button 
              onClick={() => setActiveTab('map')}
              className={`flex flex-col items-center gap-1.5 py-1 transition-all cursor-pointer ${
                activeTab === 'map' ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <div className={`p-1 rounded-full transition-colors ${activeTab === 'map' ? 'bg-emerald-50' : ''}`}>
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold tracking-tight">Map</span>
            </button>

            {/* Nav Button 5: Rewards */}
            <button 
              onClick={() => setActiveTab('rewards')}
              className={`flex flex-col items-center gap-1.5 py-1 transition-all cursor-pointer ${
                activeTab === 'rewards' ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <div className={`p-1 rounded-full transition-colors ${activeTab === 'rewards' ? 'bg-emerald-50' : ''}`}>
                <Award className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold tracking-tight">Rewards</span>
            </button>

            {/* Nav Button 6: Profile */}
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1.5 py-1 transition-all cursor-pointer ${
                activeTab === 'profile' ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <div className={`p-1 rounded-full transition-colors ${activeTab === 'profile' ? 'bg-emerald-50' : ''}`}>
                <User className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold tracking-tight">Profile</span>
            </button>

          </div>
        </nav>

      </div>
    </div>
  )
}

// Inline custom mini icon components to handle Lucide compatibility safely
function PlusCircle({ className }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 8v8"/>
      <path d="M8 12h8"/>
    </svg>
  )
}

export default App
