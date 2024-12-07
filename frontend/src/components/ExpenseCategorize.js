(
    <div>
      <h1>Expense Categorizer</h1>
      <input
        type="text"
        placeholder="Enter expense description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleCategorize}>Categorize</button>
      {category && <p>Category: {category}</p>}
    </div>
  );

export default ExpenseCategorizer;