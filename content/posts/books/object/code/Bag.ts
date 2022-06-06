import Invitation from './Invitation';
import Ticket from "./Ticket"

class Bag {
  private amount: number
  private invitaion: Invitation
  private ticket: Ticket

  constructor(amount: number, invitation?: Invitation) {
    if (invitation) {
      this.invitaion = invitation;
    }
    this.amount = amount;
  }

  hasInvitaion(): boolean {
    return this.invitaion !== null
  }

  hasTicket() {
    this.ticket !== null
  }

  setTicket(ticket: Ticket) {
    this.ticket = ticket;
  }

  minusAmount(amount: number) {
    this.amount = this.amount - amount;
  }

  plusAmount(amount: number) {
    this.amount = this.amount + amount;
  }
}

export default Bag;