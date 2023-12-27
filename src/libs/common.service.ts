export class CommonService {
  randomNumber(range: number) {
    return Math.floor(1000 + Math.random() * range).toString();
  }
}
