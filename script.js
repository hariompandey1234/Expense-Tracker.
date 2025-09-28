// Global array to store all expenses
let expenses = [];

// DOM Elements: Cache frequently accessed elements for performance
const form = document.getElementById('expense-form');
const transactionsList = document.getElementById('transactions');
const totalAmountDisplay = document.getElementById('total-amount');

// --- 1. INITIALIZATION ---
// Load expenses from local storage when the app starts
function init() {
    // Retrieve the JSON string from localStorage
    const storedExpenses = localStorage.getItem('expenses');
    
    // Check if data exists and is valid
    if (storedExpenses) {
        // Parse the JSON string back into a JavaScript array
        try {
            expenses = JSON.parse(storedExpenses);
        } catch (error) {
            console.error("Error parsing expenses from localStorage:", error);
            // Fallback to an empty array if parsing fails
            expenses = []; 
        }
    }
    
    // Render the loaded expenses and update the total
    renderExpenses();
    updateTotal();
}

// --- 2. LOCAL STORAGE MANAGEMENT ---
function saveToLocalStorage() {
    // Convert the JavaScript array to a JSON string and save it
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// --- 3. RENDERING AND DISPLAY ---
function renderExpenses() {
    // Clear the current list before rendering to prevent duplicates
    transactionsList.innerHTML = ''; 

    // Sort expenses by date if you want the newest first (Optional, but good practice)
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    expenses.forEach(expense => {
        // Create the new list item
        const listItem = document.createElement('li');
        
        // Ensure amount is a number, otherwise use 0
        const amount = typeof expense.amount === 'number' ? expense.amount : 0; 

        // Use Template Literals (backticks) for structure
        listItem.innerHTML = `
            <span>${expense.name} (${expense.date})</span>
            <span class="expense-amount">₹${amount.toFixed(2)}</span>
            <button class="delete-btn" data-id="${expense.id}">X</button>
        `;
        
        transactionsList.appendChild(listItem);
    });
}

function updateTotal() {
    // Use the 'reduce' array method to sum all amounts
    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    
    // Update the display in the summary section (यह लाइन 100% सही है)
    totalAmountDisplay.textContent = ₹${total.toFixed(2)};
}


// --- 4. EVENT HANDLERS ---
// Handle form submission
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Stop the default browser action (page reload)
    
    const nameInput = document.getElementById('name');
    const amountInput = document.getElementById('amount');
    const dateInput = document.getElementById('date');
    
    // Simple validation check
    if (!nameInput.value || !amountInput.value || !dateInput.value) {
        alert("Please enter the Name, Amount, and Date.");
        return; // Stop the function if validation fails
    }

    const newExpense = {
        id: Date.now(), 
        name: nameInput.value.trim(), 
        amount: parseFloat(amountInput.value), 
        date: dateInput.value
    };

    expenses.push(newExpense); 
    
    // Update the app state (render, total, storage)
    renderExpenses();
    updateTotal();
    saveToLocalStorage();

    // Clear the form fields for the next entry
    form.reset();
});


// Handle click events on the transactions list (Delegation)
transactionsList.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        const idToDelete = parseInt(event.target.dataset.id);
        
        expenses = expenses.filter(expense => expense.id !== idToDelete);
        
        // Update the app state (render, total, storage)
        renderExpenses();
        updateTotal();
        saveToLocalStorage();
    }
});


// Start the application after all functions are defined
init();