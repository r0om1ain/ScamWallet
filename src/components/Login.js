const users = JSON.parse(localStorage.getItem('users')) || [];
const login = (username, password) => {
  const user = users.find((u) => u.username === username && u.password === password);
  return user;
};