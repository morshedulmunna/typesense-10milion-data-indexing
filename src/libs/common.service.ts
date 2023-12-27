export class CommonService {
  randomNumber(range: number) {
    Math.floor(1000 + Math.random() * range).toString();
  }
}
