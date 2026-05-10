import { useState, useRef, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE ?? ''

/* ═══════════════════════════ DATA ═══════════════════════════ */

const GOALS = [
  {
    id: 'cut',
    label: 'Cut',
    labelZh: '減脂',
    description: 'Lower calories, lean protein, clean carbs',
    emoji: '🔥',
    formValue: 'Cut',
  },
  {
    id: 'lean-gain',
    label: 'Lean Gain',
    labelZh: '增肌',
    description: 'Higher calories, more protein and carbs',
    emoji: '💪',
    formValue: 'Lean Gain',
  },
  {
    id: 'maintain',
    label: 'Maintain',
    labelZh: '維持健康',
    description: 'Balanced meals for daily performance',
    emoji: '⚡',
    formValue: 'Maintain',
  },
]

const MENU_ITEMS = [
  {
    id: 1,
    section: 'bowls',
    nameEn: 'Black Pepper Chicken Bowl',
    nameZh: '黑椒嫩雞腿能量碗',
    goal: 'cut',
    price: 15.99,
    description: 'Black pepper chicken thigh, rice, asparagus, corn, broccoli.',
    kcal: 443, protein: 37, carbs: 44, fat: 11,
    gradient: 'linear-gradient(145deg, #1e1508 0%, #2d2010 50%, #160f06 100%)',
    accentColor: '#8B6914',
    emoji: '🍗',
  },
  {
    id: 2,
    section: 'bowls',
    nameEn: 'Garlic Butter Shrimp Bowl',
    nameZh: '蒜香奶油檸檬蝦能量碗',
    goal: 'cut',
    price: 16.99,
    description: 'Garlic butter shrimp, rice, asparagus, corn, purple cabbage, lemon yogurt sauce.',
    kcal: 456, protein: 39, carbs: 45, fat: 13,
    gradient: 'linear-gradient(145deg, #180e08 0%, #281808 50%, #1a1008 100%)',
    accentColor: '#9B5B14',
    emoji: '🦐',
  },
  {
    id: 3,
    section: 'bowls',
    nameEn: 'Garlic Salmon Bowl',
    nameZh: '香煎鮭魚能量碗',
    goal: 'cut',
    price: 17.99,
    description: 'Seared salmon, rice, asparagus, broccoli, lemon yogurt sauce.',
    kcal: 470, protein: 36, carbs: 40, fat: 15,
    gradient: 'linear-gradient(145deg, #1c0c0a 0%, #2a1210 50%, #1a0c0a 100%)',
    accentColor: '#B05040',
    emoji: '🐟',
  },
  {
    id: 4,
    section: 'bowls',
    nameEn: 'Double Chicken Bulk Bowl',
    nameZh: '雙倍炙燒雞腿增肌碗',
    goal: 'lean-gain',
    price: 17.99,
    description: 'Double grilled chicken thigh, rice, egg, corn, broccoli.',
    kcal: 620, protein: 50, carbs: 64, fat: 17,
    gradient: 'linear-gradient(145deg, #0c1a0e 0%, #142416 50%, #0c1a0e 100%)',
    accentColor: '#3A8A40',
    emoji: '🍗',
  },
  {
    id: 5,
    section: 'bowls',
    nameEn: 'Power Steak Bowl',
    nameZh: '爆發力牛排能量碗',
    goal: 'lean-gain',
    price: 19.99,
    description: 'Seared steak, rice, egg, roasted sweet potato, mushroom, asparagus.',
    kcal: 680, protein: 48, carbs: 65, fat: 22,
    gradient: 'linear-gradient(145deg, #1c0a0a 0%, #2a1212 50%, #1c0a0a 100%)',
    accentColor: '#A03030',
    emoji: '🥩',
  },
  {
    id: 6,
    section: 'pastas',
    nameEn: 'Garlic Butter Shrimp Pasta',
    nameZh: '蒜香奶油蝦義大利麵',
    goal: 'cut',
    price: 17.99,
    description: 'Garlic butter shrimp, pasta, asparagus, broccoli, parmesan, lemon.',
    kcal: 520, protein: 38, carbs: 52, fat: 16,
    gradient: 'linear-gradient(145deg, #181410 0%, #241c10 50%, #181410 100%)',
    accentColor: '#9A7820',
    emoji: '🦐',
  },
  {
    id: 7,
    section: 'pastas',
    nameEn: 'Creamy Chicken Pasta',
    nameZh: '奶油雞腿蘆筍義大利麵',
    goal: 'lean-gain',
    price: 16.99,
    description: 'Grilled chicken thigh, creamy sauce, pasta, asparagus, broccoli, black pepper.',
    kcal: 560, protein: 42, carbs: 58, fat: 17,
    gradient: 'linear-gradient(145deg, #16100a 0%, #201808 50%, #16100a 100%)',
    accentColor: '#A08840',
    emoji: '🍝',
  },
  {
    id: 8,
    section: 'pastas',
    nameEn: 'Spicy Creamy Salmon Pasta',
    nameZh: '辣奶油鮭魚義大利麵',
    goal: 'lean-gain',
    price: 18.99,
    description: 'Seared salmon, spicy creamy sauce, pasta, asparagus, broccoli, mushroom.',
    kcal: 540, protein: 40, carbs: 54, fat: 16,
    gradient: 'linear-gradient(145deg, #1c100a 0%, #281810 50%, #1c100a 100%)',
    accentColor: '#C06830',
    emoji: '🌶️',
  },
]

const ADDONS = [
  {
    id: 'yogurt',
    name: 'Luné Yogurt Bowl',
    price: 10.99,
    emoji: '🥗',
    desc: 'Seasonal fruit, granola & honey drizzle',
  },
  {
    id: 'shake',
    name: 'Protein Shake',
    price: 6.99,
    emoji: '🥤',
    desc: '30g protein per serving · multiple flavors',
  },
]

const BRAND_VALUES = [
  { icon: '🏋️', label: 'High Protein', desc: '35–50g per meal' },
  { icon: '🌿', label: 'Clean Ingredients', desc: 'No processed junk' },
  { icon: '⚖️', label: 'Balanced Nutrition', desc: 'Macro-optimized' },
  { icon: '🔪', label: 'Made Fresh Daily', desc: 'Prepared every morning' },
]

const GOAL_BADGE_STYLES = {
  cut: { bg: 'bg-sky-900/40', text: 'text-sky-300', border: 'border-sky-700/40', label: 'Cut' },
  'lean-gain': { bg: 'bg-orange-900/40', text: 'text-orange-300', border: 'border-orange-700/40', label: 'Lean Gain' },
  maintain: { bg: 'bg-violet-900/40', text: 'text-violet-300', border: 'border-violet-700/40', label: 'Maintain' },
}

/* ═══════════════════════════ ICONS ═══════════════════════════ */

function IconCart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}

