const CurrencySelector = ({ currencies, selectedCurrency, onChange }) => {
    return (
      <select value={selectedCurrency} onChange={onChange} className="dropdownselect">
        {Object.entries(currencies).map(([currencyCode, countryName]) => (
          <option key={currencyCode} value={currencyCode}>
            {countryName} ({currencyCode})
          </option>
        ))}
      </select>
    );
  };
  
  export default CurrencySelector;
  