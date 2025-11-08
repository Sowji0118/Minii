import { users } from '../data/mockData';

export const login = (username, password) => {
  console.log("Attempting login for:", username);
  const user = users.find(u => (u.id === username || u.email === username) && u.password === password);
  if (user) {
    console.log("Login successful for:", user.name);
    // eslint-disable-next-line no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  console.log("Login failed for:", username);
  return null;
};

export const logout = () => {
  // In a real app, this would invalidate a token on the server
  console.log("User logged out");
};
