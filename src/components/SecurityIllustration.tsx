interface SecurityIllustrationProps {
  className?: string;
}

export const SecurityIllustration = ({ className }: SecurityIllustrationProps) => (
  <svg
    viewBox="0 0 720 560"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Security illustration"
  >
    <defs>
      <linearGradient id="grad-shield" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a78bfa" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
      <linearGradient id="grad-monitor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#312e81" />
        <stop offset="100%" stopColor="#1e1b4b" />
      </linearGradient>
      <linearGradient id="grad-glow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#f9a8d4" stopOpacity="0.1" />
      </linearGradient>
    </defs>

    <ellipse cx="360" cy="500" rx="260" ry="22" fill="#1e1b4b" opacity="0.18" />

    <circle cx="360" cy="240" r="220" fill="url(#grad-glow)" />

    <g opacity="0.55">
      <circle cx="120" cy="120" r="6" fill="#a78bfa" />
      <circle cx="600" cy="180" r="8" fill="#f0abfc" />
      <circle cx="640" cy="380" r="5" fill="#a78bfa" />
      <circle cx="80" cy="360" r="7" fill="#c4b5fd" />
      <circle cx="180" cy="60" r="4" fill="#f9a8d4" />
      <circle cx="540" cy="80" r="5" fill="#c4b5fd" />
    </g>

    <g transform="translate(530 110)" opacity="0.85">
      <rect x="0" y="0" width="62" height="80" rx="12" fill="#fff" stroke="#c7d2fe" strokeWidth="2" />
      <path d="M16 38 v-12 a15 15 0 0 1 30 0 v12" stroke="#6366f1" strokeWidth="4" fill="none" strokeLinecap="round" />
      <rect x="14" y="38" width="34" height="30" rx="6" fill="#6366f1" />
      <circle cx="31" cy="52" r="4" fill="#fff" />
      <rect x="29" y="52" width="4" height="10" fill="#fff" rx="2" />
    </g>

    <g transform="translate(70 280)" opacity="0.85">
      <rect x="0" y="0" width="56" height="72" rx="11" fill="#fff" stroke="#c7d2fe" strokeWidth="2" />
      <path d="M14 34 v-10 a14 14 0 0 1 28 0 v10" stroke="#a78bfa" strokeWidth="4" fill="none" strokeLinecap="round" />
      <rect x="12" y="34" width="32" height="28" rx="6" fill="#a78bfa" />
      <circle cx="28" cy="46" r="3.5" fill="#fff" />
      <rect x="26.3" y="46" width="3.5" height="9" fill="#fff" rx="1.7" />
    </g>

    <g transform="translate(180 200)">
      <rect x="0" y="0" width="360" height="240" rx="22" fill="url(#grad-monitor)" />
      <rect x="14" y="14" width="332" height="196" rx="14" fill="#0f172a" />
      <circle cx="34" cy="34" r="5" fill="#f87171" />
      <circle cx="52" cy="34" r="5" fill="#fbbf24" />
      <circle cx="70" cy="34" r="5" fill="#34d399" />

      <g transform="translate(126 64)">
        <path
          d="M55 0 L0 22 v34 c0 36 24 66 55 78 c31 -12 55 -42 55 -78 V22 Z"
          fill="url(#grad-shield)"
          stroke="#fff"
          strokeWidth="2"
        />
        <path
          d="M30 60 l18 18 l34 -38"
          fill="none"
          stroke="#fff"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <rect x="40" y="170" width="120" height="6" rx="3" fill="#6366f1" opacity="0.7" />
      <rect x="40" y="184" width="80" height="6" rx="3" fill="#a78bfa" opacity="0.55" />
      <rect x="200" y="170" width="120" height="6" rx="3" fill="#34d399" opacity="0.5" />
      <rect x="200" y="184" width="60" height="6" rx="3" fill="#34d399" opacity="0.35" />

      <rect x="60" y="220" width="240" height="14" rx="7" fill="#1e293b" />
      <rect x="100" y="234" width="160" height="10" rx="5" fill="#1e293b" />
    </g>

    <g transform="translate(120 360)">
      <rect x="0" y="0" width="200" height="120" rx="14" fill="#fff" stroke="#c7d2fe" strokeWidth="2" />
      <rect x="14" y="14" width="172" height="14" rx="3" fill="#e0e7ff" />
      <circle cx="22" cy="48" r="6" fill="#34d399" />
      <rect x="36" y="44" width="80" height="8" rx="3" fill="#cbd5e1" />
      <rect x="36" y="58" width="120" height="8" rx="3" fill="#e2e8f0" />
      <circle cx="22" cy="80" r="6" fill="#fbbf24" />
      <rect x="36" y="76" width="100" height="8" rx="3" fill="#cbd5e1" />
      <rect x="36" y="90" width="140" height="8" rx="3" fill="#e2e8f0" />
    </g>

    <g transform="translate(440 380)">
      <rect x="0" y="0" width="160" height="100" rx="14" fill="#fff" stroke="#c7d2fe" strokeWidth="2" />
      <circle cx="36" cy="44" r="20" fill="#ede9fe" />
      <path
        d="M27 44 l7 7 l13 -14"
        stroke="#6366f1"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="68" y="32" width="78" height="8" rx="3" fill="#cbd5e1" />
      <rect x="68" y="46" width="58" height="8" rx="3" fill="#e2e8f0" />
      <rect x="20" y="78" width="120" height="8" rx="3" fill="#f1f5f9" />
    </g>
  </svg>
);
