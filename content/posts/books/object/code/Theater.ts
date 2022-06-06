import TicketSeller from './TicketSeller';
import Audience from './Audience';

class Theater {
  private ticketSeller: TicketSeller

  constructor(ticketSeller: TicketSeller) {
    this.ticketSeller = ticketSeller;
  }

  public enter(audience: Audience): void {
    if (audience.getBag().hasInvitaion()) {
      const ticket = this.ticketSeller.getTicketOffice().getTicket();

      audience.getBag().setTicket(ticket);
    } else {
      const ticket = this.ticketSeller.getTicketOffice().getTicket();

      audience.getBag().minusAmount(ticket.getFee());
      this.ticketSeller.getTicketOffice().plusAmount(ticket.getFee());
      audience.getBag().setTicket(ticket);
    }
  }
}

export default Theater;
