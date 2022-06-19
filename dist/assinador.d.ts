import { QuoteType, QuoteTypeInfo } from './ploomes.js';
export declare function getQuoteHash(quote: QuoteType): Promise<QuoteTypeInfo>;
export declare function uploadHash(quote: QuoteType): Promise<QuoteTypeInfo | number[]>;
export declare function createDocument(quote: QuoteType, clientName: string, proposeId: number): Promise<false | undefined>;
