import DiscountPolicy from "./DiscountPolicy";
import Money from "./Money";
import Screening from "./Screening";

class Movie {
  private title: string;
  private fee: Money;
  private runningTime: Date;
  private discountPolicy: DiscountPolicy;

  constructor(title: string, fee: Money, runningTime: Date, discountPolicy: DiscountPolicy) {
    this.title = title;
    this.fee = fee;
    this.runningTime = runningTime;
    this.discountPolicy = discountPolicy;
  }

  getFee(): Money {
    return this.fee;
  }

  calculateMovieFee(screening: Screening): Money {
    // 어떤 할인정책을 사용할 건지에 대한 코드가 없다.
    return this.fee.minus(this.discountPolicy.calculateDiscountAmount(screening));
  }
}

export default Movie;
