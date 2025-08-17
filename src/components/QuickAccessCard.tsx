

type Props = {
  img: string;
  title: string;
  onClick?: () => void;
};

export default function QuickAccessCard({ img, title, onClick }: Props) {
  return (
    <button className="qcard" onClick={onClick}>
      <img className="qcard__img" src={img} alt={title} />
      <div className="qcard__label">{title}</div>
    </button>
  );
}