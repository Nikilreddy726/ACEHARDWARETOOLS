import React from 'react';

interface SvgIllustrationProps {
  name: string;
  className?: string;
}

export function SvgIllustration({ name, className = 'w-full h-full' }: SvgIllustrationProps) {
  const n = name.toLowerCase();

  // 1. Paints and Finishes (bucket, rollers, spray)
  if (n.includes('paint') || n.includes('finish') || n.includes('spray')) {
    return (
      <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="paintBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="bucketMetal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="paintDrip" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>
        {/* Background with subtle grid */}
        <rect width="400" height="400" fill="url(#paintBg)" rx="16" />
        <g opacity="0.08">
          <circle cx="200" cy="200" r="150" fill="none" stroke="#fff" strokeWidth="4" />
          <circle cx="200" cy="200" r="100" fill="none" stroke="#fff" strokeWidth="2" />
        </g>
        
        {/* Paint Roller handle */}
        <path d="M120 280 L120 330 M120 330 L110 340" stroke="#475569" strokeWidth="12" strokeLinecap="round" />
        <path d="M120 280 L180 280 L180 220" fill="none" stroke="#64748b" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Paint Can / Bucket body */}
        <ellipse cx="230" cy="180" rx="60" ry="20" fill="#64748b" />
        <path d="M170 180 L180 290 C180 310, 280 310, 290 290 L300 180 Z" fill="url(#bucketMetal)" />
        <ellipse cx="235" cy="182" rx="55" ry="16" fill="#475569" />
        
        {/* Wet Paint Liquid in bucket */}
        <ellipse cx="235" cy="184" rx="52" ry="14" fill="#ef4444" />
        
        {/* Paint Label */}
        <path d="M182 220 C200 225, 260 225, 288 220 L285 260 C260 265, 200 265, 184 260 Z" fill="#1e293b" />
        <text x="235" y="245" fill="#facc15" fontSize="16" fontWeight="bold" textAnchor="middle">APEX</text>
        
        {/* Paint drips running down the side */}
        <path d="M185 186 Q195 210, 195 230 Q195 240, 190 240 Q185 240, 185 220 Z" fill="#ef4444" />
        <path d="M220 190 Q225 220, 228 250 Q230 260, 225 260 Q220 260, 220 230 Z" fill="#ef4444" />
        
        {/* Paint Roller Cushion */}
        <rect x="130" y="140" width="100" height="50" rx="10" fill="#f43f5e" />
        <rect x="140" y="150" width="80" height="30" rx="6" fill="#fda4af" opacity="0.6" />
        
        {/* Splat effect on background */}
        <path d="M80 120 Q60 140, 70 160 Q90 180, 110 160 Q130 140, 110 110 Q90 90, 80 120 Z" fill="#f43f5e" opacity="0.3" />
      </svg>
    );
  }

  // 2. Power Tools (Drills, Grinders, Saws)
  if (n.includes('drill') || n.includes('grinder') || n.includes('saw') || n.includes('tool')) {
    const isDewalt = n.includes('dewalt');
    const isBosch = n.includes('bosch');
    const primaryColor = isDewalt ? '#eab308' : isBosch ? '#1d4ed8' : '#0ea5e9';
    const secondaryColor = isDewalt ? '#1e293b' : isBosch ? '#0f172a' : '#334155';
    const brandText = isDewalt ? 'DeWALT' : isBosch ? 'BOSCH' : 'ACE';

    // Grinder specific representation
    if (n.includes('grinder')) {
      return (
        <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grinderBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="steel" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" fill="url(#grinderBg)" rx="16" />
          <g opacity="0.1" stroke="#fff" strokeWidth="2" fill="none">
            <circle cx="200" cy="200" r="160" />
            <line x1="200" y1="0" x2="200" y2="400" />
            <line x1="0" y1="200" x2="400" y2="200" />
          </g>
          
          {/* Bench Grinder Motor Base */}
          <path d="M120 280 L280 280 L260 220 L140 220 Z" fill="#334155" stroke="#475569" strokeWidth="4" />
          <rect x="150" y="240" width="100" height="20" rx="4" fill="#1e293b" />
          <circle cx="200" cy="250" r="6" fill="#ef4444" /> {/* Switch */}
          
          {/* Main Motor Cylindrical Body */}
          <rect x="110" y="160" width="180" height="70" rx="10" fill="#15803d" />
          <rect x="130" y="165" width="140" height="60" rx="5" fill="#166534" opacity="0.5" />
          
          {/* Left Wheel */}
          <rect x="50" y="120" width="40" height="150" rx="8" fill="url(#steel)" />
          <rect x="45" y="115" width="50" height="160" rx="12" fill="none" stroke="#94a3b8" strokeWidth="4" />
          
          {/* Right Wheel */}
          <rect x="310" y="120" width="40" height="150" rx="8" fill="url(#steel)" />
          <rect x="305" y="115" width="50" height="160" rx="12" fill="none" stroke="#94a3b8" strokeWidth="4" />
          
          {/* Shaft connecting wheels */}
          <rect x="90" y="185" width="220" height="20" fill="#cbd5e1" />
          
          {/* Safety Guards / Spark Shields */}
          <path d="M50 120 C50 80, 110 80, 110 120" fill="none" stroke="#f1f5f9" strokeWidth="4" opacity="0.6" />
          <path d="M290 120 C290 80, 350 80, 350 120" fill="none" stroke="#f1f5f9" strokeWidth="4" opacity="0.6" />
          
          {/* Text branding */}
          <text x="200" y="200" fill="#ffffff" fontSize="14" fontWeight="extrabold" textAnchor="middle" letterSpacing="2">HEAVY DUTY</text>
        </svg>
      );
    }

    // Circular Saw representation
    if (n.includes('saw') || n.includes('circular')) {
      return (
        <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sawBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <linearGradient id="chrome" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" fill="url(#sawBg)" rx="16" />
          
          {/* Metal base shoe plate */}
          <path d="M80 290 L320 290 L310 310 L90 310 Z" fill="#94a3b8" />
          
          {/* Blade guard - upper */}
          <path d="M120 230 A80 80 0 0 1 280 230" fill="none" stroke="#ef4444" strokeWidth="24" strokeLinecap="round" />
          
          {/* Chrome Blade */}
          <circle cx="200" cy="230" r="70" fill="url(#chrome)" stroke="#94a3b8" strokeWidth="2" />
          {/* Teeth details */}
          <g stroke="#475569" strokeWidth="3">
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i * 360) / 16;
              const rad = (angle * Math.PI) / 180;
              const x1 = 200 + Math.cos(rad) * 65;
              const y1 = 230 + Math.sin(rad) * 65;
              const x2 = 200 + Math.cos(rad + 0.1) * 75;
              const y2 = 230 + Math.sin(rad + 0.1) * 75;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
          </g>
          <circle cx="200" cy="230" r="20" fill="#1e293b" />
          
          {/* Motor housing and handle */}
          <rect x="210" y="180" width="80" height="60" rx="8" fill="#1e293b" />
          <path d="M170 160 C170 120, 240 120, 260 160" fill="none" stroke="#ef4444" strokeWidth="20" strokeLinecap="round" />
          <path d="M180 160 C180 135, 230 135, 245 160" fill="none" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
          
          <text x="250" y="215" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">600W</text>
        </svg>
      );
    }

    // Default Drill (Dewalt / Bosch style)
    return (
      <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="drillBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="metal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#drillBg)" rx="16" />
        
        {/* Tech Grid Lines */}
        <g opacity="0.08" stroke="#fff" strokeWidth="1">
          <line x1="50" y1="0" x2="50" y2="400" />
          <line x1="150" y1="0" x2="150" y2="400" />
          <line x1="250" y1="0" x2="250" y2="400" />
          <line x1="350" y1="0" x2="350" y2="400" />
          <line x1="0" y1="100" x2="400" y2="100" />
          <line x1="0" y1="200" x2="400" y2="200" />
          <line x1="0" y1="300" x2="400" y2="300" />
        </g>

        {/* Drill Chuck & Bit */}
        <rect x="50" y="145" width="40" height="8" fill="url(#metal)" rx="1" />
        <rect x="90" y="130" width="30" height="38" fill="#475569" rx="3" />
        <path d="M120 120 L140 135 L140 165 L120 180 Z" fill="url(#metal)" />
        
        {/* Main Drill Body */}
        <path d="M140 110 L280 110 C295 110, 310 125, 310 145 L310 170 C310 190, 290 200, 270 200 L180 200 L140 180 Z" fill={primaryColor} />
        
        {/* Rubberized body overlays */}
        <path d="M210 110 L280 110 C295 110, 305 120, 305 135 L300 170 C295 185, 280 195, 260 195 L220 195 Z" fill={secondaryColor} opacity="0.8" />
        
        {/* Handle */}
        <path d="M210 200 L250 200 L230 310 C230 320, 210 330, 190 330 L180 330 Z" fill={secondaryColor} />
        <path d="M200 215 L225 215 L205 315 L185 315 Z" fill={primaryColor} opacity="0.9" />

        {/* Battery Pack at bottom of handle */}
        <rect x="150" y="320" width="90" height="30" rx="6" fill={secondaryColor} stroke={primaryColor} strokeWidth="2" />
        <rect x="160" y="325" width="70" height="8" rx="2" fill="#22c55e" /> {/* LED charge indicator */}

        {/* Trigger Button */}
        <path d="M195 220 L185 225 L185 245 L195 250 Z" fill="#ef4444" />

        {/* Technical Details vents */}
        <g stroke={secondaryColor} strokeWidth="3" opacity="0.4">
          <line x1="260" y1="130" x2="280" y2="130" />
          <line x1="255" y1="140" x2="275" y2="140" />
          <line x1="250" y1="150" x2="270" y2="150" />
        </g>
        
        {/* Brand Text */}
        <text x="220" y="175" fill="#ffffff" fontSize="16" fontWeight="900" fontStyle="italic">{brandText}</text>
        <text x="220" y="190" fill="#facc15" fontSize="10" fontWeight="bold">18V MAX</text>
      </svg>
    );
  }

  // 3. Cement & Concrete
  if (n.includes('cement') || n.includes('concrete') || n.includes('block')) {
    return (
      <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cementBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d1d5db" />
            <stop offset="100%" stopColor="#9ca3af" />
          </linearGradient>
          <linearGradient id="bagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#cementBg)" rx="16" />
        
        {/* Abstract blocks in background */}
        <g fill="#9ca3af" opacity="0.3">
          <rect x="50" y="280" width="80" height="40" rx="4" />
          <rect x="140" y="280" width="80" height="40" rx="4" />
          <rect x="95" y="235" width="80" height="40" rx="4" />
        </g>
        
        {/* Cement Bag */}
        <path d="M120 130 L280 110 C290 110, 310 130, 310 150 L290 320 C290 330, 270 340, 250 340 L110 320 C100 320, 90 300, 90 280 L100 150 C100 130, 110 130, 120 130 Z" fill="url(#bagGrad)" />
        
        {/* Wrinkles / Texture on bag */}
        <path d="M100 180 Q150 170, 200 190 Q250 210, 300 170" fill="none" stroke="#a16207" strokeWidth="4" opacity="0.5" />
        <path d="M95 240 Q160 230, 210 260 Q260 290, 295 250" fill="none" stroke="#a16207" strokeWidth="4" opacity="0.5" />
        
        {/* Stitching details top and bottom */}
        <line x1="110" y1="125" x2="290" y2="105" stroke="#334155" strokeWidth="6" strokeDasharray="5,5" />
        <line x1="100" y1="324" x2="265" y2="334" stroke="#334155" strokeWidth="6" strokeDasharray="5,5" />

        {/* Stencil Label */}
        <rect x="120" y="190" width="150" height="60" fill="#334155" rx="6" />
        <text x="195" y="225" fill="#facc15" fontSize="24" fontWeight="900" textAnchor="middle" letterSpacing="4">CEMENT</text>
        <text x="195" y="242" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">50 KG NETT</text>
        
        <text x="195" y="165" fill="#1e293b" fontSize="14" fontWeight="extrabold" textAnchor="middle">ULTRATECH</text>
      </svg>
    );
  }

  // 4. Iron & Steel
  if (n.includes('iron') || n.includes('steel') || n.includes('bar') || n.includes('rod')) {
    return (
      <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="steelBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="metalSilver" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#steelBg)" rx="16" />
        
        {/* Steel Beams (TMT Rebars) */}
        <g transform="rotate(-30 200 200)">
          {/* Rod 1 */}
          <rect x="60" y="100" width="40" height="280" rx="6" fill="url(#metalSilver)" />
          {/* Ribs (textures) on Rod 1 */}
          {Array.from({ length: 12 }).map((_, i) => (
            <path key={i} d={`M60 ${110 + i * 22} L100 ${120 + i * 22}`} stroke="#475569" strokeWidth="4" strokeLinecap="round" key={i} />
          ))}
          
          {/* Rod 2 */}
          <rect x="180" y="40" width="40" height="280" rx="6" fill="url(#metalSilver)" />
          {/* Ribs on Rod 2 */}
          {Array.from({ length: 12 }).map((_, i) => (
            <path key={i} d={`M180 ${50 + i * 22} L220 ${60 + i * 22}`} stroke="#475569" strokeWidth="4" strokeLinecap="round" key={i} />
          ))}

          {/* Rod 3 */}
          <rect x="300" y="80" width="40" height="280" rx="6" fill="url(#metalSilver)" />
          {/* Ribs on Rod 3 */}
          {Array.from({ length: 12 }).map((_, i) => (
            <path key={i} d={`M300 ${90 + i * 22} L340 ${100 + i * 22}`} stroke="#475569" strokeWidth="4" strokeLinecap="round" key={i} />
          ))}
        </g>
        
        {/* Steel specs badge overlay */}
        <rect x="30" y="320" width="130" height="50" rx="8" fill="#eab308" opacity="0.9" />
        <text x="95" y="342" fill="#1e293b" fontSize="12" fontWeight="bold" textAnchor="middle">JSW NEOSTEEL</text>
        <text x="95" y="360" fill="#1e293b" fontSize="16" fontWeight="extrabold" textAnchor="middle">12mm TMT</text>
      </svg>
    );
  }

  // 5. Electrical Items
  if (n.includes('wire') || n.includes('electrical') || n.includes('cable') || n.includes('bulb') || n.includes('led') || n.includes('breaker') || n.includes('switch')) {
    // LED light specific illustration
    if (n.includes('led') || n.includes('bulb') || n.includes('light')) {
      return (
        <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ledBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#172554" />
            </linearGradient>
            <radialGradient id="glow" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#fef08a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="400" height="400" fill="url(#ledBg)" rx="16" />
          
          {/* Glow Effect */}
          <circle cx="200" cy="160" r="140" fill="url(#glow)" />
          
          {/* Glass Dome */}
          <path d="M140 160 C140 100, 260 100, 260 160 C260 190, 240 210, 230 220 L170 220 C160 210, 140 190, 140 160 Z" fill="#ffffff" stroke="#93c5fd" strokeWidth="4" />
          
          {/* Inner LED chip cluster */}
          <rect x="180" y="170" width="40" height="10" fill="#facc15" rx="2" />
          <line x1="200" y1="180" x2="200" y2="220" stroke="#94a3b8" strokeWidth="4" />
          
          {/* Plastic Base/Heat sink */}
          <path d="M165 220 L235 220 L225 270 L175 270 Z" fill="#e2e8f0" />
          {/* Grooves on heat sink */}
          <line x1="185" y1="220" x2="190" y2="270" stroke="#cbd5e1" strokeWidth="3" />
          <line x1="200" y1="220" x2="200" y2="270" stroke="#cbd5e1" strokeWidth="3" />
          <line x1="215" y1="220" x2="210" y2="270" stroke="#cbd5e1" strokeWidth="3" />
          
          {/* Metal Screw Base */}
          <rect x="182" y="270" width="36" height="24" fill="#94a3b8" rx="2" />
          <line x1="182" y1="278" x2="218" y2="278" stroke="#475569" strokeWidth="3" />
          <line x1="182" y1="286" x2="218" y2="286" stroke="#475569" strokeWidth="3" />
          <path d="M190 294 L210 294 L200 302 Z" fill="#475569" />
          
          {/* Brightness lines */}
          <g stroke="#facc15" strokeWidth="4" strokeLinecap="round" opacity="0.8">
            <line x1="90" y1="160" x2="50" y2="160" />
            <line x1="310" y1="160" x2="350" y2="160" />
            <line x1="200" y1="60" x2="200" y2="30" />
            <line x1="120" y1="80" x2="90" y2="50" />
            <line x1="280" y1="80" x2="310" y2="50" />
          </g>
          
          <text x="200" y="250" fill="#1e3a8a" fontSize="12" fontWeight="bold" textAnchor="middle">POLYCAB</text>
        </svg>
      );
    }
    
    // Circuit Breaker specific illustration
    if (n.includes('breaker') || n.includes('switch')) {
      return (
        <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="breakerBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4b5563" />
              <stop offset="100%" stopColor="#1f2937" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" fill="url(#breakerBg)" rx="16" />
          
          {/* Switch Box Body */}
          <rect x="120" y="80" width="160" height="240" rx="12" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="8" />
          
          {/* Inner switch channel */}
          <rect x="160" y="120" width="80" height="160" rx="6" fill="#1e293b" />
          
          {/* Red/Green status indicator */}
          <rect x="180" y="100" width="40" height="10" rx="2" fill="#ef4444" /> {/* RED - ON */}
          
          {/* Toggle Switch */}
          <path d="M170 200 L230 200 L220 150 L180 150 Z" fill="#ea580c" /> {/* Orange Switch Toggle (UP state) */}
          <rect x="170" y="190" width="60" height="20" rx="3" fill="#cbd5e1" />
          
          {/* Brand/Specs Text */}
          <text x="200" y="300" fill="#475569" fontSize="14" fontWeight="bold" textAnchor="middle">63A MCB</text>
          <text x="200" y="70" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">SAFE-GUARD</text>
        </svg>
      );
    }

    // Default: Wire Reel
    return (
      <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="electBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
          <linearGradient id="copper" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#electBg)" rx="16" />
        
        {/* Wire Reel Roll */}
        <circle cx="200" cy="200" r="130" fill="#1e293b" stroke="#fca5a5" strokeWidth="8" />
        
        {/* Copper coils wraps (nested circles) */}
        <circle cx="200" cy="200" r="105" fill="none" stroke="url(#copper)" strokeWidth="12" />
        <circle cx="200" cy="200" r="90" fill="none" stroke="url(#copper)" strokeWidth="12" />
        <circle cx="200" cy="200" r="75" fill="none" stroke="url(#copper)" strokeWidth="12" />
        
        {/* Inner core cap */}
        <circle cx="200" cy="200" r="50" fill="#f1f5f9" />
        <circle cx="200" cy="200" r="30" fill="#94a3b8" />
        
        {/* Loose wire end protruding */}
        <path d="M200 95 C250 80, 320 120, 330 180 C335 210, 320 250, 350 260" fill="none" stroke="url(#copper)" strokeWidth="10" strokeLinecap="round" />
        
        {/* Exposed copper strands */}
        <path d="M350 260 L365 265 M350 260 L362 255 M350 260 L358 272" stroke="#ea580c" strokeWidth="3" />
        
        <text x="200" y="365" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">POLYCAB FRLS - 2.5 mm</text>
      </svg>
    );
  }

  // 6. Plumbing Products
  if (n.includes('pipe') || n.includes('plumbing') || n.includes('faucet') || n.includes('heater') || n.includes('geyser') || n.includes('tap')) {
    // Faucet / Tap illustration
    if (n.includes('faucet') || n.includes('tap')) {
      return (
        <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="plumbBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="chromeTap" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#cbd5e1" />
              <stop offset="70%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" fill="url(#plumbBg)" rx="16" />
          
          {/* Wall plate */}
          <rect x="60" y="150" width="20" height="80" rx="4" fill="#64748b" />
          
          {/* Tap Pipe body */}
          <rect x="80" y="170" width="160" height="40" fill="url(#chromeTap)" />
          
          {/* Tap Curve spout */}
          <path d="M200 170 L280 170 C300 170, 300 240, 280 250 L260 250" fill="none" stroke="url(#chromeTap)" strokeWidth="40" strokeLinecap="square" />
          
          {/* Handle knob */}
          <rect x="150" y="110" width="30" height="60" rx="6" fill="url(#chromeTap)" />
          <circle cx="165" cy="110" r="15" fill="#ef4444" /> {/* Red hot water dot */}
          
          {/* Water Drips */}
          <path d="M275 260 Q275 300, 270 320 Q265 330, 275 330 Q285 330, 280 320 Z" fill="#e0f2fe" opacity="0.8" />
          <circle cx="270" cy="360" r="8" fill="#e0f2fe" opacity="0.6" />
          
          <text x="200" y="60" fill="#ffffff" fontSize="18" fontWeight="bold" textAnchor="middle">ASTRAL PLUMBING</text>
        </svg>
      );
    }
    
    // Water Heater / Geyser illustration
    if (n.includes('heater') || n.includes('geyser')) {
      return (
        <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="heaterBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" fill="url(#heaterBg)" rx="16" />
          
          {/* Geyser Cylindrical Body */}
          <rect x="120" y="70" width="160" height="240" rx="80" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="6" />
          
          {/* Front panel design */}
          <path d="M120 210 C120 280, 280 280, 280 210 Z" fill="#e2e8f0" />
          
          {/* Temperature dials / LEDs */}
          <circle cx="200" cy="230" r="18" fill="#64748b" />
          <circle cx="200" cy="230" r="4" fill="#3b82f6" />
          <circle cx="170" cy="230" r="5" fill="#22c55e" /> {/* Power green */}
          <circle cx="230" cy="230" r="5" fill="#ef4444" /> {/* Heating red */}

          {/* Pipes coming from bottom */}
          <rect x="160" y="310" width="16" height="40" fill="#3b82f6" /> {/* Blue - Inlet */}
          <rect x="224" y="310" width="16" height="40" fill="#ef4444" /> {/* Red - Outlet */}
          
          <text x="200" y="140" fill="#0284c7" fontSize="18" fontWeight="extrabold" textAnchor="middle">ASTRAL</text>
          <text x="200" y="160" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle">PREMIUM HOT</text>
        </svg>
      );
    }

    // Default: Plumbing Pipes
    return (
      <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pipeBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>
          <linearGradient id="pvc" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffedd5" />
            <stop offset="50%" stopColor="#fdba74" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#pipeBg)" rx="16" />
        
        {/* Set of PVC Pipes */}
        <g transform="rotate(45 200 200)">
          {/* Main pipe */}
          <rect x="60" y="150" width="280" height="40" rx="4" fill="url(#pvc)" />
          <rect x="330" y="145" width="16" height="50" rx="3" fill="#ea580c" />
          
          {/* Connecting elbows */}
          <rect x="120" y="100" width="40" height="140" rx="4" fill="url(#pvc)" />
          <rect x="115" y="90" width="50" height="16" rx="3" fill="#ea580c" />
          
          {/* Smaller pipe */}
          <rect x="180" y="210" width="160" height="24" rx="2" fill="url(#pvc)" opacity="0.9" />
        </g>
        
        <text x="200" y="360" fill="#ffffff" fontSize="16" fontWeight="extrabold" textAnchor="middle">ASTRAL CPVC PRO</text>
        <text x="200" y="378" fill="#ffedd5" fontSize="11" fontWeight="bold" textAnchor="middle">SDR 11 Lead-Free Pipes</text>
      </svg>
    );
  }

  // 7. General Tools & Hardware Fallbacks (Hammers, levels, helmets, tape measure)
  if (n.includes('hammer')) {
    return (
      <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="toolBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="wood" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ca8a04" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id="steelHead" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#toolBg)" rx="16" />
        
        {/* Hammer Handle */}
        <path d="M190 180 L220 340 C222 350, 212 360, 202 360 L188 360 C178 360, 170 350, 172 340 L190 180" fill="url(#wood)" />
        {/* Rubber grip on handle */}
        <path d="M178 280 L212 280 L220 340 C222 350, 212 360, 202 360 L188 360 C178 360, 170 350, 172 340 L178 280" fill="#1e293b" />
        
        {/* Hammer Metal Head */}
        <path d="M120 120 L240 120 C250 120, 280 130, 290 160 L290 170 C280 180, 260 180, 250 170 L250 150 L190 150 L190 180 L160 180 L160 150 L120 150 Z" fill="url(#steelHead)" stroke="#475569" strokeWidth="2" />
        {/* Claw curve */}
        <path d="M250 150 C270 150, 310 130, 320 90 C310 110, 285 130, 250 135 Z" fill="url(#steelHead)" />
        
        {/* Strike impact design */}
        <circle cx="100" cy="135" r="40" fill="none" stroke="#eab308" strokeWidth="2" opacity="0.3" />
        <circle cx="100" cy="135" r="20" fill="none" stroke="#eab308" strokeWidth="2" opacity="0.5" />
      </svg>
    );
  }

  if (n.includes('level')) {
    return (
      <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="levelBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#levelBg)" rx="16" />
        
        {/* Spirit Level Ruler */}
        <rect x="50" y="175" width="300" height="50" fill="#eab308" rx="4" stroke="#ca8a04" strokeWidth="4" />
        <rect x="40" y="170" width="10" height="60" fill="#1e293b" rx="2" />
        <rect x="350" y="170" width="10" height="60" fill="#1e293b" rx="2" />
        
        {/* Center Bubble window */}
        <rect x="170" y="185" width="60" height="30" rx="15" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="3" />
        <rect x="180" y="190" width="40" height="20" rx="10" fill="#22c55e" /> {/* Green Liquid */}
        <circle cx="195" cy="200" r="6" fill="#ffffff" /> {/* Bubble */}
        <line x1="190" y1="190" x2="190" y2="210" stroke="#15803d" strokeWidth="2" />
        <line x1="210" y1="190" x2="210" y2="210" stroke="#15803d" strokeWidth="2" />

        {/* Outer details */}
        <rect x="90" y="190" width="30" height="20" rx="4" fill="#1e293b" opacity="0.4" />
        <rect x="280" y="190" width="30" height="20" rx="4" fill="#1e293b" opacity="0.4" />
      </svg>
    );
  }

  if (n.includes('helmet') || n.includes('safety') || n.includes('hat')) {
    return (
      <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="safetyBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <linearGradient id="helmetYellow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#safetyBg)" rx="16" />
        
        {/* Safety Helmet Dome */}
        <path d="M120 220 C120 120, 280 120, 280 220 Z" fill="url(#helmetYellow)" />
        
        {/* Center Ridge */}
        <path d="M190 140 C190 140, 200 130, 210 140 L210 220 L190 220 Z" fill="#eab308" />
        
        {/* Rim Brim */}
        <path d="M80 220 C80 220, 200 210, 320 220 C330 230, 300 240, 200 240 C100 240, 70 230, 80 220 Z" fill="url(#helmetYellow)" />
        
        {/* Chin strap mounts */}
        <path d="M140 238 L140 260 L145 260 L145 238 Z" fill="#1e293b" />
        <path d="M260 238 L260 260 L255 260 L255 238 Z" fill="#1e293b" />
        
        <text x="200" y="320" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle" letterSpacing="1">SAFETY FIRST</text>
      </svg>
    );
  }

  if (n.includes('measure') || n.includes('tape')) {
    return (
      <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="tapeBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#tapeBg)" rx="16" />
        
        {/* Yellow Tape Rule protruding */}
        <rect x="220" y="210" width="130" height="30" fill="#facc15" stroke="#eab308" strokeWidth="2" />
        <line x1="240" y1="210" x2="240" y2="240" stroke="#1e293b" strokeWidth="2" />
        <line x1="260" y1="210" x2="260" y2="240" stroke="#1e293b" strokeWidth="2" />
        <line x1="280" y1="210" x2="280" y2="240" stroke="#1e293b" strokeWidth="2" />
        <line x1="300" y1="210" x2="300" y2="240" stroke="#1e293b" strokeWidth="2" />
        <line x1="320" y1="210" x2="320" y2="240" stroke="#1e293b" strokeWidth="2" />
        
        <text x="250" y="230" fill="#1e293b" fontSize="12" fontWeight="bold">10</text>
        <text x="270" y="230" fill="#1e293b" fontSize="12" fontWeight="bold">20</text>
        <text x="290" y="230" fill="#1e293b" fontSize="12" fontWeight="bold">30</text>
        
        {/* Metal hook at end of tape */}
        <path d="M350 210 L355 210 L355 250 L345 250 L345 240" fill="#94a3b8" />
        
        {/* Tape Measure casing */}
        <rect x="90" y="110" width="140" height="140" rx="30" fill="#ef4444" stroke="#b91c1c" strokeWidth="6" />
        <rect x="100" y="120" width="120" height="120" rx="22" fill="#1e293b" />
        <circle cx="160" cy="180" r="35" fill="#ef4444" />
        <text x="160" y="186" fill="#ffffff" fontSize="18" fontWeight="black" textAnchor="middle">5m</text>
        
        {/* Locking button on top */}
        <rect x="130" y="90" width="40" height="24" rx="4" fill="#cbd5e1" />
      </svg>
    );
  }

  if (n.includes('laser') || n.includes('distance') || n.includes('meter')) {
    return (
      <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="laserBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#laserBg)" rx="16" />
        
        {/* Laser Beam projection */}
        <line x1="200" y1="80" x2="200" y2="0" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
        <circle cx="200" cy="20" r="10" fill="#ef4444" opacity="0.4" />
        
        {/* Handheld Device Body */}
        <rect x="130" y="80" width="140" height="260" rx="16" fill="#1f2937" stroke="#eab308" strokeWidth="4" />
        
        {/* Display Screen */}
        <rect x="146" y="100" width="108" height="80" rx="4" fill="#065f46" stroke="#047857" strokeWidth="2" />
        <text x="240" y="130" fill="#a7f3d0" fontSize="14" fontFamily="monospace" textAnchor="end">38.452 m</text>
        <text x="240" y="160" fill="#a7f3d0" fontSize="20" fontFamily="monospace" fontWeight="bold" textAnchor="end">12.500 m</text>
        
        {/* Red Measure Button */}
        <circle cx="200" cy="215" r="22" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
        <text x="200" y="220" fill="#ffffff" fontSize="10" fontWeight="black" textAnchor="middle">DIST</text>
        
        {/* Auxiliary keys */}
        <rect x="156" y="255" width="24" height="18" rx="2" fill="#4b5563" />
        <rect x="188" y="255" width="24" height="18" rx="2" fill="#4b5563" />
        <rect x="220" y="255" width="24" height="18" rx="2" fill="#4b5563" />
        
        <rect x="156" y="285" width="24" height="18" rx="2" fill="#4b5563" />
        <rect x="188" y="285" width="24" height="18" rx="2" fill="#4b5563" />
        <rect x="220" y="285" width="24" height="18" rx="2" fill="#ef4444" opacity="0.8" /> {/* Clear/Off */}
        
        <text x="200" y="325" fill="#9ca3af" fontSize="10" textAnchor="middle">DIGITAL LASER 40M</text>
      </svg>
    );
  }

  // 8. General Construction / Fallback / Hero Site illustration
  return (
    <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fallbackBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#3730a3" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#fallbackBg)" rx="16" />
      
      {/* Abstract Construction Site silhouette */}
      <path d="M60 340 L120 200 L180 340 Z" fill="#312e81" opacity="0.6" />
      <path d="M140 340 L220 160 L300 340 Z" fill="#312e81" opacity="0.8" />
      
      {/* Crane silhouette */}
      <path d="M260 340 L260 120 L360 100 M260 150 L340 150" stroke="#facc15" strokeWidth="6" strokeLinecap="round" fill="none" />
      
      {/* Hanging hook */}
      <path d="M340 150 L340 200" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3,3" />
      <rect x="330" y="200" width="20" height="20" fill="#eab308" rx="2" />
      
      <text x="200" y="70" fill="#ffffff" fontSize="24" fontWeight="black" textAnchor="middle">ACE HARDWARE</text>
      <text x="200" y="95" fill="#facc15" fontSize="14" fontWeight="bold" textAnchor="middle" letterSpacing="2">WARANGAL</text>
    </svg>
  );
}
