export class users {
  static Path = '../../users.json';

  static async login(email, password) {
    const response = await fetch(this.Path);
    const data = await response.json();
    return data.find((user) => user.email === email && user.password === password);
  }

  static async getUserById(id) {
    const response = await fetch(this.Path);
    const data = await response.json();
    return data.find((user) => user.id === id);
  }
}