function IconX({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function IconCheck({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconCopy() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  )
}

function IconChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

/* ═══════════════════════════ HEADER ═══════════════════════════ */

function Header({ cartCount, onCartOpen }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/98 shadow-2xl shadow-black/60'
          : 'bg-black/85'
      } backdrop-blur-md border-b border-white/[0.06]`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <span className="text-white font-black text-xl tracking-tight leading-none">FORM</span>
          <span className="w-px h-4 bg-white/15" />
          <span className="text-stone-400 font-normal text-[11px] tracking-[0.3em] uppercase mt-px">
            Meals
          </span>
        </div>

        {/* Cart button */}
        <button
          onClick={onCartOpen}
          className="relative flex items-center gap-2 px-3 py-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200 active:scale-95"
          aria-label={`Cart with ${cartCount} items`}
        >
          <IconCart />
          {cartCount > 0 && (
            <>
              <span className="text-white font-bold text-sm">${''}</span>
              <span className="absolute -top-1 -right-1 bg-olive-600 text-white text-[10px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 border-2 border-black">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            </>
          )}
        </button>
      </div>
    </header>
  )
}

/* ═══════════════════════════ HERO ═══════════════════════════ */

function Hero({ onOrderNow }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(107,140,78,0.07) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 50%, rgba(107,140,78,0.04) 0%, transparent 60%)',
        }}
      />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 text-center px-5 max-w-5xl mx-auto pt-20 pb-32">
        {/* Status pill */}
        <div className="inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/10 text-stone-400 text-[11px] font-medium tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-olive-500 animate-pulse" />
          Mississauga · Made Fresh Daily
        </div>

        {/* Brand name */}
        <h1 className="font-black text-white leading-none tracking-tighter mb-1"
          style={{ fontSize: 'clamp(72px, 18vw, 180px)' }}>
          FORM
        </h1>
        <p
          className="font-light text-stone-400 tracking-[0.4em] uppercase mb-10"
          style={{ fontSize: 'clamp(14px, 3vw, 28px)' }}
        >
          Meals
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 justify-center mb-8">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-stone-700" />
          <p className="text-stone-300 text-base sm:text-lg font-light italic">
            "Fuel your form. Power your life."
          </p>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-stone-700" />
        </div>

        {/* Sub-copy */}
        <p className="text-stone-500 text-sm sm:text-base max-w-md mx-auto mb-12 leading-relaxed">
          High-protein meals made for your body goal.
          <br />
          Clean ingredients. Built around you.
        </p>

        {/* CTA */}
        <button
          onClick={onOrderNow}
          className="group inline-flex items-center gap-3 bg-olive-600 hover:bg-olive-500 text-white font-bold text-sm sm:text-base px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-2xl shadow-olive-950/60"
        >
          Order Now
          <span className="group-hover:translate-x-1 transition-transform duration-200">
            <IconChevronRight />
          </span>
        </button>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-700">
        <span className="text-[10px] tracking-[0.25em] uppercase">Scroll</span>
        <span className="animate-bounce text-sm">↓</span>
      </div>
    </section>
  )
}

/* ═══════════════════════════ BRAND VALUES ═══════════════════════════ */

function BrandValues() {
  return (
    <section className="bg-black border-y border-white/[0.05] py-10 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {BRAND_VALUES.map((v, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-2.5 p-4 sm:p-6 rounded-2xl border border-white/[0.06] hover:border-olive-700/40 hover:bg-white/[0.02] transition-all duration-300 group"
            >
              <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-200">
                {v.icon}
              </span>
              <span className="text-white font-semibold text-xs sm:text-sm tracking-wide">
                {v.label}
              </span>
              <span className="text-stone-600 text-xs leading-snug">{v.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════ GOAL SELECTOR ═══════════════════════════ */

function GoalSelector({ selected, onSelect }) {
  return (
    <section id="goal-section" className="bg-stone-950 py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-olive-500 text-[11px] font-semibold tracking-[0.25em] uppercase mb-3">
            Step 01
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
            Choose Your Goal
          </h2>
          <p className="text-stone-500 text-sm">選擇你的目標</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {GOALS.map((goal) => {
            const active = selected === goal.id
            return (
              <button
                key={goal.id}
                onClick={() => onSelect(goal.id)}
                className={`relative text-left p-6 sm:p-7 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  active
                    ? 'border-olive-600 bg-olive-950/40 shadow-xl shadow-olive-950/30'
                    : 'border-stone-800/80 bg-stone-900/30 hover:border-stone-700 hover:bg-stone-900/60'
                }`}
              >
                {active && (
                  <div className="absolute top-4 right-4 w-5 h-5 bg-olive-600 rounded-full flex items-center justify-center">
                    <IconCheck size={10} />
                  </div>
                )}
                <span className="text-3xl sm:text-4xl mb-4 block">{goal.emoji}</span>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-white font-black text-lg sm:text-xl">{goal.label}</span>
                  <span className="text-stone-600 text-xs">/ {goal.labelZh}</span>
                </div>
                <p className={`text-sm leading-relaxed ${active ? 'text-olive-200/80' : 'text-stone-500'}`}>
                  {goal.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════ USER INFO FORM ═══════════════════════════ */

function UserInfoForm({ userInfo, onChange }) {
  const input =
    'w-full bg-stone-900/70 border border-stone-700/50 text-white placeholder-stone-600 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-olive-600/60 focus:ring-1 focus:ring-olive-600/20 transition-all duration-200'
  const label =
    'block text-stone-400 text-[11px] font-semibold tracking-[0.15em] uppercase mb-2'

  return (
    <section id="form-section" className="bg-black py-16 sm:py-20 border-t border-white/[0.05]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-olive-500 text-[11px] font-semibold tracking-[0.25em] uppercase mb-3">
            Step 02
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
            Personalize Your Plan
          </h2>
          <p className="text-stone-500 text-sm">Tell us about yourself</p>
        </div>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className={label}>Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={userInfo.name}
              onChange={(e) => onChange('name', e.target.value)}
              className={input}
            />
          </div>

          {/* Height & Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Height (cm)</label>
              <input
                type="number"
                placeholder="170"
                value={userInfo.height}
                onChange={(e) => onChange('height', e.target.value)}
                className={input}
              />
            </div>
            <div>
              <label className={label}>Weight (kg)</label>
              <input
                type="number"
                placeholder="70"
                value={userInfo.weight}
                onChange={(e) => onChange('weight', e.target.value)}
                className={input}
              />
            </div>
          </div>

          {/* Goal */}
          <div>
            <label className={label}>Goal</label>
            <select
              value={userInfo.goal}
              onChange={(e) => onChange('goal', e.target.value)}
              className={`${input} appearance-none cursor-pointer`}
            >
              <option value="" disabled>
                Select your goal
              </option>
              <option value="Cut">Cut — 減脂</option>
              <option value="Lean Gain">Lean Gain — 增肌</option>
              <option value="Maintain">Maintain — 維持健康</option>
            </select>
          </div>

          {/* Service Type */}
          <div>
            <label className={label}>Service</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'pickup', icon: '🏪', text: 'Pickup' },
                { value: 'delivery', icon: '🚚', text: 'Delivery' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange('serviceType', opt.value)}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                    userInfo.serviceType === opt.value
                      ? 'bg-olive-900/30 border-olive-600/70 text-olive-300'
                      : 'bg-stone-900/70 border-stone-700/50 text-stone-400 hover:border-stone-600 hover:text-stone-300'
                  }`}
                >
                  <span>{opt.icon}</span>
                  {opt.text}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          {userInfo.serviceType === 'delivery' && (
            <div className="animate-fade-in">
              <label className={label}>Delivery Address</label>
              <input
                type="text"
                placeholder="Full delivery address, Mississauga"
                value={userInfo.address}
                onChange={(e) => onChange('address', e.target.value)}
                className={input}
              />
            </div>
          )}

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Preferred Date</label>
              <input
                type="date"
                value={userInfo.date}
                onChange={(e) => onChange('date', e.target.value)}
                className={input}
              />
            </div>
            <div>
              <label className={label}>Preferred Time</label>
              <input
                type="time"
                value={userInfo.time}
                onChange={(e) => onChange('time', e.target.value)}
                className={input}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={label}>Notes / Allergies</label>
            <textarea
              placeholder="Any allergies or special requests..."
              value={userInfo.notes}
              onChange={(e) => onChange('notes', e.target.value)}
              rows={3}
              className={`${input} resize-none leading-relaxed`}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════ GOAL BADGE ═══════════════════════════ */

