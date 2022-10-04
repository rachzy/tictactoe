import "./Subtitle.css";

interface IProps {
    children: string; 
    color?: string;
}

const Subtitle: React.FC<IProps> = ({children, color}) => {
    return(
        <h2 style={{color: color}} className="subtitle">{children}</h2>
    )
}

export default Subtitle;