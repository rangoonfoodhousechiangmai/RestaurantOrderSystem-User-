import React from 'react';

const SpinnerOverlay = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 9999
      }}
    >
      <div className="text-center">
        <div className="spinner-border text-white" role="status" style={{ width: '3rem', height: '3rem' }}></div>
        {/* <p className="mt-3 text-white">Submitting your order...</p> */}
      </div>
    </div>
  );
};

export default SpinnerOverlay;
