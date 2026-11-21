import React from 'react';

/**
 * Skeleton Loader Component (SPEC Section 4.5)
 * Soft shimmer placeholder blocks.
 * 
 * @param {Object} props
 * @param {string} [props.className='']
 * @param {string|number} [props.width]
 * @param {string|number} [props.height]
 */
export const Skeleton = ({ className = '', width, height }) => {
  return (
    <div
      className={`skeleton-shimmer rounded bg-surface-chip ${className}`}
      style={{
        width: width !== undefined ? width : undefined,
        height: height !== undefined ? height : undefined
      }}
    />
  );
};

export default Skeleton;

