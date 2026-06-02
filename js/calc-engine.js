const CalcEngine = {
  // 재료비 = (중량 ÷ 수율) × LME시세 × 환율 × (1 + 할증률)
  // weight: g, yieldRate: 0~1, lmePrice: $/ton, exchangeRate: KRW/USD, surchargeRate: 0~1
  // 결과: 원(KRW) 정수
  calcMaterialCost(weight, yieldRate, lmePrice, exchangeRate, surchargeRate) {
    if (!yieldRate || yieldRate <= 0) return 0;
    const weightTon = weight / 1_000_000; // g → ton
    const usd = (weightTon / yieldRate) * lmePrice;
    const krw = usd * exchangeRate;
    return Math.round(krw * (1 + surchargeRate));
  },

  // 가공비 = 단위당 가공비 × 수량 + 세팅비
  calcProcessCost(processCostPerUnit, quantity, setupCost = 0) {
    return Math.round(processCostPerUnit * quantity + setupCost);
  },

  // 간접비 = 직접비 × 간접비율 (indirectRate: 0~1)
  calcIndirectCost(directCost, indirectRate) {
    return Math.round(directCost * indirectRate);
  },

  // 물류비: 중량(g) × 거리(km) 기반 (50원/ton·km)
  calcLogisticsCost(weight, distanceKm) {
    const weightTon = weight / 1_000_000; // g → ton
    return Math.round(weightTon * distanceKm * 50);
  },

  // 산출단가 = 재료비 + 가공비 + 간접비 + 물류비
  calcTotalCost(materialCost, processCost, indirectCost, logisticsCost) {
    return Math.round(materialCost + processCost + indirectCost + logisticsCost);
  },

  // Gap = 산출단가 - 목표단가 (양수: 초과, 음수: 여유)
  calcGap(targetPrice, actualPrice) {
    return Math.round(actualPrice - targetPrice);
  },

  // Gap률 = Gap ÷ 목표단가 × 100 (소수점 1자리, %)
  calcGapRate(targetPrice, actualPrice) {
    if (!targetPrice) return 0;
    return Math.round(((actualPrice - targetPrice) / targetPrice) * 1000) / 10;
  },

  // 달성률 = (목표단가 합계 ÷ 산출단가 합계) × 100 (소수점 1자리, %)
  calcAchievementRate(targets, actuals) {
    const totalTarget = targets.reduce((s, v) => s + (v || 0), 0);
    const totalActual = actuals.reduce((s, v) => s + (v || 0), 0);
    if (!totalActual) return 0;
    return Math.round((totalTarget / totalActual) * 1000) / 10;
  },

  // 천단위 콤마
  formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '-';
    return Math.round(num).toLocaleString('ko-KR');
  },

  // 통화 포맷 — 정책상 원화기호 미사용, 숫자만 출력
  formatCurrency(num) {
    if (num === null || num === undefined || isNaN(num)) return '-';
    return Math.round(num).toLocaleString('ko-KR');
  }
};
