export class entretiens {
  static Path = 'http://localhost:9000/src/api/entretien.json';

  static async getInterviewById(id) {
    const response = await fetch(this.Path);
    const data = await response.json();
    return data.find((entretien) => entretien.id == id);
  }

  static async getAllInterview() {
    const response = await fetch(this.Path);
    const data = await response.json();
    return data;
  }
}
