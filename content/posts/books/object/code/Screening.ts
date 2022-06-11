class Screening {
  movie: Movie;
  sequence: number;
  whenScreened: Date;
  constructor(movie: MouseEventInit, sequence: number, whenScreened: Date) {
    this.movie = movie;
    this.sequence = sequence;
    this.whenScreened = whenScreened;
  }

  getStartTime() {
    return this.whenScreened;
  }

  isSequence(sequence: number) {
    return this.sequence === sequence;
  }
}

export default Screening;
