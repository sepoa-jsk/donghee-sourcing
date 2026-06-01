/* ============================================================
   calc-engine.js — 원가 계산 엔진
   ============================================================ */

const CalcEngine = {
  // 재료비 = 중량 × 단가 × (1 + 스크랩율)
  materialCost(weight, unitPrice, scrapRate = 0.05) {
    return weight * unitPrice * (1 + scrapRate);
  },

  // 가공비 합계
  processCostTotal(processes) {
    return processes.reduce((sum, p) => sum + (p.cost || 0), 0);
  },

  // 총원가 = 재료비 + 가공비 + 기타경비
  totalCost(materialCost, processCost, overhead = 0) {
    return materialCost + processCost + overhead;
  },

  // 목표가 달성률
  achievementRate(actualCost, targetCost) {
    if (!targetCost) return null;
    return ((targetCost - actualCost) / targetCost) * 100;
  },

  // LME 환율 적용 단가
  lmeAdjustedPrice(basePrice, lmeIndex, baseIndex) {
    if (!baseIndex) return basePrice;
    return basePrice * (lmeIndex / baseIndex);
  },
};
