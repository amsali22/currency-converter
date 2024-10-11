// Define a functional component named CurrencySelector that takes in three props: currencies, selectedCurrency, and onChange
const CurrencySelector = ({ currencies, selectedCurrency, onChange }) => {
  return (
    // Render a select element with the value set to the selectedCurrency and an onChange event handler
    <select value={selectedCurrency} onChange={onChange} className="dropdownselect">
    {/* Map over the entries of the currencies object to create option elements */}
    {Object.entries(currencies).map(([currencyCode, countryName]) => (
      // Each option element has a key set to the currencyCode and a value set to the currencyCode
      <option key={currencyCode} value={currencyCode}>
      {/* Display the countryName followed by the currencyCode in parentheses */}
      {countryName} ({currencyCode})
      </option>
    ))}
    </select>
  );
  };
  
  // Export the CurrencySelector component as the default export
  export default CurrencySelector;