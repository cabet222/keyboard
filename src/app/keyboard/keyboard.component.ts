import { Component, OnInit } from '@angular/core';
import { delay, fromEvent, Observable, of } from 'rxjs';
import * as Tone from 'tone';
import { Synth } from '../Synth';

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

  private synths: Synth[] = [];

  ngOnInit(): void {
    fromEvent(document, 'keydown').subscribe((e: any) => {
      if (e.repeat) {
        return;
      }
      if (e.key == 'ArrowUp') {
        this.key++;
        // 音終了
        this.synths.forEach((v) => v.synth.triggerRelease('+0'));
        // 配列を初期化
        this.synths = [];
      } else if (e.key == 'ArrowDown') {
        this.key--;
        // 音終了
        this.synths.forEach((v) => v.synth.triggerRelease('+0'));
        // 配列を初期化
        this.synths = [];
      } else if (e.key == 'ArrowRight') {
        this.yoko++;
        // 音終了
        this.synths.forEach((v) => v.synth.triggerRelease('+0'));
        // 配列を初期化
        this.synths = [];
      } else if (e.key == 'ArrowLeft') {
        this.yoko--;
        // 音終了
        this.synths.forEach((v) => v.synth.triggerRelease('+0'));
        // 配列を初期化
        this.synths = [];
      } else if (
        this.WHITE_KEYS.indexOf(e.key) !== -1 ||
        this.BLACK_KEYS.indexOf(e.key) !== -1
      ) {
        this.tone(e.key);
      }
    });
    fromEvent(document, 'keyup').subscribe((e: any) => {
      if (
        this.WHITE_KEYS.indexOf(e.key) !== -1 ||
        this.BLACK_KEYS.indexOf(e.key) !== -1
      ) {
        this.tone(e.key, false);
      }
    });
  }

  public tone(keyCode: string, flg: boolean = true): void {
    let isWhite: boolean;
    let index: number;
    let div;

    if (this.WHITE_KEYS.indexOf(keyCode) !== -1) {
      // 白鍵の場合
      isWhite = true;
      index = this.WHITE_KEYS.indexOf(keyCode);
      div = document.getElementById('1-' + index.toString());
    } else if (this.BLACK_KEYS.indexOf(keyCode) !== -1) {
      // 黒鍵の場合
      isWhite = false;
      index = this.BLACK_KEYS.indexOf(keyCode);
      div = document.getElementById('2-' + index.toString());
      if (!div) {
        return;
      }
    } else {
      return;
    }

    let note: string = `${'CDEFGAB'.charAt((index + 777 + this.yoko) % 7)}${
      isWhite ? '' : '#'
    }${Math.floor((index + this.yoko) / 7) + this.key}`;

    if (this.synths.filter((v: any) => v.note === note).length === 0) {
      this.synths.push({ note: note, synth: new Tone.Synth().toDestination() });
    }

    const synth = this.synths.filter((v: any) => v.note === note)[0].synth;

    console.log(`${index} ${note} ${flg ? '→' : '←'}`);

    if (flg) {
      // 音開始
      synth.triggerAttack(note, '0');
      // 鍵盤の色を変更
      div!.style.backgroundColor = 'lightblue';
    } else {
      // 音終了
      synth.triggerRelease('+0');
      // 鍵盤の色をもとに戻す
      if (div!.id.substring(0, 1) === '1') {
        div!.style.backgroundColor = 'white';
      } else {
        div!.style.backgroundColor = 'black';
      }
      // 配列から該当の音を削除
      this.synths = this.synths.filter((v: any) => v.note !== note);
    }
  }
}
