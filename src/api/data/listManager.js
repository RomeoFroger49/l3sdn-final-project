import axios from 'axios';

export class ManagerList {
  static Path = 'https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/users';
  static isLoading = true;

  static async getUsersByManager(id) {
    this.isLoading = true;
    try {
      const response = await axios.get(this.Path);
      const data = response.data;
      this.isLoading = false;
      return data.filter((user) => user.manager === id);
    } catch (error) {
      this.isLoading = false;
      return [];
    }
  }
}
