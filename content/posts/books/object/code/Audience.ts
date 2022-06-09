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
    if (this.bag.hasInvitaion()) {
      this.bag.setTicket(ticket);
      return 0;
    } else {
      this.bag.setTicket(ticket);
      this.bag.minusAmount(ticket.getFee());
      return ticket.getFee()
    }
  }
}

export default Audience;