import * as Tone from 'tone';

export class Synth {
  constructor(note: string, synth: Tone.Synth<Tone.SynthOptions>) {
    this.note = note;
    this.synth = synth;
  }
  note: string;
  synth: Tone.Synth<Tone.SynthOptions>;
}
