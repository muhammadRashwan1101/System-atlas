export default function SystemAtlasLogo(props) {
  const NAVY = "#2c2d5e";
  const SLATE = "#6b7593";

  return (
    <svg
      viewBox="0 0 1024 1024"
      width="1024"
      height="1024"
      className="transition-all duration-300 ease-out hover:drop-shadow-[0_0_18px_rgba(107,117,147,0.85)] hover:drop-shadow-[0_0_36px_rgba(44,45,94,0.6)]"
      {...props}
    >
      {/* ===================== EDGES ===================== */}
      <g fill="none" strokeWidth="7" strokeLinecap="round">
        {/* Outer left leg */}
        <line stroke={NAVY} x1="460" y1="232" x2="392" y2="378" />
        <line stroke={NAVY} x1="392" y1="378" x2="333" y2="503" />
        <line stroke={NAVY} x1="333" y1="503" x2="260" y2="648" />

        {/* Outer right leg */}
        <line stroke={SLATE} x1="580" y1="232" x2="646" y2="378" />
        <line stroke={SLATE} x1="646" y1="378" x2="706" y2="503" />
        <line stroke={SLATE} x1="706" y1="503" x2="780" y2="648" />

        {/* Inner left leg */}
        <line stroke={NAVY} x1="460" y1="232" x2="520" y2="352" />
        <line stroke={NAVY} x1="520" y1="352" x2="460" y2="565" />
        <line stroke={NAVY} x1="460" y1="565" x2="395" y2="648" />

        {/* Inner right leg */}
        <line stroke={SLATE} x1="580" y1="232" x2="520" y2="352" />
        <line stroke={SLATE} x1="520" y1="352" x2="580" y2="565" />
        <line stroke={SLATE} x1="580" y1="565" x2="645" y2="648" />

        {/* top cap */}
        <line stroke={SLATE} x1="460" y1="232" x2="580" y2="232" />

        {/* crossbar */}
        <line stroke={NAVY} x1="460" y1="565" x2="580" y2="565" />

        {/* diagonal mesh, left side */}
        <line stroke={NAVY} x1="392" y1="378" x2="520" y2="352" />
        <line stroke={NAVY} x1="333" y1="503" x2="460" y2="565" />
        <line stroke={NAVY} x1="392" y1="378" x2="460" y2="565" />
        <line stroke={NAVY} x1="260" y1="648" x2="395" y2="648" />
        <line stroke={NAVY} x1="333" y1="503" x2="395" y2="648" />

        {/* diagonal mesh, right side */}
        <line stroke={SLATE} x1="646" y1="378" x2="520" y2="352" />
        <line stroke={SLATE} x1="706" y1="503" x2="580" y2="565" />
        <line stroke={SLATE} x1="646" y1="378" x2="580" y2="565" />
        <line stroke={SLATE} x1="780" y1="648" x2="645" y2="648" />
        <line stroke={SLATE} x1="706" y1="503" x2="645" y2="648" />

        {/* crossing mesh through center */}
        <line stroke={NAVY} x1="392" y1="378" x2="580" y2="565" />
        <line stroke={SLATE} x1="646" y1="378" x2="460" y2="565" />
      </g>

      {/* ===================== NODES ===================== */}
      <g stroke="none">
        <circle fill={NAVY} cx="460" cy="232" r="22" />
        <circle fill={SLATE} cx="580" cy="232" r="22" />

        <circle fill={NAVY} cx="520" cy="352" r="20" />

        <circle fill={NAVY} cx="392" cy="378" r="20" />
        <circle fill={SLATE} cx="646" cy="378" r="20" />

        <circle fill={NAVY} cx="333" cy="503" r="20" />
        <circle fill={SLATE} cx="706" cy="503" r="20" />

        <circle fill={NAVY} cx="460" cy="565" r="20" />
        <circle fill={SLATE} cx="580" cy="565" r="20" />

        <circle fill={NAVY} cx="260" cy="648" r="22" />
        <circle fill={SLATE} cx="395" cy="648" r="22" />
        <circle fill={NAVY} cx="645" cy="648" r="22" />
        <circle fill={SLATE} cx="780" cy="648" r="22" />
      </g>

      {/* ===================== WORDMARK ===================== */}
      <text
        x="512"
        y="800"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontSize="92"
        letterSpacing="6"
        fill={SLATE}
      >
        SYSTEM ATLAS
      </text>
    </svg>
  );
}