import { IMAGE_GENERATION_CONFIG, MAX_SEED } from 'model-bank';

export function generateUniqueSeeds(seedCount: number): number[] {
  const seeds = new Set<number>();

  while (seeds.size < seedCount) {
    // Generate a random integer between 0 and MAX_SEED
    const randomInt = Math.floor(Math.random() * (MAX_SEED + 1));

    // Add to the set, ensuring uniqueness
    seeds.add(randomInt);
  }

  return Array.from(seeds);
}

/**
 * Calculate thumbnail dimensions
 * Generate thumbnail with configurable max edge size
 */
export function calculateThumbnailDimensions(
  originalWidth: number,
  originalHeight: number,
  maxSize: number = IMAGE_GENERATION_CONFIG.THUMBNAIL_MAX_SIZE,
): {
  shouldResize: boolean;
  thumbnailHeight: number;
  thumbnailWidth: number;
} {
  const shouldResize = originalWidth > maxSize || originalHeight > maxSize;

  if (!shouldResize) {
    return {
      shouldResize: false,
      thumbnailHeight: originalHeight,
      thumbnailWidth: originalWidth,
    };
  }

  const thumbnailWidth =
    originalWidth > originalHeight
      ? maxSize
      : Math.round((originalWidth * maxSize) / originalHeight);

  const thumbnailHeight =
    originalHeight > originalWidth
      ? maxSize
      : Math.round((originalHeight * maxSize) / originalWidth);

  return {
    shouldResize: true,
    thumbnailHeight,
    thumbnailWidth,
  };
}
