export const LOAD_BATCH_SIZE = 2;
export const PRELOAD_BATCH_SIZE = 4;

export const FetchStrategy = {
  PRELOAD_ONLY: 'FETCH_STRATEGY__PRELOAD_ONLY',
  GREEDY: 'FETCH_STRATEGY__GREEDY',
  LAZY: 'FETCH_STRATEGY__LAZY',
};

class FetchCursor {
  constructor(index, batchSize, maxIndex) {
    this.index = Math.min(index, maxIndex);
    this.batchSize = batchSize;
    this.maxIndex = maxIndex;
  }

  chunks() {
    const chunkCount = Math.min(this.batchSize, this.maxIndex - this.index);
    return Array(chunkCount)
      .fill(this.index)
      .map((x, i) => x + i);
  }
}

class PreloadCursor extends FetchCursor {
  seek() {
    return new ExhaustedCursor(this.index, this.batchSize, this.maxIndex);
  }
}

class GreedyCursor extends FetchCursor {
  seek() {
    const nextIndex = this.index + this.batchSize;
    return nextIndex >= this.maxIndex
      ? new ExhaustedCursor(this.maxIndex, this.batchSize, this.maxIndex)
      : new GreedyCursor(this.index + this.batchSize, this.batchSize, this.maxIndex);
  }
}

class LazyCursor extends FetchCursor {
  seek(playheadIndex) {
    return playheadIndex > this.maxIndex
      ? new ExhaustedCursor(this.maxIndex, this.batchSize, this.maxIndex)
      : new LazyCursor(playheadIndex, this.batchSize, this.maxIndex);
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
  maxIndex,
  strategy = FetchStrategy.GREEDY,
}) => {
  switch (strategy) {
    case FetchStrategy.PRELOAD_ONLY:
      return new PreloadCursor(index, PRELOAD_BATCH_SIZE, maxIndex);
    case FetchStrategy.LAZY:
      return new LazyCursor(index, LOAD_BATCH_SIZE, maxIndex);
    case FetchStrategy.GREEDY:
      return new GreedyCursor(index, LOAD_BATCH_SIZE, maxIndex);
  }
};
