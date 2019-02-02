import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeTriggerService {

  private timeouts: any;

  constructor() {
    this.timeouts = {};
  }

  /**
   * Trigger a timeout
   * @param name timeout name
   * @param fn function
   * @param time time where will be called
   */
  trigger(name: string, fn: () => void, time: number): void {

    // If exists, cancel the item that was before
    if (this.timeouts[name]) {
      clearTimeout(this.timeouts[name]);
    }

    this.timeouts[name] = setTimeout(fn, time);
  }

  /**
   * Cancel a timeout
   * @param name name of the timeout
   */
  cancel(name: string): void {
    if (this.timeouts[name]) {
      clearTimeout(this.timeouts[name]);
    }
  }
}
