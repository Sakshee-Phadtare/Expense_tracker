let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let editIndex = null;
const expenseList = document.getElementById('expense-list');
const totalExpense = document.getElementById('total-expense');
const expenseModal = document.getElementById('expense-modal');
const expenseChartCtx = document.getElementById('expenseChart').getContext('2d');
let expenseChart;

function openModal(index = null) {
    editIndex = index;
    document.getElementById('modal-title').innerText = index === null ? 'Add Expense' : 'Edit Expense';
    const expense = index !== null ? expenses[index] : { description: '', amount: '', date: '', category: '' };
    document.getElementById('description').value = expense.description;
    document.getElementById('amount').value = expense.amount;
    document.getElementById('date').value = expense.date;
    document.getElementById('category').value = expense.category;
    expenseModal.style.display = 'flex';
}

function closeModal() {
    expenseModal.style.display = 'none';
}

window.onclick = function (event) {
    if (event.target === expenseModal)
        closeModal();
};

function saveExpense() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;

  
    const descriptionPattern = /^[a-zA-Z0-9\s,.!?]*$/; 


    if (!descriptionPattern.test(description)) {
        alert("Description can only contain letters, numbers, and limited punctuation (.,!?).");
        return;
    }

    if (!description || isNaN(amount) || amount <= 0 || !date || !category) {
        alert("Please fill out all fields with valid data.");
        return;
    }

    const expenseData = { id: Date.now(), description, amount, date, category };

    if (editIndex !== null) {
        expenses[editIndex] = expenseData;
    } else {
        expenses.unshift(expenseData);
    }

    // Save to localStorage
    localStorage.setItem('expenses', JSON.stringify(expenses));

    updateExpenseList();
    updateChart();
    closeModal();
}

function updateExpenseList() {
    const filter = document.getElementById('category-filter').value;
    const filteredExpenses = filter === 'All' ? expenses : expenses.filter(exp => exp.category === filter);

    expenseList.innerHTML = filteredExpenses.map((exp, index) => `
                <div class="expense-item">
                    <span class="expense-name">${exp.description}</span>
                    <span class="expense-name">$${exp.amount.toFixed(2)}</span>
                    <span class="expense">${exp.category}</span>
                    <span class="expense">${exp.date}</span>
                    <span>
                        <i class="fas fa-edit" onclick="openModal(${index})"></i>
                        <i class="fas fa-trash" onclick="deleteExpense(${index})"></i>
                    </span>
                </div>
            `).join('');

    const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    totalExpense.innerText = `Total: $${total.toFixed(2)}`;
}


function deleteExpense(index){
var result = confirm("Want to delete?");
if (result) {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));  
    updateExpenseList();
    updateChart();
}}


function filterExpenses() {
    updateExpenseList();
}

function updateChart() {
    const categories = ['Food', 'Transport', 'Shopping', 'Other'];
    const data = categories.map(category => {
        const categoryExpenses = expenses.filter(expense => expense.category === category);
        const totalForCategory = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        return totalForCategory;
    });


    if (expenseChart) expenseChart.destroy();

    expenseChart = new Chart(expenseChartCtx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                label: 'Expenses by Category',
                data: data,
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0']
            }]
        },
        options: { responsive: true }
    });
}

// Initial load
updateExpenseList();
updateChart();
