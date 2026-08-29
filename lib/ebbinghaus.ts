// 艾宾浩斯 8 阶段复习时间间隔（单位：分钟/小时/天）
const REVIEW_INTERVALS = [
  5,               // 阶段 0: 5 分钟后
  30,              // 阶段 1: 30 分钟后
  12 * 60,         // 阶段 2: 12 小时后
  1 * 24 * 60,     // 阶段 3: 1 天后
  2 * 24 * 60,     // 阶段 4: 2 天后
  4 * 24 * 60,     // 阶段 5: 4 天后
  7 * 24 * 60,     // 阶段 6: 7 天后
  15 * 24 * 60,    // 阶段 7: 15 天后
];

export function calculateNextReview(currentStage: number, remembered: boolean) {
  let nextStage = currentStage;

  if (remembered) {
    // 记得：升级到下一阶段（最高 7 级）
    nextStage = Math.min(currentStage + 1, REVIEW_INTERVALS.length - 1);
  } else {
    // 忘记：重置回阶段 0
    nextStage = 0;
  }

  const intervalMinutes = REVIEW_INTERVALS[nextStage];
  const nextReviewAt = new Date(Date.now() + intervalMinutes * 60 * 1000);

  return {
    nextStage,
    nextReviewAt: nextReviewAt.toISOString(),
  };
}
