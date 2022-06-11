import DiscountCondition from "./DiscountCondition";
import Screening from "./Screening";

class PeriodCondition implements DiscountCondition {
  dayOfWeek: number;
  startTime: Date;
  endTime: Date;

  constructor(dayOfWeek: number, startTime: Date, endTime: Date) {
    this.dayOfWeek = dayOfWeek;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  isSatisfiedBy(screening: Screening): boolean {
    return screening.getStartTime().getDay() === this.dayOfWeek &&
      this.startTime <= screening.getStartTime() &&
      this.endTime >= screening.getStartTime();
  }
}

export default PeriodCondition;