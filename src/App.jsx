import { useEffect, useState } from 'react'; // Importing hooks from React
import axios from 'axios'; // Importing axios for API calls
import './App.css'; // Importing CSS files
import './index.css'; // Importing CSS files

// Importing components
import CurrencySelector from './components/CurrencySelector';
import AmountInput from './components/AmountInput';
import ConversionResult from './components/ConversionResult';

const App = () => {
  const [amount, setAmount] = useState(1); // State for the amount to convert, default is 1
  const [fromCurrency, setFromCurrency] = useState('USD'); // State for the currency to convert from, default is USD
  const [toCurrency, setToCurrency] = useState('EUR'); // State for the currency to convert to, default is EUR
  const [rate, setRate] = useState(1); // State for the exchange rate, default is 1
  const [rates, setRates] = useState({}); // State for all currency rates
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error status
  const [convertedAmount, setConvertedAmount] = useState(null); // State for the result of the conversion
  const [currenciesWithCountries, setCurrenciesWithCountries] = useState([]); // State for storing currencies with countries

  const [timeLastUpdate, setTimeLastUpdate] = useState(null); // State for storing the last update time

  // Function to fetch the exchange rates when the component mounts
  const fetchRates = async () => {
    try {
      const apiKey = import.meta.env.VITE_API_KEY; // Fetch API key from .env
      const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`); // API call to get exchange rates
      setRates(response.data.conversion_rates); // Set the rates state with the fetched data
      setRate(response.data.conversion_rates[toCurrency]); // Set the rate state with the fetched data
      setTimeLastUpdate(response.data.time_last_update_utc); // Set the time_last_update state with the fetched data
      setError(null); // Reset the error state
    } catch (error) {
      setError('Error fetching exchange rates'); // Set the error state if there's an error
    } finally {
      setLoading(false); // Set the loading state to false
    }
  };

  // Function to fetch currency and country data from an API
  const fetchCurrenciesWithCountries = async () => {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all'); // API call to get country and currency data
      const currencies = response.data.reduce((acc, country) => {
        if (country.currencies) {
          const currencyCodes = Object.keys(country.currencies); // Get currency codes
          currencyCodes.forEach((code) => {
            acc[code] = country.currencies[code].name; // Store currency code and its country name
          });
        }
        return acc;
      }, {});
      setCurrenciesWithCountries(currencies); // Set the currenciesWithCountries state with the fetched data
    } catch (error) {
      console.error('Error fetching country and currency data', error); // Log error if there's an error
    }
  };

  useEffect(() => {
    fetchRates(); // Fetch rates when the component mounts or fromCurrency changes
    fetchCurrenciesWithCountries(); // Fetch currency and country data when the component mounts
  }, [fromCurrency]);

  useEffect(() => {
    if (rates) {
      setRate(rates[toCurrency]); // Update the rate state when toCurrency or rates change
    }
  }, [toCurrency, rates]);

  // Function to handle conversion when 'Convert' button is clicked
  const handleConvert = () => {
    if (!rate || !amount) return; // Return if rate or amount is not set
    const result = (amount * rate).toFixed(2); // Simple conversion with 2 decimal places
    setConvertedAmount(result); // Set the convertedAmount state with the result
  };

  // Function to refresh the rates when 'Refresh' button is clicked
  const handleRefresh = async () => {
    setLoading(true); // Set the loading state to true
    await fetchRates(); // Fetch rates
    if (amount && rate) {
      const result = (amount * rate).toFixed(2); // Simple conversion with 2 decimal places
      setConvertedAmount(result); // Update the convertedAmount state if the rates have changed
    }
  };

  if (loading) return <div className="text-white">Loading...</div>; // Show loading message if loading state is true
  if (error) return <div className="text-white">{error}</div>; // Show error message if error state is set

  return (
    <div>
      <h1>Currency Converter</h1>
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
  
        {/* Time Last Update */}
        {timeLastUpdate && (
          <div className="mt-2 text-white">
            <p>Last updated: {new Date(timeLastUpdate).toLocaleString()}</p>
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
