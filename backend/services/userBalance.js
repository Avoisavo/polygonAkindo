/**
 * User Balance Service
 * Tracks user deposits and agent spending on their behalf
 * 
 * In production, this should use a database (PostgreSQL, MongoDB, etc.)
 * For demo, using in-memory Map
 */

// User balances: userId -> balance in wei
const userBalances = new Map();

// Transaction history: userId -> [transactions]
const transactionHistory = new Map();

/**
 * Get user's current balance
 * @param {string} userId - User identifier (wallet address or session ID)
 * @returns {BigInt} - Balance in wei
 */
export function getUserBalance(userId) {
  return userBalances.get(userId) || 0n;
}

/**
 * Add funds to user's balance
 * Called when user deposits to agent wallet
 * @param {string} userId - User identifier
 * @param {BigInt} amount - Amount in wei
 * @param {string} txHash - Deposit transaction hash
 */
export function addFunds(userId, amount, txHash) {
  const currentBalance = getUserBalance(userId);
  const newBalance = currentBalance + amount;
  
  userBalances.set(userId, newBalance);
  
  // Record transaction
  recordTransaction(userId, {
    type: 'deposit',
    amount: amount,
    txHash: txHash,
    timestamp: new Date().toISOString(),
    balanceAfter: newBalance
  });
  
  console.log(`💰 User ${userId.substring(0, 8)}... deposited ${amount} wei. New balance: ${newBalance}`);
  
  return newBalance;
}

/**
 * Deduct funds from user's balance
 * Called when agent spends on user's behalf
 * @param {string} userId - User identifier
 * @param {BigInt} amount - Amount in wei
 * @param {string} purpose - What the payment was for
 * @param {string} txHash - Payment transaction hash
 * @returns {boolean} - True if deduction successful
 */
export function deductFunds(userId, amount, purpose, txHash) {
  const currentBalance = getUserBalance(userId);
  
  if (currentBalance < amount) {
    console.error(`❌ Insufficient balance for user ${userId.substring(0, 8)}...`);
    return false;
  }
  
  const newBalance = currentBalance - amount;
  userBalances.set(userId, newBalance);
  
  // Record transaction
  recordTransaction(userId, {
    type: 'payment',
    amount: amount,
    purpose: purpose,
    txHash: txHash,
    timestamp: new Date().toISOString(),
    balanceAfter: newBalance
  });
  
  console.log(`💸 Deducted ${amount} wei from user ${userId.substring(0, 8)}... for ${purpose}. New balance: ${newBalance}`);
  
  return true;
}

/**
 * Record a transaction in history
 * @param {string} userId - User identifier
 * @param {Object} transaction - Transaction details
 */
function recordTransaction(userId, transaction) {
  if (!transactionHistory.has(userId)) {
    transactionHistory.set(userId, []);
  }
  
  transactionHistory.get(userId).push(transaction);
}

/**
 * Get user's transaction history
 * @param {string} userId - User identifier
 * @param {number} limit - Maximum number of transactions to return
 * @returns {Array} - Array of transactions
 */
export function getTransactionHistory(userId, limit = 50) {
  const history = transactionHistory.get(userId) || [];
  return history.slice(-limit).reverse(); // Most recent first
}

/**
 * Get all users with balances
 * @returns {Map} - Map of userId -> balance
 */
export function getAllBalances() {
  return new Map(userBalances);
}

/**
 * Check if user has sufficient balance
 * @param {string} userId - User identifier
 * @param {BigInt} requiredAmount - Amount needed in wei
 * @returns {boolean} - True if user has enough
 */
export function hasSufficientBalance(userId, requiredAmount) {
  const balance = getUserBalance(userId);
  return balance >= requiredAmount;
}

