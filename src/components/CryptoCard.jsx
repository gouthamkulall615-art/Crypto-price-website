import React from "react";
import { formatMarketCap, formatPrice } from "../utils/formatter";
const CryptoCard = ({ crypto }) => {
  return (
    <div className="crypto-card">
      <div className="crypto-header">
        <div className="crypto-info">
          <img src={crypto.image} alt={crypto.name} />
          <div>
            <h3>{crypto.name}</h3>
            <p className="symbol">{crypto.symbol.toUpperCase()}</p>
            <span className="rank">#{crypto.market_cap_rank}</span>
          </div>
        </div>
      </div>
      <div className="crypto-price">
        <p className="price">{formatPrice(crypto.current_price)}</p>
        <p
          className={`change ${crypto.price_change_percentage_24h >= 0 ? "positive" : "negative"} `}
        >
          {crypto.price_change_percentage_24h >= 0 ? "▲" : "▼"}{" "}
          {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}
        </p>
      </div>
      <div className="crypto-stats">
        <div className="stat">
          <span className="stat-label">Markett Cap</span>
          <span className="stat-value">
            {formatMarketCap(crypto.market_cap)}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Volume</span>
          <span className="stat-value">
        ${formatMarketCap(crypto.total_volume)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CryptoCard;
