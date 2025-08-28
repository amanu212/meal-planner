// src/components/WelcomeBanner.tsx

type Props = {
  greeting: string;
  subtext: string;
  avatar: string;        // image url
  className?: string;    // optional extra styling
  avatarAlt?: string;    // optional alt override
};

export default function WelcomeBanner({
  greeting,
  subtext,
  avatar,
  className = "",
  avatarAlt = "User avatar",
}: Props) {
  return (
    <div className={`welcome-banner ${className}`} role="region" aria-label="Welcome banner">
      <div className="welcome-text">
        <div className="welcome-greeting">{greeting}</div>
        <div className="welcome-subtext">{subtext}</div>
      </div>

      <img
        className="welcome-avatar"
        src={avatar}
        alt={avatarAlt}
        width={44}
        height={44}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}