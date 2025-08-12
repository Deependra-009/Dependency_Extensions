// Example code to test the Time Estimator extension

function calculateTotal(items) {
  let total = 0;
  for (let item of items) {
    total += item.price;
  }
  return total;
}

function processUserData(userData) {
  // TODO: Implement user data processing
  const processed = userData.map(user => ({
    id: user.id,
    name: user.name.toUpperCase(),
    email: user.email.toLowerCase()
  }));
  return processed;
}

class UserService {
  constructor() {
    this.users = [];
  }

  addUser(user) {
    this.users.push(user);
  }

  getUserById(id) {
    return this.users.find(user => user.id === id);
  }
}
