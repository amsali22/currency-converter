import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import './index.css';

// icons import


// Importing components
import CurrencySelector from './components/CurrencySelector';
import AmountInput from './components/AmountInput';
import ConversionResult from './components/ConversionResult';

const App = () => {
  const [amount, setAmount] = useState(1); // Default amount to convert
  const [fromCurrency, setFromCurrency] = useState('USD'); // Default from currency
  const [toCurrency, setToCurrency] = useState('EUR'); // Default to currency
  const [rate, setRate] = useState(1); // Default exchange rate
  const [rates, setRates] = useState({}); // All currency rates
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [convertedAmount, setConvertedAmount] = useState(null); // Result of conversion
  const [currenciesWithCountries, setCurrenciesWithCountries] = useState([]); // To store currencies with countries

  // Fetch the exchange rates when the component mounts
  const fetchRates = async () => {
    try {
      const apiKey = import.meta.env.VITE_API_KEY; // Fetch API key from .env
      const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`);
      setRates(response.data.conversion_rates);
      setRate(response.data.conversion_rates[toCurrency]);
      setError(null);
    } catch (error) {
      setError('Error fetching exchange rates');
    } finally {
      setLoading(false);
    }
  };


  
  // Fetch currency and country data from an API
  const fetchCurrenciesWithCountries = async () => {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all');
      const currencies = response.data.reduce((acc, country) => {
        if (country.currencies) {
          const currencyCodes = Object.keys(country.currencies);
          currencyCodes.forEach((code) => {
            acc[code] = country.currencies[code].name; // Store currency code and its country name
          });
        }
        return acc;
      }, {});
      setCurrenciesWithCountries(currencies);
    } catch (error) {
      console.error('Error fetching country and currency data', error);
    }
  };

  useEffect(() => {
    fetchRates();
    fetchCurrenciesWithCountries(); // Fetch currency and country data
  }, [fromCurrency]);

  useEffect(() => {
    if (rates) {
      setRate(rates[toCurrency]);
    }
  }, [toCurrency, rates]);

  // Function to handle conversion when 'Convert' button is clicked
  const handleConvert = () => {
    if (!rate || !amount) return;
    const result = (amount * rate).toFixed(2); // Simple conversion with 2 decimal places
    setConvertedAmount(result);
  };


  // Function to refresh the rates when 'Refresh' button is clicked
  const handleRefresh = async () => {
    setLoading(true);
    await fetchRates();
    if (amount && rate) {
      const result = (amount * rate).toFixed(2);
      setConvertedAmount(result); // Update the result if the rates have changed
    }
  };

  
  

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-white">{error}</div>;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white mb-8">Currency Converter</h1>
      <div className="convcard">
        {/* Amount Input */}
        <label className="title">Amount</label>
        <AmountInput amount={amount} onChange={(e) => setAmount(e.target.value)} />

        {/* From Currency Selector */}
        <label className="title">From Currency</label>
        <CurrencySelector
          currencies={currenciesWithCountries} // Use updated state
          selectedCurrency={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        />

        {/* To Currency Selector */}
        <label className="title">To Currency</label>
        <CurrencySelector
          currencies={currenciesWithCountries} // Use updated state
          selectedCurrency={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        />

        {/* Conversion Result */}
        {convertedAmount && (
          <div className="mt-4">
            <ConversionResult
              amount={amount}
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
              rate={rate}
              convertedAmount={convertedAmount} // Pass the converted amount to the component
            />
          </div>
        )}

        {/* Buttons */}
        <div className="buttonsection">
          <button className="convertbtn" onClick={handleConvert}>
            Convert 
          </button>
          <button className="refreshbtn" onClick={handleRefresh}>
            Refresh 
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;


