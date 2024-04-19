import axios from "axios";

export class entretiens {
  static Path = 'https://rod-apps-restis-api-01.azurewebsites.net/api/aymen/entretiens';

  static async getInterviewById(id) {
    const response = await fetch(this.Path);
    const data = await response.json();
    const itw = data.find((entretien) => entretien.id == id);
    if (!itw) {
      throw new 404();
    }

    return itw;
  }

  static async getInterviewByIdUser(id) {
    try {
      const { data } = await axios.get(this.Path);
      return data.find((entretien) => entretien.employeId == id);
    }
    catch (error) {
      return [];
    }
  }

  static async getAllInterviewByManagerId(id) {
    const response = await fetch(this.Path);
    const data = await response.json();
    const itwArray = data.filters((entretien) => entretien.ManagerId == id);
    if (!itwArray) {
      throw new 404();
    }

    return itw;
  }

  static async getAllInterview() {
    const response = await fetch(this.Path);
    const data = await response.json();
    return data;
  }
}