function GoalBadge({ goal }) {
  const s = GOAL_BADGE_STYLES[goal]
  if (!s) return null
  return (
    <span
      className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md border ${s.bg} ${s.text} ${s.border}`}
    >
      {s.label}
    </span>
  )
}

/* ═══════════════════════════ MENU CARD ═══════════════════════════ */

function MenuCard({ item, quantity, onAdd, onRemove, recommended, imageUrl, soldOut }) {
  return (
    <div
      className={`relative flex flex-col bg-stone-900 rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60 ${
        soldOut
          ? 'border-red-900/50 opacity-70'
          : recommended
          ? 'border-olive-600/50 shadow-lg shadow-olive-950/20'
          : 'border-stone-800/60'
      }`}
    >
      {/* Sold-out overlay */}
      {soldOut && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[1px] pointer-events-none">
          <span className="text-red-400 font-black text-lg tracking-widest uppercase">售完</span>
          <span className="text-red-500/80 text-xs font-semibold tracking-wide mt-0.5">Sold Out</span>
        </div>
      )}

      {/* Recommended badge */}
      {recommended && !soldOut && (
        <div className="absolute top-3 left-3 z-10 bg-olive-600 text-white text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-lg shadow-lg">
          ★ Recommended
        </div>
      )}

      {/* Image area */}
      <div className="relative h-44 sm:h-48 overflow-hidden flex-shrink-0 bg-stone-900">
        {imageUrl ? (
          <img
            src={`${API_BASE}${imageUrl}`}
            alt={item.nameEn}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: item.gradient }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)',
              }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-10"
              style={{ background: 'linear-gradient(to bottom, transparent, #1c1c1c)' }}
            />
            <span className="relative text-6xl sm:text-7xl drop-shadow-2xl select-none">
              {item.emoji}
            </span>
          </div>
        )}
        {/* Goal tag always shown */}
        <div className="absolute bottom-3 right-3 z-10">
          <GoalBadge goal={item.goal} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 pt-4">
        {/* Names */}
        <p className="text-stone-500 text-xs mb-0.5 tracking-wide">{item.nameZh}</p>
        <h3 className="text-white font-bold text-[15px] leading-snug mb-3">
          {item.nameEn}
        </h3>

        {/* Description */}
        <p className="text-stone-500 text-xs leading-relaxed mb-4 flex-1">{item.description}</p>

        {/* Nutrition grid */}
        <div className="grid grid-cols-4 gap-1.5 mb-5">
          {[
            { label: 'kcal', value: item.kcal },
            { label: 'protein', value: `${item.protein}g` },
            { label: 'carbs', value: `${item.carbs}g` },
            { label: 'fat', value: `${item.fat}g` },
          ].map((n) => (
            <div
              key={n.label}
              className="bg-stone-800/60 border border-stone-700/30 rounded-lg px-1.5 py-2 text-center"
            >
              <div className="text-white font-semibold text-[11px] sm:text-xs leading-none mb-1">
                {n.value}
              </div>
              <div className="text-stone-600 text-[8px] sm:text-[9px] uppercase tracking-wide">
                {n.label}
              </div>
            </div>
          ))}
        </div>

        {/* Price + Cart Controls */}
        <div className="flex items-center justify-between">
          <span className="text-white font-black text-xl">${item.price.toFixed(2)}</span>

          {soldOut ? (
            <span className="text-red-500/70 text-xs font-bold uppercase tracking-wider">售完</span>
          ) : quantity === 0 ? (
            <button
              onClick={() => onAdd(item.id)}
              className="bg-olive-600 hover:bg-olive-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 active:scale-[0.95] flex items-center gap-1.5"
            >
              <span className="text-base leading-none">+</span> Add
            </button>
          ) : (
            <div className="flex items-center gap-0.5 bg-stone-800/80 border border-stone-700/50 rounded-xl p-1">
              <button
                onClick={() => onRemove(item.id)}
                className="w-8 h-8 flex items-center justify-center text-stone-300 hover:text-white font-bold rounded-lg hover:bg-white/10 transition-all text-lg leading-none"
              >
                −
              </button>
              <span className="text-white font-bold text-sm w-6 text-center tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => onAdd(item.id)}
                className="w-8 h-8 flex items-center justify-center text-stone-300 hover:text-white font-bold rounded-lg hover:bg-white/10 transition-all text-lg leading-none"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════ MENU SECTION ═══════════════════════════ */

function MenuSection({ cart, onAdd, onRemove, selectedGoal, mealImages, availability }) {
  const bowls = MENU_ITEMS.filter((i) => i.section === 'bowls')
  const pastas = MENU_ITEMS.filter((i) => i.section === 'pastas')

  const isRecommended = (item) => !!selectedGoal && item.goal === selectedGoal

  const grid = (items) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {items.map((item) => (
        <MenuCard
          key={item.id}
          item={item}
          quantity={cart[item.id] || 0}
          onAdd={onAdd}
          onRemove={onRemove}
          recommended={isRecommended(item)}
          imageUrl={mealImages?.[item.id]}
          soldOut={!!availability?.[item.id]}
        />
      ))}
    </div>
  )

  const SectionHeader = ({ en, zh }) => (
    <div className="flex items-end gap-5 mb-8 sm:mb-10">
      <div className="flex-shrink-0">
        <h3 className="text-white font-black text-2xl sm:text-3xl tracking-tight leading-none">
          {en}
        </h3>
        <p className="text-stone-600 text-sm mt-1">{zh}</p>
      </div>
      <div className="flex-1 pb-1">
        <div
          className="h-px"
          style={{
            background: 'linear-gradient(to right, rgba(82,82,91,0.6), transparent)',
          }}
        />
      </div>
    </div>
  )

  return (
    <section id="menu-section" className="bg-stone-950 py-16 sm:py-20 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-olive-500 text-[11px] font-semibold tracking-[0.25em] uppercase mb-3">
            Step 03
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
            The Menu
          </h2>
          <p className="text-stone-500 text-sm max-w-md mx-auto">
            Fresh, macro-optimized meals built for your goal.{' '}
            {selectedGoal && (
              <span className="text-olive-400">
                ★ Recommended picks highlighted for you.
              </span>
            )}
          </p>
        </div>

        {/* Bowls */}
        <div className="mb-16">
          <SectionHeader en="Signature Bowls" zh="高蛋白能量碗系列" />
          {grid(bowls)}
        </div>

        {/* Pastas */}
        <div>
          <SectionHeader en="Performance Pastas" zh="高蛋白義大利麵系列" />
          {grid(pastas)}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════ ADDONS ═══════════════════════════ */

// Maps ADDONS id strings to availability item IDs (9=yogurt, 10=shake)
const ADDON_AVAIL_ID = { yogurt: 9, shake: 10 }

function AddonsSection({ addons, onToggle, availability }) {
  return (
    <section className="bg-black py-12 sm:py-16 border-t border-white/[0.05]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
            Complete Your Order
          </h3>
          <p className="text-stone-500 text-sm">Power up with add-ons</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ADDONS.map((addon) => {
            const checked = addons[addon.id]
            const soldOut = !!availability?.[ADDON_AVAIL_ID[addon.id]]
            return (
              <button
                key={addon.id}
                onClick={() => !soldOut && onToggle(addon.id)}
                disabled={soldOut}
                className={`relative flex items-center gap-4 p-5 sm:p-6 rounded-2xl border-2 text-left transition-all duration-200 active:scale-[0.98] ${
                  soldOut
                    ? 'border-red-900/40 bg-stone-900/30 opacity-60 cursor-not-allowed'
                    : checked
                    ? 'border-olive-600/70 bg-olive-950/30'
                    : 'border-stone-800 bg-stone-900/40 hover:border-stone-700 hover:bg-stone-900/70'
                }`}
              >
                {soldOut && (
                  <div className="absolute top-2 right-2 bg-red-900/80 text-red-300 text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md">
                    售完
                  </div>
                )}
                <span className="text-4xl flex-shrink-0">{addon.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-white font-bold text-sm">{addon.name}</span>
                    <span className={`font-black text-sm flex-shrink-0 ${checked && !soldOut ? 'text-olive-300' : 'text-stone-300'}`}>
                      +${addon.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-stone-500 text-xs leading-snug">{addon.desc}</p>
                </div>
                {!soldOut && (
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      checked
                        ? 'bg-olive-600 border-olive-600'
                        : 'border-stone-600'
                    }`}
                  >
                    {checked && <IconCheck size={10} />}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════ CART DRAWER ═══════════════════════════ */

function CartDrawer({
  isOpen,
  onClose,
  cart,
  cartItems,
  addons,
  onAddonToggle,
  onRemoveItem,
  onQtyChange,
  subtotal,
  addonTotal,
  total,
  onConfirm,
}) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const totalItemCount = cartItems.reduce((a, i) => a + (cart[i.id] || 0), 0)
  const addonCount = (addons.yogurt ? 1 : 0) + (addons.shake ? 1 : 0)

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/75 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[440px] bg-stone-950 border-l border-stone-800/80 z-50 flex flex-col transition-transform duration-350 ease-out will-change-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-5 border-b border-stone-800/80 flex-shrink-0">
          <div>
            <h2 className="text-white font-black text-lg tracking-tight">Your Order</h2>
            <p className="text-stone-500 text-xs mt-0.5">
              {totalItemCount + addonCount} item{totalItemCount + addonCount !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-white rounded-xl hover:bg-white/[0.06] transition-all"
          >
            <IconX />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-3">
          {cartItems.length === 0 && !addons.yogurt && !addons.shake ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4 opacity-60">🛒</div>
              <p className="text-stone-400 text-sm font-medium">Your cart is empty</p>
              <p className="text-stone-600 text-xs mt-1">
                Add some meals below to get started
              </p>
            </div>
          ) : null}

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 bg-stone-900/60 border border-stone-800/60 rounded-2xl p-3.5"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                style={{ background: item.gradient }}
              >
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight line-clamp-1">
                  {item.nameEn}
                </p>
                <p className="text-stone-500 text-xs mt-0.5">${item.price.toFixed(2)} each</p>
              </div>

              {/* Qty controls */}
              <div className="flex items-center gap-0.5 bg-stone-800 rounded-lg p-0.5 flex-shrink-0">
                <button
                  onClick={() => onQtyChange(item.id, -1)}
                  className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-white font-bold text-base rounded-md hover:bg-white/10 transition-all"
                >
                  −
                </button>
                <span className="text-white font-bold text-sm w-5 text-center tabular-nums">
                  {cart[item.id]}
                </span>
                <button
                  onClick={() => onQtyChange(item.id, 1)}
                  className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-white font-bold text-base rounded-md hover:bg-white/10 transition-all"
                >
                  +
                </button>
              </div>

              <div className="text-right flex-shrink-0 min-w-[52px]">
                <p className="text-white font-bold text-sm">
                  ${(item.price * cart[item.id]).toFixed(2)}
                </p>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-stone-700 hover:text-red-400 text-[10px] transition-colors mt-0.5"
                >
                  remove
                </button>
              </div>
            </div>
          ))}

          {/* Addon rows */}
          {addons.yogurt && (
            <div className="flex items-center gap-3 bg-stone-900/60 border border-stone-800/60 rounded-2xl p-3.5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl bg-stone-800">
                🥗
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">Luné Yogurt Bowl</p>
                <p className="text-stone-500 text-xs">Add-on</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-sm">$10.99</p>
                <button
                  onClick={() => onAddonToggle('yogurt')}
                  className="text-stone-700 hover:text-red-400 text-[10px] transition-colors"
                >
                  remove
                </button>
              </div>
            </div>
          )}
          {addons.shake && (
            <div className="flex items-center gap-3 bg-stone-900/60 border border-stone-800/60 rounded-2xl p-3.5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl bg-stone-800">
                🥤
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">Protein Shake</p>
                <p className="text-stone-500 text-xs">Add-on</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-sm">$6.99</p>
                <button
                  onClick={() => onAddonToggle('shake')}
                  className="text-stone-700 hover:text-red-400 text-[10px] transition-colors"
                >
                  remove
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-5 border-t border-stone-800/80 flex-shrink-0">
          <div className="space-y-2 mb-5">
            <div className="flex justify-between text-stone-400 text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {addonTotal > 0 && (
              <div className="flex justify-between text-stone-400 text-sm">
                <span>Add-ons</span>
                <span>${addonTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="h-px bg-stone-800 my-2" />
            <div className="flex justify-between text-white font-black text-xl">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={onConfirm}
            disabled={cartItems.length === 0}
            className="w-full bg-olive-600 hover:bg-olive-500 disabled:bg-stone-800 disabled:text-stone-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-200 active:scale-[0.98] text-sm tracking-wide"
          >
            {cartItems.length === 0 ? 'Add items to continue' : 'Confirm Order →'}
          </button>
        </div>
      </div>
    </>
  )
}

/* ═══════════════════════════ ORDER MODAL ═══════════════════════════ */

function OrderModal({ isOpen, orderText, onClose }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderText)
    } catch {
      const el = document.createElement('textarea')
      el.value = orderText
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-2xl bg-stone-950 rounded-t-3xl sm:rounded-3xl border border-stone-800 overflow-hidden max-h-[92vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-800 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-white font-black text-xl tracking-tight">
                Order Confirmed! 🎉
              </h2>
              <p className="text-stone-500 text-xs mt-1">
                Copy & send via IG DM / WhatsApp / WeChat
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-white rounded-xl hover:bg-white/[0.06] transition-all flex-shrink-0"
            >
              <IconX />
            </button>
          </div>
        </div>

        {/* Order text */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="bg-stone-900/60 border border-stone-800/60 rounded-2xl p-5">
            <pre className="text-stone-300 text-xs sm:text-sm leading-relaxed font-mono whitespace-pre-wrap break-words">
              {orderText}
            </pre>
          </div>
        </div>

        {/* Copy button */}
        <div className="px-6 py-5 border-t border-stone-800 flex-shrink-0">
          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2.5 font-bold py-4 rounded-2xl transition-all duration-300 active:scale-[0.98] text-sm ${
              copied
                ? 'bg-green-900/30 border border-green-700/50 text-green-300'
                : 'bg-olive-600 hover:bg-olive-500 text-white'
            }`}
          >
            {copied ? (
              <>
                <IconCheck size={16} />
                Copied to clipboard!
              </>
            ) : (
              <>
                <IconCopy />
                Copy Order Text
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════ FLOATING CART BAR ═══════════════════════════ */

function FloatingCartBar({ cartCount, total, onClick }) {
  if (cartCount === 0) return null

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 px-4 w-full max-w-sm sm:max-w-md animate-slide-up">
      <button
        onClick={onClick}
        className="w-full bg-olive-600 hover:bg-olive-500 text-white font-bold py-4 px-5 rounded-2xl shadow-2xl shadow-olive-950/70 transition-all duration-200 active:scale-[0.97] flex items-center justify-between"
      >
        <span className="bg-olive-700/60 rounded-xl px-2.5 py-1 text-xs font-black tabular-nums">
          {cartCount}
        </span>
        <span className="text-sm tracking-wide">View Cart</span>
        <span className="font-black text-olive-200 tabular-nums">
          ${total.toFixed(2)}
        </span>
      </button>
    </div>
  )
}

/* ═══════════════════════════ FOOTER ═══════════════════════════ */

function Footer() {
  return (
    <footer className="bg-black border-t border-stone-900 py-14 px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="flex items-center justify-center gap-2.5 mb-4">
          <span className="text-white font-black text-lg">FORM</span>
          <span className="w-px h-3.5 bg-white/15" />
          <span className="text-stone-500 font-normal text-[11px] tracking-[0.3em] uppercase">
            Meals
          </span>
        </div>
        <p className="text-stone-600 text-sm italic mb-2">
          "Fuel your form. Power your life."
        </p>
        <p className="text-stone-700 text-xs tracking-wider">
          Mississauga · Made Fresh Daily
        </p>
        <div className="flex justify-center gap-6 mt-8">
          {['High Protein', 'Clean', 'Balanced', 'Fresh'].map((t) => (
            <span key={t} className="text-stone-800 text-[10px] font-semibold tracking-wider uppercase">
              {t}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════ APP ═══════════════════════════ */

export default function App() {
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [cart, setCart] = useState({})
  const [addons, setAddons] = useState({ yogurt: false, shake: false })
  const [cartOpen, setCartOpen] = useState(false)
  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [orderText, setOrderText] = useState('')
  const [userInfo, setUserInfo] = useState({
    name: '',
    height: '',
    weight: '',
    goal: '',
    serviceType: 'pickup',
    address: '',
    date: '',
    time: '',
    notes: '',
  })

  const menuRef = useRef(null)
  const [mealImages, setMealImages] = useState({})
  const [availability, setAvailability] = useState({})

  useEffect(() => {
    fetch(`${API_BASE}/api/images`)
      .then((r) => r.json())
      .then(setMealImages)
      .catch(() => {})
    fetch(`${API_BASE}/api/availability`)
      .then((r) => r.json())
      .then(setAvailability)
      .catch(() => {})
  }, [])

  /* ── Derived ── */
  const cartItems = MENU_ITEMS.filter((i) => (cart[i.id] || 0) > 0)
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const subtotal = cartItems.reduce((s, i) => s + i.price * (cart[i.id] || 0), 0)
  const addonTotal = (addons.yogurt ? 10.99 : 0) + (addons.shake ? 6.99 : 0)
  const total = subtotal + addonTotal

  /* ── Handlers ── */
  const handleUserInfoChange = (field, value) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleGoalSelect = (goalId) => {
    setSelectedGoal(goalId)
    const g = GOALS.find((g) => g.id === goalId)
    if (g) setUserInfo((prev) => ({ ...prev, goal: g.formValue }))
  }

  const handleAdd = (itemId) => {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }))
  }

  const handleRemove = (itemId) => {
    setCart((prev) => {
      const next = { ...prev }
      if ((next[itemId] || 0) <= 1) delete next[itemId]
      else next[itemId] -= 1
      return next
    })
  }

  const handleRemoveItem = (itemId) => {
    setCart((prev) => {
      const next = { ...prev }
      delete next[itemId]
      return next
    })
  }

  const handleQtyChange = (itemId, delta) => {
    setCart((prev) => {
      const next = (prev[itemId] || 0) + delta
      if (next <= 0) {
        const n = { ...prev }
        delete n[itemId]
        return n
      }
      return { ...prev, [itemId]: next }
    })
  }

  const handleAddonToggle = (id) => {
    setAddons((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleOrderNow = () => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleConfirmOrder = async () => {
    const goalLabel =
      userInfo.goal ||
      GOALS.find((g) => g.id === selectedGoal)?.label ||
      'N/A'

    const itemLines = cartItems
      .map(
        (i) =>
          `  • ${i.nameEn} (${i.nameZh}) × ${cart[i.id]}  —  $${(i.price * cart[i.id]).toFixed(2)}`
      )
      .join('\n')

    const addonLines = [
      addons.yogurt ? `  • Luné Yogurt Bowl × 1  —  $10.99` : null,
      addons.shake ? `  • Protein Shake × 1  —  $6.99` : null,
    ]
      .filter(Boolean)
      .join('\n')

    const lines = [
      '🥗 FORM Meals — Order',
      '━━━━━━━━━━━━━━━━━━━━━━━━━',
      `👤 Name: ${userInfo.name || 'N/A'}`,
      `🎯 Goal: ${goalLabel}`,
      `📏 Height: ${userInfo.height ? `${userInfo.height} cm` : 'N/A'}`,
      `⚖️  Weight: ${userInfo.weight ? `${userInfo.weight} kg` : 'N/A'}`,
      `🚗 Service: ${userInfo.serviceType === 'pickup' ? 'Pickup' : 'Delivery'}`,
    ]

    if (userInfo.serviceType === 'delivery' && userInfo.address) {
      lines.push(`📍 Address: ${userInfo.address}`)
    }

    lines.push(
      `📅 Date: ${userInfo.date || 'TBD'}`,
      `⏰ Time: ${userInfo.time || 'TBD'}`,
      '',
      '📋 Items:',
      itemLines
    )

    if (addonLines) {
      lines.push('', '➕ Add-ons:', addonLines)
    }

    lines.push(
      '',
      `💰 Subtotal: $${subtotal.toFixed(2)}`
    )

    if (addonTotal > 0) {
      lines.push(`➕ Add-ons: $${addonTotal.toFixed(2)}`)
    }

    lines.push(
      `💳 Total: $${total.toFixed(2)}`
    )

    if (userInfo.notes) {
      lines.push('', `📝 Notes: ${userInfo.notes}`)
    }

    lines.push(
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Thank you for choosing FORM Meals!',
      'Fuel your form. Power your life. 💪'
    )

    const text = lines.join('\n')
    setOrderText(text)

    // Send to backend (non-blocking — order modal shows regardless)
    try {
      await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userInfo.name,
          goal: goalLabel,
          height: userInfo.height,
          weight: userInfo.weight,
          serviceType: userInfo.serviceType,
          address: userInfo.address,
          date: userInfo.date,
          time: userInfo.time,
          notes: userInfo.notes,
          items: cartItems.map((i) => ({
            id: i.id,
            nameEn: i.nameEn,
            nameZh: i.nameZh,
            quantity: cart[i.id],
            price: i.price,
            total: +(i.price * cart[i.id]).toFixed(2),
          })),
          addons: { yogurt: addons.yogurt, shake: addons.shake },
          subtotal,
          addonTotal,
          total,
          orderText: text,
        }),
      })
    } catch {
      // Backend unreachable — still show the order summary to the customer
    }

    setCartOpen(false)
    setTimeout(() => setOrderModalOpen(true), 200)
  }

  return (
    <div className="min-h-screen bg-black">
      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      <main>
        <Hero onOrderNow={handleOrderNow} />
        <BrandValues />
        <GoalSelector selected={selectedGoal} onSelect={handleGoalSelect} />
        <UserInfoForm userInfo={userInfo} onChange={handleUserInfoChange} />
        <div ref={menuRef}>
          <MenuSection
            cart={cart}
            onAdd={handleAdd}
            onRemove={handleRemove}
            selectedGoal={selectedGoal}
            mealImages={mealImages}
            availability={availability}
          />
        </div>
        <AddonsSection addons={addons} onToggle={handleAddonToggle} availability={availability} />
      </main>

      <Footer />

      {/* Floating cart bar */}
      {!cartOpen && (
        <FloatingCartBar
          cartCount={cartCount}
          total={total}
          onClick={() => setCartOpen(true)}
        />
      )}

      {/* Cart drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        cartItems={cartItems}
        addons={addons}
        onAddonToggle={handleAddonToggle}
        onRemoveItem={handleRemoveItem}
        onQtyChange={handleQtyChange}
        subtotal={subtotal}
        addonTotal={addonTotal}
        total={total}
        onConfirm={handleConfirmOrder}
      />

      {/* Order summary modal */}
      <OrderModal
        isOpen={orderModalOpen}
        orderText={orderText}
        onClose={() => setOrderModalOpen(false)}
      />
    </div>
  )
}
