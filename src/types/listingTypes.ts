export interface ListingType {
  id: number;
  name: string;
  // lang:string
}

export interface ListingTypeTranslationInput {
  language_code: string;
  name: string;
}

export interface AddListingTypeRequestBody {
  translations: ListingTypeTranslationInput[];
}

// export interface GetListingTypesQuery {
//   lang?: string;
// }