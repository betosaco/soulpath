import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateExistingPackagesTo30Days() {
  try {
    console.log('🔄 Updating existing packages to 30-day validity...');

    // Find all user packages that have expiration dates more than 30 days in the future
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    
    const packagesToUpdate = await prisma.userPackage.findMany({
      where: {
        expiresAt: {
          gt: futureDate
        }
      },
      include: {
        packagePrice: {
          include: {
            packageDefinition: true
          }
        }
      }
    });

    console.log(`📦 Found ${packagesToUpdate.length} packages with validity longer than 30 days`);

    let updatedCount = 0;
    for (const pkg of packagesToUpdate) {
      // Set expiration to 30 days from purchase date or current date, whichever is later
      const purchaseDate = pkg.createdAt;
      const thirtyDaysFromPurchase = new Date(purchaseDate);
      thirtyDaysFromPurchase.setDate(thirtyDaysFromPurchase.getDate() + 30);
      
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      // Use the later date to ensure packages don't expire immediately
      const newExpirationDate = thirtyDaysFromPurchase > thirtyDaysFromNow ? thirtyDaysFromPurchase : thirtyDaysFromNow;

      await prisma.userPackage.update({
        where: { id: pkg.id },
        data: {
          expiresAt: newExpirationDate
        }
      });

      console.log(`✅ Updated package ${pkg.packagePrice.packageDefinition.name} (ID: ${pkg.id}) to expire on ${newExpirationDate.toLocaleDateString()}`);
      updatedCount++;
    }

    console.log('🎉 Package validity update completed!');
    console.log(`📋 Summary: Updated ${updatedCount} packages to 30-day validity`);

  } catch (error) {
    console.error('❌ Error updating package validity:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateExistingPackagesTo30Days();
