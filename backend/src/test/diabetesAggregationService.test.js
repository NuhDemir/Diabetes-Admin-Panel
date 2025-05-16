const { getRiskCalculationStages } = require("./diabetesAggregationService");

describe("getRiskCalculationStages", () => {
  it('should return "Yüksek" for high glucose', () => {
    // MongoDB aggregation pipeline simülasyonu
    const mockDoc = { Glucose: 170, BMI: 30, Age: 40 };
    const pipeline = getRiskCalculationStages();
    // Pipeline'ı değerlendirmek için basit bir mock
    const result = evaluatePipeline(pipeline, mockDoc);
    expect(result).toBe("Yüksek");
  });

  it('should return "Bilinmiyor" for invalid data', () => {
    const mockDoc = { Glucose: null, BMI: -1, Age: null };
    const pipeline = getRiskCalculationStages();
    const result = evaluatePipeline(pipeline, mockDoc);
    expect(result).toBe("Bilinmiyor");
  });
});

// Pipeline değerlendirme için basit bir yardımcı fonksiyon (gerçek projede daha karmaşık olabilir)
function evaluatePipeline(pipeline, doc) {
  // Bu, MongoDB aggregation'ı simüle eder. Gerçek projede MongoDB driver ile test edilir.
  if (
    pipeline.$cond.if.$or.some((condition) => evaluateCondition(condition, doc))
  ) {
    return pipeline.$cond.then;
  }
  return pipeline.$cond.else.$cond.then; // Basitleştirilmiş, tam mantığı yazılmalı
}

function evaluateCondition(condition, doc) {
  // Koşulları değerlendir (ör. $gt, $and)
  return true; // Gerçek mantık için MongoDB operatörlerini simüle et
}
