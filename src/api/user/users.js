export class users {
  static Path = 'http://localhost:9000/src/api/users.json';

  static async login(email, password) {
    const response = await fetch(this.Path);
    const data = await response.json();
    const user = data.find((user) => user.email === email && user.password === password);
    if (user === undefined) {
      throw new 404();
    }
    return user;
  }

  static async getUserById(id) {
    const response = await fetch(this.Path);
    const data = await response.json();
    return data.find((user) => user.id === id);
  }
}
