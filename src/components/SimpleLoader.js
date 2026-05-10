import "./simple-loader.scss";

const SimpleLoader = ({ height = "10px", width = "10px", color = "#3498db", className = "", style = {} }) => {
    return <div className={`simple-loader ${className}`} style={{ height, width, borderTopColor: color, ...style }}></div>;
};

export default SimpleLoader;