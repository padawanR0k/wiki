import TicketOffice from './TicketOffice';
import Audience from './Audience';

class TicketSeller {
  private ticketOffice: TicketOffice;

  constructor(ticketOffice: TicketOffice) {
    this.ticketOffice = ticketOffice;
  }

  public sellTo(audience: Audience) {
    if (audience.getBag().hasInvitaion()) {
      const ticket = this.ticketOffice.getTicket();

      audience.getBag().setTicket(ticket);
    } else {
      const ticket = this.ticketOffice.getTicket();

      audience.getBag().minusAmount(ticket.getFee());
      this.ticketOffice.plusAmount(ticket.getFee());
      audience.getBag().setTicket(ticket);
    }
  }
}

export default TicketSeller;