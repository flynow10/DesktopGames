export const GameLoop = {
  onUpdate: [],
  deltaTime: 0,
  lastRender: 0,
  init() {
    window.requestAnimationFrame((timestamp) => {
      GameLoop.loop(timestamp);
    });
  },

  loop(timestamp) {
    this.deltaTime = timestamp - this.lastRender;
    for (const callback of GameLoop.onUpdate) {
      callback();
    }
    this.lastRender = timestamp;
    window.requestAnimationFrame((timestamp) => {
      GameLoop.loop(timestamp);
    });
  },

  mouseObjects: {
    objects: [],

    /**
     * @callback MouseAcceptor
     * @param {MouseEvent} event
     */
    /**
     * @param {HTMLElement} domObject
     * @param {MouseAcceptor} mouseDown
     * @param {MouseAcceptor} mouseMove
     * @param {MouseAcceptor} mouseUp
     * @param {MouseAcceptor} mouseEnter
     * @param {MouseAcceptor} mouseExit
     */
    push(
      domObject,
      mouseDown = null,
      mouseMove = null,
      mouseUp = null,
      mouseEnter = null,
      mouseExit = null
    ) {
      if (
        mouseDown !== null ||
        mouseMove !== null ||
        mouseUp !== null ||
        mouseEnter !== null ||
        mouseExit !== null
      ) {
        this.objects.push(domObject);
        domObject.abortController = new AbortController();
        if (mouseDown !== null)
          domObject.addEventListener(
            "mousedown",
            (e) => {
              mouseDown(e);
            },
            { signal: domObject.abortController.signal }
          );
        if (mouseMove !== null)
          domObject.addEventListener(
            "mousemove",
            (e) => {
              mouseMove(e);
            },
            { signal: domObject.abortController.signal }
          );
        if (mouseUp !== null)
          domObject.addEventListener(
            "mouseup",
            (e) => {
              mouseUp(e);
            },
            { signal: domObject.abortController.signal }
          );
        if (mouseEnter !== null)
          domObject.addEventListener(
            "mouseenter",
            (e) => {
              mouseEnter(e);
            },
            { signal: domObject.abortController.signal }
          );
        if (mouseExit !== null)
          domObject.addEventListener(
            "mouseleave",
            (e) => {
              mouseExit(e);
            },
            { signal: domObject.abortController.signal }
          );
      }
    },

    /**
     * @param {HTMLElement} domObject
     */
    remove(domObject) {
      if (this.objects.indexOf(domObject) !== -1) {
        this.objects.splice(this.objects.indexOf(domObject), 1);
        if (domObject.abortController) {
          domObject.abortController.abort();
        }
      }
    },
  },
};
