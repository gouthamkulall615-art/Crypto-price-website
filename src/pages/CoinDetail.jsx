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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const isMobile = windowWidth < 768;
  const priceChange = coin.market_data.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;

  const tickCount = isMobile ? 4 : 8;
  const filteredChartData = chartData.filter(
    (_, i) => i % Math.ceil(chartData.length / tickCount) === 0,
  );

  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
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
                className={`change-badge ${isPositive ? "positive" : "negative"}`}
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
              <div className="price-range">
                <span className="range-label">24h Low</span>
                <span className="range-value">
                  {formatPrice(coin.market_data.low_24h.usd)}
                </span>
              </div>
            </div>

            <div
              className="chart-section"
              style={{ width: "100%", overflowX: "hidden" }}
            >
              <h3>Price chart (7 days)</h3>
              <div style={{ width: "100%", overflowX: "hidden" }}>
                <ResponsiveContainer
                  width="100%"
                  minWidth={0}
                  height={isMobile ? 260 : 450}
                >
                  <LineChart
                    data={filteredChartData}
                    margin={{
                      top: 20,
                      right: isMobile ? 8 : 20,
                      left: isMobile ? -10 : 10,
                      bottom: isMobile ? 50 : 20,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="0"
                      stroke="rgba(255,255,255,0.06)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="time"
                      stroke="transparent"
                      tick={{ fontSize: isMobile ? 9 : 12, fill: "#9ca3af" }}
                      interval={0}
                      angle={isMobile ? -40 : 0}
                      textAnchor={isMobile ? "end" : "middle"}
                      height={isMobile ? 55 : 40}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="transparent"
                      tick={{ fontSize: isMobile ? 9 : 12, fill: "#9ca3af" }}
                      domain={["auto", "auto"]}
                      width={isMobile ? 58 : 80}
                      tickFormatter={(val) =>
                        `$${Number(val).toLocaleString()}`
                      }
                      axisLine={false}
                      tickLine={false}
                      tickCount={5}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(20,20,40,0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: isMobile ? "11px" : "13px",
                      }}
                      formatter={(val) => [
                        `$${Number(val).toLocaleString()}`,
                        "Price",
                      ]}
                    />
                    <Line
                      dataKey="price"
                      type="linear"
                      stroke="#5cc1e3"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: "#5cc1e3" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
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
