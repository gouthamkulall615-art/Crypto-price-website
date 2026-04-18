import React, { useEffect, useState } from "react";
import { fetchCryptos } from "../api/coinGecko";
import CryptoCard from "../components/CryptoCard";

const Home = () => {
  const [cryptoList, setCryptoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("market_cap_rank");
  const [searchQuery, setSearchQuery] = useState("");

  const [filterList, setFilterList] = useState([]);
  useEffect(() => {
    fetchCryptoData();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [sortBy, cryptoList]);

  const fetchCryptoData = async () => {
    try {
      const data = await fetchCryptos();
      setCryptoList(data);
    } catch (error) {
      console.log("Error fetching crypto", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSort = () => {
    let filtered = [...cryptoList];
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.current_price - b.current_price;
        case "price_desc":
          return b.current_price - a.current_price;
        case "change":
          return a.price_change_percentage_24h - b.price_change_percentage_24h;
        case "market_cap":
          return a.market_cap - b.market_cap;
        default:
          return a.market_cap_rank - b.market_cap_rank;
      }
    });
    setFilterList(filtered);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🚀 Crypto Tracker</h1>
            <p>Real-time cryptocurrency prices and market data</p>
          </div>
          <div className="search-section">
            <input
              type="text"
              placeholder="Search cryptos .."
              className="search-input"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>
      </header>
      <div className="controls">
        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="market_cap_rank">Rank</option>
            <option value="name">Name</option>
            <option value="price">Price(low to High)</option>
            <option value="price_desc">Price(High to Low)</option>
            <option value="change">24h Change</option>
            <option value="market_cap">Market Cap</option>
          </select>
        </div>
        <div className="view-toggle">
          <button
            className={viewMode === "grid" ? "active" : ""}
            onClick={() => setViewMode("grid")}
          >
            Grid
          </button>
          <button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
          >
            List
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading crypto data...</p>
        </div>
      ) : (
        <div className={`crypto-container ${viewMode}`}>
          {filterList.map((crypto, key) => {
            return <CryptoCard key={key} crypto={crypto} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
