export function useEventManger() {
  return {
    addEventListener: window.EventManager.addEventListener.bind(
      window.EventManager
    ),
    dispatchEvent: window.EventManager.dispatchEvent.bind(window.EventManager),
  };
}

type EventCallback = (event?: any) => void;
export class EventManager {
  private listeners: { [event: string]: EventCallback[] } = {};
  addEventListener(
    eventType: string,
    callback: EventCallback
  ): (() => void) | boolean {
    if (!(eventType in this.listeners)) {
      this.listeners[eventType] = [];
    }
    if (this.listeners[eventType].includes(callback)) {
      return false;
    }
    this.listeners[eventType].push(callback);

    return () => {
      if (this.listeners[eventType].includes(callback)) {
        this.listeners[eventType].splice(
          this.listeners[eventType].indexOf(callback),
          1
        );
      }
    };
  }

  dispatchEvent(eventType: string, event?: any): boolean {
    if (eventType in this.listeners) {
      this.listeners[eventType].forEach((listener) => listener(event));
      return true;
    }
    return false;
  }
}
