import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Currency symbol mapping function (copied from the service)
function getCurrencySymbol(currencyCode) {
  const currencyMap = {
    'PEN': 'S/.',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'CAD': 'C$',
    'AUD': 'A$',
    'JPY': '¥',
    'CHF': 'CHF',
    'CNY': '¥',
    'MXN': '$',
    'BRL': 'R$',
    'ARS': '$',
    'CLP': '$',
    'COP': '$',
    'UYU': '$U',
    'BOB': 'Bs',
    'VES': 'Bs.S',
    'PYG': '₲',
    'DOP': 'RD$',
    'GTQ': 'Q',
    'HNL': 'L',
    'NIO': 'C$',
    'CRC': '₡',
    'PAB': 'B/.',
    'TTD': 'TT$',
    'JMD': 'J$',
    'BBD': 'Bds$',
    'BZD': 'BZ$',
    'XCD': 'EC$',
    'AWG': 'ƒ',
    'ANG': 'ƒ',
    'SRD': '$',
    'GYD': 'G$',
    'BMD': 'BD$',
    'KYD': 'CI$',
    'BHD': 'د.ب',
    'KWD': 'د.ك',
    'QAR': 'ر.ق',
    'SAR': 'ر.س',
    'AED': 'د.إ',
    'OMR': 'ر.ع.',
    'YER': '﷼',
    'JOD': 'د.ا',
    'LBP': 'ل.ل',
    'SYP': 'ل.س',
    'IQD': 'د.ع',
    'IRR': '﷼',
    'AFN': '؋',
    'PKR': '₨',
    'INR': '₹',
    'BDT': '৳',
    'LKR': '₨',
    'NPR': '₨',
    'BTN': 'Nu.',
    'MVR': 'ރ',
    'SCR': '₨',
    'MMK': 'K',
    'THB': '฿',
    'LAK': '₭',
    'KHR': '៛',
    'VND': '₫',
    'IDR': 'Rp',
    'MYR': 'RM',
    'SGD': 'S$',
    'BND': 'B$',
    'PHP': '₱',
    'TWD': 'NT$',
    'HKD': 'HK$',
    'MOP': 'MOP$',
    'KRW': '₩',
    'MNT': '₮',
    'KZT': '₸',
    'UZS': 'лв',
    'KGS': 'лв',
    'TJS': 'SM',
    'TMT': 'T',
    'AZN': '₼',
    'AMD': '֏',
    'GEL': '₾',
    'TRY': '₺',
    'RUB': '₽',
    'BYN': 'Br',
    'UAH': '₴',
    'MDL': 'L',
    'RON': 'lei',
    'BGN': 'лв',
    'HRK': 'kn',
    'RSD': 'дин',
    'MKD': 'ден',
    'ALL': 'L',
    'BAM': 'КМ',
    'CZK': 'Kč',
    'HUF': 'Ft',
    'PLN': 'zł',
    'SKK': 'Sk',
    'SIT': 'SIT',
    'EEK': 'kr',
    'LVL': 'Ls',
    'LTL': 'Lt',
    'ISK': 'kr',
    'DKK': 'kr',
    'NOK': 'kr',
    'SEK': 'kr',
    'FIM': 'mk',
    'IEP': '£',
    'ITL': 'L',
    'ESP': '₧',
    'PTE': '$',
    'FRF': '₣',
    'BEF': 'fr',
    'NLG': 'ƒ',
    'DEM': 'DM',
    'ATS': 'S',
    'CHF': 'CHF',
    'LIE': 'CHF',
    'MCO': '₣',
    'SMR': '₣',
    'VAT': '₣',
    'ADP': '₣',
    'GRD': '₯',
    'CYP': '£',
    'MTL': '₤',
    'LUF': 'fr',
    'BGL': 'лв',
    'ROL': 'lei',
    'SIT': 'SIT',
    'SKK': 'Sk',
    'EEK': 'kr',
    'LVL': 'Ls',
    'LTL': 'Lt',
    'ZAR': 'R',
    'NAD': 'N$',
    'BWP': 'P',
    'SZL': 'L',
    'LSL': 'L',
    'ZMW': 'ZK',
    'ZWL': 'Z$',
    'AOA': 'Kz',
    'MZN': 'MT',
    'MGA': 'Ar',
    'MUR': '₨',
    'SCR': '₨',
    'KES': 'KSh',
    'TZS': 'TSh',
    'UGX': 'USh',
    'RWF': 'RF',
    'BIF': 'FBu',
    'DJF': 'Fdj',
    'SOS': 'S',
    'ETB': 'Br',
    'ERN': 'Nfk',
    'SDG': 'ج.س',
    'SSP': '£',
    'EGP': '£',
    'LYD': 'ل.د',
    'TND': 'د.ت',
    'DZD': 'د.ج',
    'MAD': 'د.م.',
    'MRO': 'UM',
    'MRU': 'UM',
    'XOF': 'CFA',
    'XAF': 'FCFA',
    'KMF': 'CF',
    'DJF': 'Fdj',
    'SOS': 'S',
    'ETB': 'Br',
    'ERN': 'Nfk',
    'SDG': 'ج.س',
    'SSP': '£',
    'EGP': '£',
    'LYD': 'ل.د',
    'TND': 'د.ت',
    'DZD': 'د.ج',
    'MAD': 'د.م.',
    'MRO': 'UM',
    'MRU': 'UM',
    'XOF': 'CFA',
    'XAF': 'FCFA',
    'KMF': 'CF'
  };
  
  return currencyMap[currencyCode] || currencyCode;
}

async function testCurrencySymbolMapping() {
  try {
    console.log('🔍 Testing currency symbol mapping...\n');

    // Get the most recent order
    const latestOrder = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        currency: true,
        total: true
      }
    });

    if (!latestOrder) {
      console.log('❌ No orders found');
      return;
    }

    console.log('📦 Latest order:');
    console.log(`  ID: ${latestOrder.id}`);
    console.log(`  Currency Code: ${latestOrder.currency}`);
    console.log(`  Total: ${latestOrder.total}`);

    // Test currency symbol mapping
    const currencySymbol = getCurrencySymbol(latestOrder.currency);
    console.log(`\n💰 Currency Symbol Mapping:`);
    console.log(`  Code: ${latestOrder.currency}`);
    console.log(`  Symbol: ${currencySymbol}`);

    // Test price formatting with currency symbol
    const formattedPrice = `${currencySymbol} ${latestOrder.total.toFixed(2)}`;
    console.log(`  Formatted Price: ${formattedPrice}`);

    // Test different currency scenarios
    console.log('\n🌍 Currency Symbol Examples:');
    const testCurrencies = ['PEN', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'MXN', 'BRL'];
    
    for (const currency of testCurrencies) {
      const symbol = getCurrencySymbol(currency);
      const testPrice = 420.00;
      const formatted = `${symbol} ${testPrice.toFixed(2)}`;
      console.log(`  ${currency}: ${formatted}`);
    }

    console.log('\n🎯 Expected Result:');
    console.log('✅ PEN currency shows S/. symbol');
    console.log('✅ USD currency shows $ symbol');
    console.log('✅ EUR currency shows € symbol');
    console.log('✅ All prices formatted with proper currency symbols');

  } catch (error) {
    console.error('❌ Error testing currency symbol mapping:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCurrencySymbolMapping();
