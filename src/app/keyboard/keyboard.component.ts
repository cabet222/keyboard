import { Component, OnInit } from '@angular/core';
import { delay, fromEvent, Observable, of } from 'rxjs';
import * as Tone from 'tone';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css'],
})
export class KeyboardComponent implements OnInit {
  public black: number[] = [];
  public white = [...Array(21 + 1)].map((_, i) => i - 1);

  public WHITE_KEYS: string = 'asdfghjkl;:]';
  public BLACK_KEYS: string = 'qwertyuiop@[';

  public yoko: number = -1;
  public key: number = 4;

  ngOnInit(): void {
    fromEvent(document, 'keydown').subscribe((e: any) => {
      let div: HTMLElement | null;
      if (e.key == 'ArrowUp') {
        this.key++;
        return;
      } else if (e.key == 'ArrowDown') {
        this.key--;
        return;
      } else if (e.key == 'ArrowRight') {
        this.yoko++;
        return;
      } else if (e.key == 'ArrowLeft') {
        this.yoko--;
        return;
      } else if (this.WHITE_KEYS.indexOf(e.key) !== -1) {
        this.tone(1, this.WHITE_KEYS.indexOf(e.key));
        div = document.getElementById(
          '1-' + this.WHITE_KEYS.indexOf(e.key).toString()
        );
      } else if (this.BLACK_KEYS.indexOf(e.key) !== -1) {
        div = document.getElementById(
          '2-' + this.BLACK_KEYS.indexOf(e.key).toString()
        );
        if (div) {
          this.tone(2, this.BLACK_KEYS.indexOf(e.key));
        }
      } else {
        return;
      }
      if (div) {
        this.changeColor(div).subscribe((_) => {
          if (div!.id.substring(0, 1) === '1') {
            div!.style.backgroundColor = 'white';
          } else {
            div!.style.backgroundColor = 'black';
          }
        });
      }
    });
  }

  private changeColor(div: any): Observable<string[]> {
    div.style.backgroundColor = 'lightblue';
    return of(['hoge', 'hige']).pipe(delay(500));
  }

  public tone(type: number, index: number): void {
    const synth = new Tone.Synth().toDestination();

    let note: string = `${'CDEFGAB'.charAt((index + 777 + this.yoko) % 7)}${
      type === 2 ? '#' : ''
    }${Math.floor((index + this.yoko) / 7) + this.key}`;

    console.log(`${index} ${note}`);

    synth.triggerAttackRelease(note, '8n');
  }
}
