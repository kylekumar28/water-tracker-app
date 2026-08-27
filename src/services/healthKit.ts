import {
  isHealthDataAvailable,
  requestAuthorization,
  saveQuantitySample,
} from '@kingstinct/react-native-healthkit';

const WATER_TYPE = 'HKQuantityTypeIdentifierDietaryWater' as const;
const CAFFEINE_TYPE = 'HKQuantityTypeIdentifierDietaryCaffeine' as const;

export async function requestHealthKitPermissions() {
  const available = await isHealthDataAvailable();

  if (!available) {
    throw new Error('HealthKit is not available on this device.');
  }

  await requestAuthorization({
    toShare: [WATER_TYPE, CAFFEINE_TYPE],
  });
}

export async function saveWaterToHealthKit(amountMl: number) {
  const now = new Date();

  return saveQuantitySample(WATER_TYPE, 'mL', amountMl, now, now);
}

export async function saveCaffeineToHealthKit(caffeineMg: number) {
  const now = new Date();

  return saveQuantitySample(CAFFEINE_TYPE, 'mg', caffeineMg, now, now);
}
