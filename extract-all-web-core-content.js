const fs = require('fs');
const path = require('path');

class AllWebCoreContentExtractor {
    constructor() {
        this.baseUrl = 'https://testdevelopers.izipay.pe/web-core/';
        this.baseDomain = 'https://testdevelopers.izipay.pe';
        this.visitedUrls = new Set();
        this.extractedContent = [];
        this.webCoreLinks = new Set();
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
        // Remove script and style elements
        let cleanHtml = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
            .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
            .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');

        // Extract title
        const titleMatch = cleanHtml.match(/<title[^>]*>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : 'Untitled';

        // Extract main content
        const mainContentMatch = cleanHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/i) || 
                               cleanHtml.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                               cleanHtml.match(/<div[^>]*id="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);

        let contentHtml = mainContentMatch ? mainContentMatch[1] : cleanHtml;

        // Extract text content
        let textContent = contentHtml
            .replace(/<[^>]+>/g, ' ') // Remove HTML tags
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n\n')
            .trim();

        // Extract code blocks
        const codeBlocks = [];
        const codeMatches = contentHtml.match(/<pre[^>]*>[\s\S]*?<\/pre>/gi) || 
                           contentHtml.match(/<code[^>]*>[\s\S]*?<\/code>/gi) || [];
        
        codeMatches.forEach(codeBlock => {
            const code = codeBlock
                .replace(/<[^>]+>/g, '') // Remove HTML tags
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .trim();
            
            if (code.length > 0) {
                codeBlocks.push(code);
            }
        });

        // Extract links for further crawling
        const linkMatches = contentHtml.match(/<a[^>]+href="([^"]+)"[^>]*>/gi) || [];
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
            title,
            text: textContent,
            codeBlocks,
            links: [...new Set(links)], // Remove duplicates
            timestamp: new Date().toISOString()
        };
    }

    async discoverAllWebCoreLinks() {
        console.log('🔍 Discovering all web-core links...');
        
        // Start with the main web-core page
        const mainPage = await this.fetchPage(this.baseUrl);
        if (mainPage) {
            this.visitedUrls.add(this.baseUrl);
            this.webCoreLinks.add(this.baseUrl);
            
            // Add web-core links from main page
            mainPage.links.forEach(link => {
                if (link.isWebCore) {
                    this.webCoreLinks.add(link.url);
                }
            });
        }

        // Try common web-core page patterns
        const commonPatterns = [
            'quickstart',
            'diagram',
            'modalidades/popup',
            'use-cases/pay',
            'custom-form/introduction',
            'notifications',
            'codes-and-responses',
            'faqs',
            'release-notes',
            'tags/web-core',
            'tags/developers',
            'tags/payments',
            'tags/javascript',
            'tags/sdk',
            'tags/easy-to-use',
            'tags/multipayments',
            'tags/cards',
            'tags/qr',
            'tags/applepay',
            'tags/yape',
            'tags/browsers',
            'tags/lightweight',
            'tags/features',
            'tags/independent-modules',
            'tags/zero-dependencies'
        ];

        for (const pattern of commonPatterns) {
            const url = `${this.baseUrl}${pattern}`;
            if (!this.visitedUrls.has(url)) {
                const content = await this.fetchPage(url);
                if (content) {
                    this.visitedUrls.add(url);
                    this.webCoreLinks.add(url);
                    
                    // Add web-core links from this page
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

        console.log(`✅ Discovered ${this.webCoreLinks.size} web-core links.`);
    }

    async extractAllWebCoreContent() {
        console.log('📚 Extracting content from all web-core links...');
        
        // First discover all web-core links
        await this.discoverAllWebCoreLinks();
        
        // Now extract content from each web-core link
        const webCoreLinksArray = Array.from(this.webCoreLinks);
        
        for (let i = 0; i < webCoreLinksArray.length; i++) {
            const url = webCoreLinksArray[i];
            
            if (!this.visitedUrls.has(url)) {
                console.log(`📖 Extracting content from ${i + 1}/${webCoreLinksArray.length}: ${url}`);
                
                const content = await this.fetchPage(url);
                if (content) {
                    this.visitedUrls.add(url);
                    this.extractedContent.push(content);
                }
                
                // Add delay between requests to be respectful
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log(`✅ Content extraction completed. Extracted from ${this.extractedContent.length} pages.`);
    }

    generateComprehensiveDocument() {
        console.log('📝 Generating comprehensive web-core document...');
        
        let document = `IZIPAY WEB-CORE COMPLETE DOCUMENTATION
Generated on: ${new Date().toISOString()}
Total web-core pages extracted: ${this.extractedContent.length}
Total web-core links discovered: ${this.webCoreLinks.size}

${'='.repeat(80)}

TABLE OF CONTENTS
${'='.repeat(40)}
`;
        
        // Add table of contents
        this.extractedContent.forEach((content, index) => {
            document += `${index + 1}. ${content.title} (${content.url})\n`;
        });

        document += `\n${'='.repeat(80)}\n\n`;

        // Add content from each page
        this.extractedContent.forEach((content, index) => {
            document += `\n${'='.repeat(80)}\n`;
            document += `PAGE ${index + 1}: ${content.title.toUpperCase()}\n`;
            document += `URL: ${content.url}\n`;
            document += `EXTRACTED: ${content.timestamp}\n`;
            document += `${'='.repeat(80)}\n\n`;
            
            if (content.text) {
                document += `CONTENT:\n${'-'.repeat(40)}\n`;
                document += content.text;
                document += `\n\n`;
            }

            if (content.codeBlocks && content.codeBlocks.length > 0) {
                document += `CODE BLOCKS:\n${'-'.repeat(40)}\n`;
                content.codeBlocks.forEach((code, codeIndex) => {
                    document += `Code Block ${codeIndex + 1}:\n`;
                    document += `${'─'.repeat(20)}\n`;
                    document += code;
                    document += `\n${'─'.repeat(20)}\n\n`;
                });
            }

            document += `\n${'='.repeat(80)}\n\n`;
        });

        // Add web-core links reference
        document += `\n${'='.repeat(80)}\n`;
        document += `ALL WEB-CORE LINKS DISCOVERED\n`;
        document += `${'='.repeat(40)}\n`;
        
        const sortedWebCoreLinks = Array.from(this.webCoreLinks).sort();
        sortedWebCoreLinks.forEach((link, index) => {
            document += `${index + 1}. ${link}\n`;
        });

        // Add summary
        document += `\n${'='.repeat(80)}\n`;
        document += `EXTRACTION SUMMARY\n`;
        document += `${'='.repeat(40)}\n`;
        document += `Total web-core links discovered: ${this.webCoreLinks.size}\n`;
        document += `Total pages successfully extracted: ${this.extractedContent.length}\n`;
        document += `Total code blocks: ${this.extractedContent.reduce((sum, content) => sum + (content.codeBlocks?.length || 0), 0)}\n`;
        document += `Total characters extracted: ${this.extractedContent.reduce((sum, content) => sum + (content.text?.length || 0), 0)}\n`;
        document += `Extraction completed: ${new Date().toISOString()}\n`;
        document += `${'='.repeat(80)}\n`;

        return document;
    }

    async saveToFile(filename = 'izipay-web-core-complete.txt') {
        const document = this.generateComprehensiveDocument();
        const filePath = path.join(__dirname, filename);
        
        fs.writeFileSync(filePath, document, 'utf8');
        console.log(`💾 Complete web-core documentation saved to: ${filePath}`);
        console.log(`📊 File size: ${(document.length / 1024).toFixed(2)} KB`);
    }

    async run() {
        try {
            await this.extractAllWebCoreContent();
            await this.saveToFile();
            console.log('🎉 Complete web-core documentation extraction completed successfully!');
        } catch (error) {
            console.error('❌ Error during extraction:', error);
        }
    }
}

// Run the extractor
if (require.main === module) {
    const extractor = new AllWebCoreContentExtractor();
    extractor.run().catch(console.error);
}

module.exports = AllWebCoreContentExtractor;
