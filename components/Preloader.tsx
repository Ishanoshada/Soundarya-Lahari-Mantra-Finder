import React from 'react';

const Preloader: React.FC<{ isHiding: boolean }> = ({ isHiding }) => {
  const bijas = ['ऐं', 'ह्रीं', 'क्लीं', 'श्रीं', 'दुं', 'सौः', 'रं', 'यं', 'वं', 'लं', 'हं', 'गं'];

  return (
    <div id="preloader" className={isHiding ? 'hidden' : ''} aria-live="polite" aria-busy="true">
      <div className="om-container">
        <span className="om-symbol">ॐ</span>
        {bijas.map((bija, index) => (
          <span key={index} className={`bija bija-${index + 1}`} aria-hidden="true">
            {bija}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Preloader;
