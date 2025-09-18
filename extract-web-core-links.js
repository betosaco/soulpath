const fs = require('fs');
const path = require('path');

class WebCoreLinksExtractor {
    constructor() {
        this.baseUrl = 'https://testdevelopers.izipay.pe/web-core/';
        this.baseDomain = 'https://testdevelopers.izipay.pe';
        this.visitedUrls = new Set();
        this.webCoreLinks = new Set();
        this.allLinks = [];
    }

    async fetchPage(url) {
        try {
            console.log(`📄 Fetching: ${url}`);
            
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            return this.parseHTML(html, url);
        } catch (error) {
            console.error(`❌ Error fetching ${url}:`, error.message);
            return null;
        }
    }

    parseHTML(html, url) {
        // Extract all links from the page
        const linkMatches = html.match(/<a[^>]+href="([^"]+)"[^>]*>/gi) || [];
        const links = [];

        linkMatches.forEach(match => {
            const hrefMatch = match.match(/href="([^"]+)"/i);
            if (hrefMatch) {
                let href = hrefMatch[1];
                
                // Convert relative URLs to absolute
                if (href.startsWith('/')) {
                    href = this.baseDomain + href;
                } else if (href.startsWith('./')) {
                    href = this.baseDomain + href.substring(1);
                } else if (href.startsWith('../')) {
                    href = this.baseDomain + href.substring(2);
                }

                // Only include Izipay documentation links
                if (href.includes('testdevelopers.izipay.pe')) {
                    links.push({
                        url: href,
                        isWebCore: href.includes('/web-core/'),
                        isInternal: href.includes('testdevelopers.izipay.pe')
                    });
                }
            }
        });

        return {
            url,
            links: [...new Set(links)], // Remove duplicates
            timestamp: new Date().toISOString()
        };
    }

    async extractAllWebCoreLinks() {
        console.log('🔍 Starting web-core links extraction...');
        
        // Start with the main web-core page
        const mainPage = await this.fetchPage(this.baseUrl);
        if (mainPage) {
            this.visitedUrls.add(this.baseUrl);
            this.allLinks.push(...mainPage.links);
            
            // Filter web-core links
            mainPage.links.forEach(link => {
                if (link.isWebCore) {
                    this.webCoreLinks.add(link.url);
                }
            });
        }

        // Try to find additional web-core pages by exploring common patterns
        const commonWebCorePages = [
            'introduction',
            'quick-start',
            'architecture-diagram',
            'integration-modes',
            'use-cases',
            'checkout-customization',
            'notification-service',
            'response-codes-messages',
            'faq',
            'changelog',
            'getting-started',
            'smartform',
            'embedded-form',
            'popin-mode',
            'list-mode',
            'themes',
            'customization',
            'api-reference',
            'examples',
            'troubleshooting'
        ];

        for (const page of commonWebCorePages) {
            const url = `${this.baseUrl}${page}`;
            if (!this.visitedUrls.has(url)) {
                const content = await this.fetchPage(url);
                if (content) {
                    this.visitedUrls.add(url);
                    this.allLinks.push(...content.links);
                    
                    // Filter web-core links
                    content.links.forEach(link => {
                        if (link.isWebCore) {
                            this.webCoreLinks.add(link.url);
                        }
                    });
                }
                // Add delay between requests
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        // Also try to find web-core links from other pages
        const otherPages = [
            'https://testdevelopers.izipay.pe/',
            'https://testdevelopers.izipay.pe/getting-started/',
            'https://testdevelopers.izipay.pe/products/pay-with-card/',
            'https://testdevelopers.izipay.pe/api/'
        ];

        for (const url of otherPages) {
            if (!this.visitedUrls.has(url)) {
                const content = await this.fetchPage(url);
                if (content) {
                    this.visitedUrls.add(url);
                    this.allLinks.push(...content.links);
                    
                    // Filter web-core links
                    content.links.forEach(link => {
                        if (link.isWebCore) {
                            this.webCoreLinks.add(link.url);
                        }
                    });
                }
                // Add delay between requests
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        console.log(`✅ Extraction completed. Found ${this.webCoreLinks.size} web-core links.`);
    }

    generateLinksReport() {
        console.log('📝 Generating links report...');
        
        let report = `IZIPAY WEB-CORE LINKS EXTRACTION REPORT
Generated on: ${new Date().toISOString()}
Total web-core links found: ${this.webCoreLinks.size}
Total pages visited: ${this.visitedUrls.size}

${'='.repeat(80)}

WEB-CORE LINKS:
${'='.repeat(40)}
`;

        // Sort web-core links alphabetically
        const sortedWebCoreLinks = Array.from(this.webCoreLinks).sort();
        
        sortedWebCoreLinks.forEach((link, index) => {
            report += `${index + 1}. ${link}\n`;
        });

        report += `\n${'='.repeat(80)}\n`;
        report += `DETAILED LINK ANALYSIS:\n`;
        report += `${'='.repeat(40)}\n\n`;

        // Categorize links
        const categories = {
            'Introduction & Getting Started': [],
            'Integration Guides': [],
            'API Reference': [],
            'Examples & Code': [],
            'Configuration': [],
            'Troubleshooting': [],
            'Other': []
        };

        sortedWebCoreLinks.forEach(link => {
            const path = link.replace('https://testdevelopers.izipay.pe/web-core/', '');
            
            if (path.includes('introduction') || path.includes('getting-started') || path.includes('quick-start')) {
                categories['Introduction & Getting Started'].push(link);
            } else if (path.includes('integration') || path.includes('modes') || path.includes('architecture')) {
                categories['Integration Guides'].push(link);
            } else if (path.includes('api') || path.includes('reference') || path.includes('response-codes')) {
                categories['API Reference'].push(link);
            } else if (path.includes('example') || path.includes('code') || path.includes('demo')) {
                categories['Examples & Code'].push(link);
            } else if (path.includes('config') || path.includes('customization') || path.includes('themes')) {
                categories['Configuration'].push(link);
            } else if (path.includes('faq') || path.includes('troubleshooting') || path.includes('changelog')) {
                categories['Troubleshooting'].push(link);
            } else {
                categories['Other'].push(link);
            }
        });

        // Add categorized links
        Object.entries(categories).forEach(([category, links]) => {
            if (links.length > 0) {
                report += `${category}:\n`;
                report += `${'-'.repeat(category.length + 1)}\n`;
                links.forEach((link, index) => {
                    report += `  ${index + 1}. ${link}\n`;
                });
                report += `\n`;
            }
        });

        // Add all links found (for reference)
        report += `\n${'='.repeat(80)}\n`;
        report += `ALL LINKS FOUND (${this.allLinks.length} total):\n`;
        report += `${'='.repeat(40)}\n`;

        const webCoreLinks = this.allLinks.filter(link => link.isWebCore);
        const otherLinks = this.allLinks.filter(link => !link.isWebCore);

        report += `\nWEB-CORE LINKS (${webCoreLinks.length}):\n`;
        report += `${'-'.repeat(30)}\n`;
        webCoreLinks.forEach((link, index) => {
            report += `${index + 1}. ${link.url}\n`;
        });

        report += `\nOTHER IZIPAY LINKS (${otherLinks.length}):\n`;
        report += `${'-'.repeat(30)}\n`;
        otherLinks.forEach((link, index) => {
            report += `${index + 1}. ${link.url}\n`;
        });

        // Add summary
        report += `\n${'='.repeat(80)}\n`;
        report += `EXTRACTION SUMMARY\n`;
        report += `${'='.repeat(40)}\n`;
        report += `Total pages visited: ${this.visitedUrls.size}\n`;
        report += `Total links found: ${this.allLinks.length}\n`;
        report += `Web-core links: ${this.webCoreLinks.size}\n`;
        report += `Other Izipay links: ${this.allLinks.length - this.webCoreLinks.size}\n`;
        report += `Extraction completed: ${new Date().toISOString()}\n`;
        report += `${'='.repeat(80)}\n`;

        return report;
    }

    async saveToFile(filename = 'izipay-web-core-links.txt') {
        const report = this.generateLinksReport();
        const filePath = path.join(__dirname, filename);
        
        fs.writeFileSync(filePath, report, 'utf8');
        console.log(`💾 Links report saved to: ${filePath}`);
        console.log(`📊 File size: ${(report.length / 1024).toFixed(2)} KB`);
    }

    async run() {
        try {
            await this.extractAllWebCoreLinks();
            await this.saveToFile();
            console.log('🎉 Web-core links extraction completed successfully!');
        } catch (error) {
            console.error('❌ Error during extraction:', error);
        }
    }
}

// Run the extractor
if (require.main === module) {
    const extractor = new WebCoreLinksExtractor();
    extractor.run().catch(console.error);
}

module.exports = WebCoreLinksExtractor;
