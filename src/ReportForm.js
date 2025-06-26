import React, { useState, useEffect } from "react";

const months = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月"
];

function ReportForm({ type, title, year }) {
  const storageKey = `donationData-${type}-${year}`;
  const [data, setData] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem(storageKey));
    if (storedData) {
      setData(storedData);
    } else {
      setData(
        Array.from({ length: 12 }, () => ({
          donation: 0,
          interest: 0,
          expense: 0,
          carryOver: 0,
          incomeTotal: 0,
          nextCarry: 0
        }))
      );
    }
  }, [storageKey]);

  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }, [data, storageKey]);

  const handleChange = (index, field, value) => {
    const numericValue = value === "" ? "" : Number(value);

    const newData = data.map((item, i) =>
      i === index ? { ...item, [field]: numericValue } : { ...item }
    );

    const carry =
      index === 0
        ? Number(newData[0].carryOver) || 0
        : Number(newData[index - 1].nextCarry) || 0;

    const donation =
      field === "donation" ? numericValue : Number(newData[index].donation) || 0;
    const interest =
      field === "interest" ? numericValue : Number(newData[index].interest) || 0;
    const expense =
      field === "expense" ? numericValue : Number(newData[index].expense) || 0;

    const incomeTotal = donation + interest + carry;
    const nextCarry = incomeTotal - expense;

    newData[index].incomeTotal = incomeTotal;
    newData[index].nextCarry = nextCarry;
    newData[index].carryOver = carry;

    setData(newData);
  };

  const formatNumber = (num) => {
    return typeof num === "number" ? num.toLocaleString() : "";
  };

  return (
    <div>
      {months.map((month, index) => (
        <div key={index} className="month-section">
          <h3>{`${year}年${month}`}</h3>

          {index === 0 && (
            <div>
              <label>前期繰越: </label>
              <input
                type="number"
                value={data[0]?.carryOver ?? ""}
                onChange={(e) =>
                  handleChange(0, "carryOver", e.target.value)
                }
              />
            </div>
          )}

          <div>
            <label>{title}: </label>
            <input
              type="number"
              value={data[index]?.donation ?? ""}
              onChange={(e) =>
                handleChange(index, "donation", e.target.value)
              }
            />
          </div>

          <div>
            <label>利息・その他: </label>
            <input
              type="number"
              value={
                data[index]?.interest !== undefined &&
                data[index]?.interest !== null
                  ? data[index].interest
                  : ""
              }
              onChange={(e) =>
                handleChange(index, "interest", e.target.value)
              }
            />
          </div>

          <div>
            <label>支出: </label>
            <input
              type="number"
              value={data[index]?.expense ?? ""}
              onChange={(e) =>
                handleChange(index, "expense", e.target.value)
              }
            />
          </div>

          <p>収入合計: {formatNumber(data[index]?.incomeTotal ?? 0)}</p>
          <p>次月繰越: {formatNumber(data[index]?.nextCarry ?? 0)}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default ReportForm;
