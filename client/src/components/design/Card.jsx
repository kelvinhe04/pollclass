const Card = ({ children, className = '', title }) => {
  return (
    <div className={`brutal-card ${className}`}>
      {title && (
        <h3 className="brutal-title mb-4 border-b-2 border-black pb-2">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default Card;