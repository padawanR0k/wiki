import Ticket from './Ticket';
import Audience from './Audience';

class TicketOffice {
  private amount: number;
  private tickets: Ticket[];

  constructor(amount: number, tickets: Ticket[]) {
    this.amount = amount;
    this.tickets = tickets;
  }

  sellTicket(audience: Audience) {
    this.plusAmount(audience.buy(this.getTicket()));
  }

  getTicket() {
    return this.tickets.shift();
  }

  minusAmount(amount: number) {
    this.amount = this.amount - amount;
  }

  plusAmount(amount: number) {
    this.amount = this.amount + amount;
  }
}

export default TicketOffice;