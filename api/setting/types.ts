export enum SettingKey {
  PlatformFee = 'PlatformFee',
  Genres = 'Genres',
  PaymentAddress = 'PaymentAddress',
}

export class SettingsResponseDto {
  [SettingKey.PlatformFee]?: number;
  [SettingKey.Genres]?: string[];
  [SettingKey.PaymentAddress]?: string
}
