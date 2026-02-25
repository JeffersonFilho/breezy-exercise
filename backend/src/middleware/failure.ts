export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

export function randomDelay(min: number, max: number, signal?: AbortSignal): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Delay aborted', 'AbortError'));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Delay aborted', 'AbortError'));
    }, { once: true });
  });
}

export function maybeServerError(rate: number): void {
  if (Math.random() < rate) {
    throw new ApiError(500, 'Internal server error');
  }
}

export function maybeConflict(rate: number): void {
  if (Math.random() < rate) {
    throw new ApiError(
      409,
      'Conflict: profile was updated by another session. Please refresh.',
    );
  }
}
