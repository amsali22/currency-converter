// Define a functional component called AmountInput that takes in props: amount and onChange
const AmountInput = ({ amount, onChange }) => {
  return (
    // Render an input element of type number
    <input
    type="number" // Input type is number
    value={amount} // Set the value of the input to the amount prop
    onChange={onChange} // Set the onChange event to the onChange prop
    placeholder="Enter amount" // Placeholder text for the input
    className="inputtext" // CSS class for styling
    />
  );
  };
  
  // Export the AmountInput component as the default export
  export default AmountInput;