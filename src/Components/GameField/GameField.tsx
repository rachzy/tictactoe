import "./GameField.css";

interface IProps {
  children: string;
  onClick: () => void;
  color?: string;
}

const GameField: React.FC<IProps> = ({ children, onClick, color }) => {
  return (
    <div onClick={onClick} style={{ color: color }} className="game-field">
      <p>{children}</p>
    </div>
  );
};

export default GameField;
