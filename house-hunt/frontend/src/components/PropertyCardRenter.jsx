import React from "react";

const PropertyCardRenter = ({ property, onInfoClick }) => {
  return (
    <article
      className="property-card"
      tabIndex="0"
      role="region"
      aria-label={`Property: ${property.title}`}
    >
      <div className="property-image">
        <img
          src={property.image}
          alt={`Image of ${property.title}, located at ${property.location}`}
          loading="lazy"
        />
      </div>
      <div className="property-details">
        <h3 className="property-title">{property.title}</h3>
        <div className="property-meta">
          {property.location} • ${property.price} / month
        </div>
        <div className="property-actions">
          <button
            onClick={() => onInfoClick(property)}
            aria-label={`Get more information about ${property.title}`}
          >
            Get Info
          </button>
        </div>
      </div>
    </article>
  );
};

export default PropertyCardRenter;
