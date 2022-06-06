import Ticket from './Ticket';

class TicketOffice {
  private amount: number;
  private tickets: Ticket[];

  constructor(amount: number, tickets: Ticket[]) {
    this.amount = amount;
    this.tickets = tickets;
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