import Invitation from "./Invitation"
import Ticket from "./Ticket"

class Bag {
  private amount: number
  private invitaion: Invitation
  private ticket: Ticket

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

  plusAmount(amount) {
    this.amount = this.amount + amount;
  }
}

export default Bag;