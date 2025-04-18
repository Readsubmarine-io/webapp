export enum SettingKey {
  AuthorFee = 'AuthorFee',
  PlatformFee = 'PlatformFee',
  Genres = 'Genres',
}

export class SettingsResponseDto {
  [SettingKey.AuthorFee]?: number;
  [SettingKey.PlatformFee]?: number;
  [SettingKey.Genres]?: string[]
}
