const API_URL = "https://mwallet-json-server.onrender.com";

export async function getUserByEmail(email) {
  try {
    const response = await fetch(
      `${API_URL}/users?email=${encodeURIComponent(email)}`
    );
    const users = await response.json();
    return Array.isArray(users) && users.length ? users[0] : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function getUserById(userId) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`);
    return response.ok ? await response.json() : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function createUser(userData) {
  try {
    const checkUser = await getUserByEmail(userData.email);
    if (checkUser) {
      throw new Error("This email already exists");
    }

    const bankList = [
      { name: "Access Bank", code: "044" },
      { name: "GTBank", code: "058" },
      { name: "Zenith Bank", code: "057" },
      { name: "First Bank", code: "011" },
      { name: "UBA", code: "033" },
      { name: "Fidelity Bank", code: "070" },
    ];
    const randomBank = bankList[Math.floor(Math.random() * bankList.length)];
    const accountNumber = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `id-${Date.now()}`;

    const newUser = {
      ...userData,
      id,
      walletBalance: 50000,
      pin: "1234",
      accounts: [{ bankCode: randomBank.code, accountNumber }],
    };

    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    return response.ok ? await response.json() : null;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function updateUserBalance(userId, newBalance) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletBalance: newBalance }),
    });
    return response.ok ? await response.json() : null;
  } catch (error) {
    console.error("Error updating balance:", error);
    throw error;
  }
}

export async function getUserByAccount(bankCode, accountNumber) {
  try {
    const res = await fetch(`${API_URL}/users`);
    const users = await res.json();
    return (
      users.find((user) =>
        user.accounts?.some(
          (acc) =>
            acc.bankCode === bankCode && acc.accountNumber === accountNumber
        )
      ) || null
    );
  } catch (error) {
    console.error("Error fetching by account:", error);
    return null;
  }
}

export async function getUserByPhone(phoneNumber) {
  try {
    const response = await fetch(
      `${API_URL}/users?phone=${encodeURIComponent(phoneNumber)}`
    );
    const users = await response.json();
    return Array.isArray(users) && users.length ? users[0] : null;
  } catch (error) {
    console.error("Error fetching Phone Number:", error);
    return null;
  }
}

export async function addTransaction(transaction) {
  try {
    const response = await fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    });
    return response.ok ? await response.json() : null;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}

export async function getAllTransactions() {
  try {
    const res = await fetch(`${API_URL}/transactions`);
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

export async function getTransactionsByUser(userId) {
  try {
    const all = await getAllTransactions();
    return all.filter(
      (trans) =>
        trans.senderId === userId ||
        trans.receiverId === userId ||
        trans.userId === userId
    );
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return [];
  }
}

export async function getBanks() {
  try {
    const res = await fetch(`${API_URL}/banks`);
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}
