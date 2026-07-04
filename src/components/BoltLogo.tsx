interface BoltLogoProps {
  size?: number;
  /** Render the midnight rounded tile behind the bolt. */
  tile?: boolean;
  className?: string;
}

/** The DeutschSprint "Sprint Bolt" mark (tricolor bolt, optional tile). */
const BoltLogo = ({ size = 28, tile = true, className = '' }: BoltLogoProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    className={className}
    aria-hidden="true"
  >
    {tile && <rect width="512" height="512" rx="112" fill="#171721" />}
    <polygon
      points="278,60 128,290 223,290 178,452 348,220 248,220"
      fill="#3c3c48"
    />
    <polygon
      points="322,60 172,290 267,290 222,452 392,220 292,220"
      fill="#FFCE00"
    />
    <polygon
      points="300,60 150,290 245,290 200,452 370,220 270,220"
      fill="#DD0000"
    />
  </svg>
);

export default BoltLogo;
