import React, { PropTypes } from 'react';

const Framework = ({abbreviation, name, dragstart}) => (
   <div draggable="true" onDragStart={dragstart} title={name}>
     <svg width="50" height="50">
       <g>
         <circle cx="25" cy="25" r="20" fill="#00aede" stroke="#292c3e" />
         <text x="25" y="30" fill="white" stroke="white" textAnchor="middle">{abbreviation}</text>
       </g>
     </svg>
   </div>
);

Framework.propTypes = {
  color: PropTypes.string,
  abbreviation: PropTypes.string,
  name: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
};

export default Framework;
