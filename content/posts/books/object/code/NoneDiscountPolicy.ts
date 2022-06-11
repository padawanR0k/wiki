import DiscountPolicy from "./DiscountPolicy";
import Money from "./Money";
import Screening from "./Screening";

// 일관성을 지키기 위해 추가
class NoneDiscountPolicy extends DiscountPolicy {
  protected getDiscountAmount(screening: Screening) {
    return Money.ZERO;
  }
}

export default NoneDiscountPolicy;