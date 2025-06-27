export enum SettingKey {
  PlatformFee = 'PlatformFee',
  ReducedPlatformFee = 'ReducedPlatformFee',
  Genres = 'Genres',
  PaymentAddress = 'PaymentAddress',
  TermsOfService = 'TermsOfService',
  PrivacyPolicy = 'PrivacyPolicy',
  SignInMessage = 'SignInMessage',
}

export class SettingsResponseDto {
  [SettingKey.PlatformFee]?: number;
  [SettingKey.ReducedPlatformFee]?: number;
  [SettingKey.Genres]?: string[];
  [SettingKey.PaymentAddress]?: string;
  [SettingKey.TermsOfService]?: string;
  [SettingKey.PrivacyPolicy]?: string;
  [SettingKey.SignInMessage]?: string
}
