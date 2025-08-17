// src/components/WelcomeBanner.tsx

type Props = {
  greeting: string;
  subtext: string;
  avatar: string; // image url
};

export default function WelcomeBanner({ greeting, subtext, avatar }: Props) {
  return (
    <div className="welcome-banner">
      <div className="welcome-text">
        <div className="welcome-greeting">{greeting}</div>
        <div className="welcome-subtext">{subtext}</div>
      </div>

      <img
        className="welcome-avatar"
        src={avatar}
        alt="User avatar"
        width={44}
        height={44}
      />
    </div>
  );
}