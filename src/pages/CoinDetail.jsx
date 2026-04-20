import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCoinData } from "../api/coinGecko";
import { formatMarketCap, formatPrice } from "../utils/formatter";
import {
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  Tooltip,
} from "recharts";
import { fetchChartData } from "../api/coinGecko";
const CoinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    loadCoinData();
    loadChartData();
  }, [id]);

  const loadCoinData = async () => {
    try {
      const data = await fetchCoinData(id);
      setCoin(data);
    } catch (error) {
      console.error("error fetching crypto", error);
    } finally {
      setIsLoading(false);
    }
  };
  const loadChartData = async () => {
    try {
      const data = await fetchChartData(id);
      const formattedData = data.prices.map((price) => ({
        time: new Date(price[0]).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        price: price[1].toFixed(2),
      }));

      setChartData(formattedData);
    } catch (error) {
      console.error("error fetching crypto", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading coin data...</p>
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="app">
        <div className="no-results">
          <p className="coin-not-found">Coin not found</p>
          <button className="go-back" onClick={() => navigate("/")}>
            Go back
          </button>
        </div>
      </div>
    );
  }

  const priceChange = coin.market_data.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;
  return (
    <div>
      <div className="app">
        <header className="header">
          <div className="header-content">
            <div className="logo-section">
              <h1>🚀 Crypto Tracker</h1>
              <p>Real-time cryptocurrency prices and market data</p>
            </div>
            <button className="back-button" onClick={() => navigate("/")}>
              ← Back To List
            </button>
          </div>
        </header>
        <div className="coin-detail">
          <div className="coin-header">
            <div className="coin-title">
              <img src={coin.image.large} alt={coin.name} />
              <div>
                <h1>{coin.name}</h1>
                <p className="symbol">{coin.symbol.toUpperCase()}</p>
              </div>
            </div>
            <span className="rank">
              Rank #{coin.market_data.market_cap_rank}
            </span>
          </div>
          <div className="coin-price-section">
            <div className="current-price">
              <h2>{formatPrice(coin.market_data.current_price.usd)}</h2>
              <span
                className={`change-badge ${isPositive ? "positive" : "negative"} `}
              >
                {isPositive ? "▲" : "▼"} {Math.abs(priceChange).toFixed(2)}
              </span>
            </div>

            <div className="price-ranges">
              <div className="price-range">
                <span className="range-label">24h High</span>
                <span className="range-value">
                  {formatPrice(coin.market_data.high_24h.usd)}
                </span>
              </div>

              <div className="price-ranges">
                <div className="price-range">
                  <span className="range-label">24h Low</span>
                  <span className="range-value">
                    {formatPrice(coin.market_data.low_24h.usd)}
                  </span>
                </div>
              </div>
            </div>

            <div className="chart-section">
              <h3>Price chart (7 days)</h3>
              <ResponsiveContainer
                width="100%"
                height={
                  typeof window !== "undefined" && window.innerWidth < 768
                    ? 250
                    : 400
                }
              >
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="time"
                    stroke="#9ca3af"
                    style={{ fontSize: "10px" }}
                    interval={
                      typeof window !== "undefined" && window.innerWidth < 768
                        ? 6
                        : 2
                    }
                    tick={{ fontSize: window.innerWidth < 768 ? 9 : 12 }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                    domain={["auto", "auto"]}
                    width={window.innerWidth < 768 ? 45 : 60}
                    tickFormatter={(val) => `$${Number(val).toLocaleString()}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(20,20,40,0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    dataKey="price"
                    type="monotone"
                    stroke="#5cc1e3"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Market Cap</span>
                <span className="stat-value">
                  ${formatMarketCap(coin.market_data.market_cap.usd)}
                </span>
              </div>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Volume (24)</span>
                <span className="stat-value">
                  ${formatMarketCap(coin.market_data.total_volume.usd)}
                </span>
              </div>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Circulating Supply</span>
                <span className="stat-value">
                  {coin.market_data.circulating_supply?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;
