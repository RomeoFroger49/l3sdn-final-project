export class users {
  static Path = '../../users.json';

  static async getUsers() {
    const response = await fetch(this.Path);
    const data = await response.json();
    return data;
  }
}
