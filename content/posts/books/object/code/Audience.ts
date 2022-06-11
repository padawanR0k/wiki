import Bag from './Bag';
import Ticket from './Ticket';

class Audience {
  private bag: Bag;

  constructor(bag: Bag) {
    this.bag = bag;
  }

  getBag() {
    return this.bag;
  }

  buy(ticket: Ticket) {
    return this.bag.hold(ticket)
  }
}

export default Audience;