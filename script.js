'use strict';

// Bankist App - Simulated Banking Operations

// Dummy data representing movement history for accounts
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Account Data
const account1 = {
  owner: 'Ahmed Ayman',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// UI Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let currentAccount;

// Display transaction history in UI
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Calculate and display account balance
const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

// Currency conversion logic
const euroToUsd = 1.1;
const movementsUSd = account1.movements.map(mov => mov * euroToUsd);
const movementsDescription = movementsUSd.map((mov, i) =>
  mov > 0
    ? `User ${i + 1} has deposited ${mov}€`
    : `User ${i + 1} has withdrawn ${Math.abs(mov)}€`
);

// Calculate and display summary (income, outcome, interest)
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);
  labelSumOut.textContent = `${outcomes}€`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// Generate usernames based on account owner names
const createUsernames = function (user) {
  return user
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
};

accounts.forEach(acc => (acc.username = createUsernames(acc.owner)));

// Update UI with current account data
const updateUI = function (acc) {
  displayMovements(acc.movements);
  displayBalance(acc);
  calcDisplaySummary(acc);
};

// LOGIN handler
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

// TRANSFER handler
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  if (
    amount > 0 &&
    reciverAcc &&
    currentAccount.balance >= amount &&
    reciverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

// LOAN handler
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  const andyDeposit = currentAccount.movements.some(mov => mov > amount * 0.1);
  if (andyDeposit) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
});

// CLOSE ACCOUNT handler
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount?.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// SORT handler
let sortedState = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sortedState);
  sortedState = !sortedState;
});
