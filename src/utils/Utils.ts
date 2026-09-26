export class Utils {
  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
   */
  static getCurrentPosition(): Promise<GeolocationCoordinates> {
    return new Promise((resolve, reject) => {
      if ( !("geolocation" in navigator) ) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      /**
       * A positive long value indicating the maximum age in milliseconds of a possible cached position that is
       * acceptable to return. If set to 0, it means that the device cannot use a cached position and must attempt to
       * retrieve the real current position. If set to Infinity the device must return a cached position regardless of
       * its age. Default: 0.
       */
      const maximumAge = 10 * 60_000;

      /**
       * A positive long value representing the maximum length of time (in milliseconds) the device is allowed to take
       * in order to return a position. The default value is Infinity, meaning that getCurrentPosition() won't return
       * until the position is available.
       */
      const timeout = 10_000;

      navigator.geolocation.getCurrentPosition(
        position => resolve(position.coords),
        reject,
        { timeout, maximumAge }
      );
    });
  }

  /**
   * @link {https://github.com/petr-ptacek/js-lab/blob/main/packages/js-core/src/async/withAbortable/withAbortable.ts}
   * @example
   * const search = Utils.withAbortable((signal, query: string) => fetch(url, { signal }));
   * search("f");  // aborted by the next call
   * search("fa");
   * search.abort(); // aborts the pending call manually
   */
  static withAbortable<TArgs extends unknown[], TResult>(
    fn: (signal: AbortSignal, ...args: TArgs) => Promise<TResult>
  ) {
    let controller: AbortController | null = null;

    const abort = () => {
      controller?.abort();
      controller = null;
    };

    const wrapped = async (...args: TArgs): Promise<TResult> => {
      abort();

      const current = new AbortController();
      controller = current;

      const result = await fn(current.signal, ...args);

      // fn may ignore the signal – never return a stale result
      current.signal.throwIfAborted();

      return result;
    };

    return Object.assign(wrapped, { abort });
  }

  static isAbortError(e: unknown): boolean {
    return e instanceof DOMException && e.name === "AbortError";
  }

}