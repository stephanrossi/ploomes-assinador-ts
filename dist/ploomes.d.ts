export declare type QuoteType = number;
export declare type QuoteTypeInfo = string[] | boolean;
export declare function getPersonID(quote: QuoteType): Promise<any>;
export declare function getPersonData(quote: QuoteType): Promise<false | any[]>;
export declare function getQuoteDoc(quote: QuoteType): Promise<QuoteTypeInfo>;
