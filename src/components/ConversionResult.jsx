const ConversionResult = ({ amount, fromCurrency, toCurrency, rate }) => {
    const convertedAmount = amount * rate;
    return (
      <div className="result">
        {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
      </div>
    );
  };
  
  export default ConversionResult;
  