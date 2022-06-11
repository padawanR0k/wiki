import DiscountPolicy from './DiscountPolicy';
import Money from './Money';
import DiscountCondition from './DiscountCondition';
import Screening from './Screening';

class AmountDiscountPolicy extends DiscountPolicy {
  discountAmount: Money;

  constructor(discountAmount: Money, conditions: DiscountCondition[]) {
    super(conditions);
    this.discountAmount = discountAmount;
  }

  // 추상 클래스의 인터페이스를 구현
  protected getDiscountAmount(screening: Screening): Money {
    return this.discountAmount;
  }
}

export default AmountDiscountPolicy;