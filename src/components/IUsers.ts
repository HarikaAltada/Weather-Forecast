export interface IUser {
  total_count: number;
  results?: ResultsEntity[] | null;
}
export interface ResultsEntity {
  country: string;
  geoname_id: string;
  name: string;
  ascii_name: string;
  alternate_names?: string[] | null;
  feature_class: string;
  feature_code: string;
  country_code: string;
  cou_name_en: string;
  country_code_2?: null;
  admin1_code: string;
  admin2_code?: string | null;
  admin3_code?: string | null;
  admin4_code?: null;
  population: number;
  elevation?: null;
  dem: number;
  timezone: string;
  modification_date: string;
  label_en: string;
  coordinates: Coordinates;
}
export interface Coordinates {
  lon: number;
  lat: number;
}
