import axios from 'axios';

export class ManagerList {
  static Path = 'https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/users';

  static async getUsersByManager(id) {
    try {
      const response = await axios.get(this.Path);
      const data = response.data;
      return data.filter((user) => user.manager === id);
    } catch (error) {
      return [];
    }
  }
}
