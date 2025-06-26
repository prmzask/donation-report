import React, { useState } from "react";
import ReportForm from "./ReportForm";
import "./App.css";

function App() {
  const currentYear = new Date().getFullYear();
  const [activeTab, setActiveTab] = useState("kaido");
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };

  const yearRange = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="app">
      <h1>献金報告書</h1>

      <div className="year-selector">
        <label>年を選択: </label>
        <select value={selectedYear} onChange={handleYearChange}>
          {yearRange.map((year) => (
            <option key={year} value={year}>
              {year}年
            </option>
          ))}
        </select>
      </div>

      <div className="tabs">
        <button
          className={activeTab === "kaido" ? "active" : ""}
          onClick={() => setActiveTab("kaido")}
        >
          会堂献金報告書
        </button>
        <button
          className={activeTab === "car" ? "active" : ""}
          onClick={() => setActiveTab("car")}
        >
          自動車献金報告書
        </button>
      </div>

      <ReportForm
        type={activeTab}
        year={selectedYear}
        title={activeTab === "kaido" ? "会堂献金" : "自動車献金"}
      />
    </div>
  );
}

export default App;
