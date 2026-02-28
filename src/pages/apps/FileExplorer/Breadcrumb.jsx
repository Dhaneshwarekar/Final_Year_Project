import React from 'react';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ path, onNavigate }) => {
  const handleClick = (index) => {
    const newPath = path.slice(0, index + 1);
    onNavigate(newPath);
  };

  return (
    <div className="breadcrumb">
      {path.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="breadcrumb-separator" size={14} />}
          <span
            className="breadcrumb-item"
            onClick={() => handleClick(index)}
          >
            {item}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;