export class entretiens {
  static Path = 'http://localhost:9000/src/api/entretien.json';

  static async getInterviewById(id) {
    const response = await fetch(this.Path);
    const data = await response.json();
    const itw = data.find((entretien) => entretien.id == id);
    if (!itw) {
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
