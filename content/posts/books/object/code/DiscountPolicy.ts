import DiscountCondition from "./DiscountCondition";
import Money from "./Money";
import Screening from "./Screening";

export interface DiscountPolicy {
  calculateDiscountAmount(screening: Screening): Money
}

abstract class DefaultDiscountPolicy implements DiscountPolicy {
  private conditions: Array<DiscountCondition> = [];

  constructor(conditions: DiscountCondition[]) {
    this.conditions = conditions;
  }

  calculateDiscountAmount(screening: Screening): Money {
    for(let condition of this.conditions) {
      if(condition.isSatisfiedBy(screening)) {
        return this.getDiscountAmount(screening);
      }
    }

    return Money.ZERO;
  }

  protected abstract getDiscountAmount(screening: Screening): Money;
}

export default DefaultDiscountPolicy;