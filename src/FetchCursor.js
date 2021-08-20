export const LOAD_BATCH_SIZE = 2;
export const PRELOAD_BATCH_SIZE = 4;

export const FetchStrategy = {
  PRELOAD_ONLY: 'FETCH_STRATEGY__PRELOAD_ONLY',
  GREEDY: 'FETCH_STRATEGY__GREEDY',
  LAZY: 'FETCH_STRATEGY__LAZY',
};

class FetchCursor {
  constructor(index, size, batchSize) {
    this.index = Math.min(index, size);
    this.size = size;
    this.batchSize = batchSize;
  }

  chunks() {
    const chunkCount = Math.min(this.batchSize, this.size - this.index);
    return Array(chunkCount)
      .fill(this.index)
      .map((x, i) => x + i);
  }
}

class PreloadCursor extends FetchCursor {
  seek() {
    return new ExhaustedCursor(this.index, this.size, this.batchSize);
  }
}

class GreedyCursor extends FetchCursor {
  seek() {
    const nextIndex = this.index + this.batchSize;
    return nextIndex >= this.size
      ? new ExhaustedCursor(this.size, this.size, this.batchSize)
      : new GreedyCursor(nextIndex, this.size, this.batchSize);
  }
}

class LazyCursor extends FetchCursor {
  seek(playheadIndex) {
    return playheadIndex > this.size
      ? new ExhaustedCursor(this.size, this.size, this.batchSize)
      : new LazyCursor(playheadIndex, this.size, this.batchSize);
  }
}

class ExhaustedCursor extends FetchCursor {
  chunks() {
    return [];
  }
  seek() {
    return this;
  }
}

export const createFetchCursor = ({
  index = 0,
  size,
  strategy = FetchStrategy.GREEDY,
}) => {
  switch (strategy) {
    case FetchStrategy.PRELOAD_ONLY:
      return new PreloadCursor(index, size, PRELOAD_BATCH_SIZE);
    case FetchStrategy.LAZY:
      return new LazyCursor(index, size, LOAD_BATCH_SIZE * 2);
    case FetchStrategy.GREEDY:
      return new GreedyCursor(index, size, LOAD_BATCH_SIZE);
  }
};
