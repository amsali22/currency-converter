const AmountInput = ({ amount, onChange }) => {
    return (
      <input
        type="number"
        value={amount}
        onChange={onChange}
        placeholder="Enter amount"
        className="inputtext"
      />
    );
  };
  
  export default AmountInput;
  