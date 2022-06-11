class Money {
  static ZERO = Moneys.wons(0);

  amount: number;

  static wons(amount: number) {
    return new Money(amount.valueOf());
  }
  constructor(amount: number) {
    this.amount = amount;
  }

  plus(amount: Money) {
    return new Money(this.amount.add(amount.amount));
  }

  minus(amount: Money) {
    return new Money(this.amount.subtract(amount.amount));
  }

  times(percent: number) {
    return new Money(this.amount.multiply(percent.valueOf()));
  }

  isLessThan(other: Money) {
    return this.amount.compareTo(other.amount) < 0;
  }

  isGreaterThan(other: Money) {
    return this.amount.compareTo(other.amount) >= 0;
  }
}

export default Money;