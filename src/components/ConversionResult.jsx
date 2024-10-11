// Define a functional component named ConversionResult that takes in props: amount, fromCurrency, toCurrency, and rate
const ConversionResult = ({ amount, fromCurrency, toCurrency, rate }) => {
  // Calculate the converted amount by multiplying the amount with the rate
  const convertedAmount = amount * rate;
  
  // Return a JSX element that displays the conversion result
  return (
    <div className="result">
    {/* Display the original amount and currency, followed by the converted amount and target currency */}
    {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
    </div>
  );
};

// Export the ConversionResult component as the default export
export default ConversionResult;