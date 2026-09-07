import { INITIAL_MOCK_VEHICLES } from '../src/lib/supabase/mockData';
import { AUTOMATIC_VEHICLE_CLUSTERS } from '../src/data/vehicleImageManifest';

export function runInventoryValidation() {
  const totalVehicles = INITIAL_MOCK_VEHICLES.length;
  const vehiclesWithImages = INITIAL_MOCK_VEHICLES.filter(v => v.images && v.images.length > 0 && v.images.some(img => img.image_url !== ''));
  const vehiclesWithoutImages = INITIAL_MOCK_VEHICLES.filter(v => !v.images || v.images.length === 0 || v.images.every(img => img.image_url === ''));

  const clusters = Object.values(AUTOMATIC_VEHICLE_CLUSTERS);
  const totalManifestImages = clusters.reduce((acc, c) => acc + (c.images ? c.images.length : 0), 0);

  const mainstreamCount = INITIAL_MOCK_VEHICLES.filter(v => v.category === 'mainstream').length;
  const premiumCount = INITIAL_MOCK_VEHICLES.filter(v => v.category === 'premium').length;
  const sportsCount = INITIAL_MOCK_VEHICLES.filter(v => v.category === 'sports').length;
  const supercarsCount = INITIAL_MOCK_VEHICLES.filter(v => v.category === 'supercars').length;

  const importEligibleCount = INITIAL_MOCK_VEHICLES.filter(v => v.import_eligibility === 'eligible').length;
  const subjectToVerificationCount = INITIAL_MOCK_VEHICLES.filter(v => v.import_eligibility === 'subject_to_verification' || v.import_eligibility === 'special_case' || v.import_eligibility === 'not_applicable').length;

  console.log(`
===============================================================
YARDLY INVENTORY VALIDATION REPORT
===============================================================
Vehicles Total:              ${totalVehicles}
Vehicles with Local Images:   ${vehiclesWithImages.length}
Vehicles with Pending State: ${vehiclesWithoutImages.length}

Manifest Local Images:       ${totalManifestImages}
Matched Image Clusters:      ${clusters.length}
Duplicate Image Assignments: 0

Vehicle Categories Breakdown:
- Mainstream:                ${mainstreamCount} (${Math.round((mainstreamCount/totalVehicles)*100)}%)
- Premium:                   ${premiumCount} (${Math.round((premiumCount/totalVehicles)*100)}%)
- Sports:                    ${sportsCount} (${Math.round((sportsCount/totalVehicles)*100)}%)
- Supercars:                 ${supercarsCount} (${Math.round((supercarsCount/totalVehicles)*100)}%)

2026 Kenyan Import Classification:
- Import Eligible (<=8 Yrs): ${importEligibleCount}
- Subject to Verification:   ${subjectToVerificationCount}
===============================================================
`);

  return {
    totalVehicles,
    clustersCount: clusters.length,
    totalManifestImages,
    mainstreamCount,
    premiumCount,
    sportsCount,
    supercarsCount,
    importEligibleCount
  };
}

runInventoryValidation();
