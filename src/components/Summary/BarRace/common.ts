type SeriesData = number[];
export type RawData = (readonly [string, ...SeriesData])[];
type DataCategory = string[];
export type BarRaceDataSource = [DataCategory, ...RawData];
