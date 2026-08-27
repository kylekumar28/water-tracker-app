import {
  deleteObjects,
  isHealthDataAvailable,
  requestAuthorization,
  saveQuantitySample,
} from '@kingstinct/react-native-healthkit';

const WATER_TYPE = 'HKQuantityTypeIdentifierDietaryWater' as const;
const CAFFEINE_TYPE = 'HKQuantityTypeIdentifierDietaryCaffeine' as const;

export type HealthKitDrinkSamples = {
  waterSampleId?: string;
  caffeineSampleId?: string;
};

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

  const sample = await saveQuantitySample(WATER_TYPE, 'mL', amountMl, now, now);

  return sample?.uuid;
}

export async function saveCaffeineToHealthKit(caffeineMg: number) {
  const now = new Date();

  const sample = await saveQuantitySample(
    CAFFEINE_TYPE,
    'mg',
    caffeineMg,
    now,
    now,
  );

  return sample?.uuid;
}

export async function saveDrinkToHealthKit(
  amountMl: number,
  caffeineMg = 0,
): Promise<HealthKitDrinkSamples> {
  await requestHealthKitPermissions();

  const waterSampleId = await saveWaterToHealthKit(amountMl);

  let caffeineSampleId: string | undefined;

  if (caffeineMg > 0) {
    caffeineSampleId = await saveCaffeineToHealthKit(caffeineMg);
  }

  return {
    waterSampleId,
    caffeineSampleId,
  };
}

export async function deleteDrinkFromHealthKit(
  waterSampleId?: string,
  caffeineSampleId?: string,
) {
  await requestHealthKitPermissions();

  if (waterSampleId) {
    await deleteObjects(WATER_TYPE, {
      uuid: waterSampleId,
    });
  }

  if (caffeineSampleId) {
    await deleteObjects(CAFFEINE_TYPE, {
      uuid: caffeineSampleId,
    });
  }
}
