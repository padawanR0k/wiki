import TicketOffice from './TicketOffice';
import Audience from './Audience';

class TicketSeller {
  private ticketOffice: TicketOffice;

  constructor(ticketOffice: TicketOffice) {
    this.ticketOffice = ticketOffice;
  }

  public sellTo(audience: Audience) {
    this.ticketOffice.plusAmount(audience.buy(this.ticketOffice.getTicket()))
  }
}

export default TicketSeller;