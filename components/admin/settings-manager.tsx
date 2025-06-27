'use client'

import { Editor } from 'primereact/editor'
import { useCallback, useState } from 'react'

import { useGetSettingsQuery } from '@/api/setting/get-settings'
import { SettingKey, SettingsResponseDto } from '@/api/setting/types'
import { useUpdateSettingMutation } from '@/api/setting/update-setting'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NumberInput } from '@/components/ui/number-input'
import { Textarea } from '@/components/ui/textarea'

const headerTemplate = (
  <span className="ql-formats">
    <button className="ql-bold" aria-label="Bold"></button>
    <button className="ql-italic" aria-label="Italic"></button>
    <button className="ql-underline" aria-label="Underline"></button>
    <button className="ql-strike" aria-label="Strike"></button>
    <select className="ql-size" aria-label="Size"></select>
    <select className="ql-header" aria-label="Header">
      <option value="1">Heading 1</option>
      <option value="2">Heading 2</option>
      <option value="3">Heading 3</option>
      <option selected value="0">
        Normal
      </option>
    </select>
    <button
      className="ql-list"
      value="ordered"
      aria-label="Ordered List"
    ></button>
    <button
      className="ql-list"
      value="bullet"
      aria-label="Bullet List"
    ></button>
    <select className="ql-align" aria-label="Align">
      <option selected></option>
      <option value="center"></option>
      <option value="right"></option>
      <option value="justify"></option>
    </select>
    <button className="ql-link" aria-label="Link"></button>
    <button className="ql-clean" aria-label="Clean"></button>
  </span>
)

export function SettingsManager() {
  const { data: settings } = useGetSettingsQuery()
  const { mutateAsync: updateSetting } = useUpdateSettingMutation()
  const [editingSettings, setEditingSettings] = useState<
    Partial<SettingsResponseDto>
  >({
    [SettingKey.Genres]: settings?.[SettingKey.Genres] ?? [],
  })
  const [genreInputValue, setGenreInputValue] = useState('')

  const handleSettingChange = (
    key: SettingKey,
    value: SettingsResponseDto[typeof key],
  ) => {
    setEditingSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSetting = async (key: SettingKey) => {
    const newValue = editingSettings[key]

    if (newValue === undefined) {
      return
    }

    await updateSetting({
      key,
      value: newValue,
    })
  }

  const checkIsSettingChanged = useCallback(
    (key: SettingKey) => {
      const typeOfSetting = typeof settings?.[key]

      if (typeOfSetting === 'object') {
        return (
          JSON.stringify(editingSettings[key]) !==
          JSON.stringify(settings?.[key])
        )
      }

      return (
        editingSettings[key] !== settings?.[key] &&
        editingSettings[key] !== undefined
      )
    },
    [editingSettings, settings],
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-power-pump-heading mb-6">
        Settings
      </h1>
      <div className="space-y-6">
        {/* Platform Fee */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Platform Fee (%)</label>
          <div className="flex gap-2">
            <NumberInput
              className="max-w-[200px]"
              initialValue={
                editingSettings[SettingKey.PlatformFee] ??
                settings?.[SettingKey.PlatformFee] ??
                0
              }
              onChange={(value) =>
                handleSettingChange(SettingKey.PlatformFee, value)
              }
              min={0}
              max={100}
              allowDecimal={true}
              maxDecimals={2}
            />
            <Button
              onClick={() => handleSaveSetting(SettingKey.PlatformFee)}
              disabled={!checkIsSettingChanged(SettingKey.PlatformFee)}
            >
              Save
            </Button>
          </div>
        </div>

        {/* Reduced Platform Fee */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Reduced Platform Fee (%)
          </label>
          <div className="flex gap-2">
            <NumberInput
              className="max-w-[200px]"
              initialValue={
                editingSettings[SettingKey.ReducedPlatformFee] ??
                settings?.[SettingKey.ReducedPlatformFee] ??
                0
              }
              onChange={(value) =>
                handleSettingChange(SettingKey.ReducedPlatformFee, value)
              }
              min={0}
              max={100}
              allowDecimal={true}
              maxDecimals={2}
            />
            <Button
              onClick={() => handleSaveSetting(SettingKey.ReducedPlatformFee)}
              disabled={!checkIsSettingChanged(SettingKey.ReducedPlatformFee)}
            >
              Save
            </Button>
          </div>
        </div>

        {/* Genres */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Genres</label>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {(
                editingSettings[SettingKey.Genres] ??
                settings?.[SettingKey.Genres] ??
                []
              ).map((genre, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md"
                >
                  <span>{genre}</span>
                  <button
                    onClick={() => {
                      const currentGenres =
                        editingSettings[SettingKey.Genres] ?? []
                      handleSettingChange(
                        SettingKey.Genres,
                        currentGenres.filter((_, i) => i !== index),
                      )
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                {genreInputValue.trim() && (
                  <p className="text-sm text-muted-foreground absolute top-[50%] -translate-y-1/2 right-2">
                    Press <span className="font-bold">Enter</span> to add
                  </p>
                )}
                <Input
                  className="flex-1"
                  placeholder="Add new genre..."
                  value={genreInputValue}
                  onChange={(e) => setGenreInputValue(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      e.preventDefault()
                      const currentGenres =
                        editingSettings[SettingKey.Genres] ??
                        settings?.[SettingKey.Genres] ??
                        []
                      const newGenre = e.currentTarget.value.trim()
                      if (!currentGenres.includes(newGenre)) {
                        handleSettingChange(SettingKey.Genres, [
                          ...currentGenres,
                          newGenre,
                        ])
                        setGenreInputValue('')
                      }
                    }
                  }}
                />
              </div>
              <Button
                onClick={() => handleSaveSetting(SettingKey.Genres)}
                disabled={!checkIsSettingChanged(SettingKey.Genres)}
              >
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Terms of Service */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Terms of Service</label>
          <div className="flex flex-col gap-2">
            <Editor
              value={
                editingSettings[SettingKey.TermsOfService] ??
                settings?.[SettingKey.TermsOfService] ??
                ''
              }
              onTextChange={(e) => {
                if (!e.htmlValue) {
                  return
                }

                handleSettingChange(SettingKey.TermsOfService, e.htmlValue)
              }}
              style={{
                width: '100%',
                height: '200px',
              }}
              headerTemplate={headerTemplate}
            />
            <Button
              onClick={() => handleSaveSetting(SettingKey.TermsOfService)}
              disabled={!checkIsSettingChanged(SettingKey.TermsOfService)}
            >
              Save
            </Button>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Privacy Policy</label>
          <div className="flex flex-col gap-2">
            <Editor
              value={
                editingSettings[SettingKey.PrivacyPolicy] ??
                settings?.[SettingKey.PrivacyPolicy] ??
                ''
              }
              onTextChange={(e) => {
                if (!e.htmlValue) {
                  return
                }

                handleSettingChange(SettingKey.PrivacyPolicy, e.htmlValue)
              }}
              style={{
                width: '100%',
                height: '200px',
              }}
              headerTemplate={headerTemplate}
            />
            <Button
              onClick={() => handleSaveSetting(SettingKey.PrivacyPolicy)}
              disabled={!checkIsSettingChanged(SettingKey.PrivacyPolicy)}
            >
              Save
            </Button>
          </div>
        </div>

        {/* Sign In Message */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sign In Message</label>
          <div className="flex flex-col gap-2">
            <Textarea
              value={
                editingSettings[SettingKey.SignInMessage] ??
                settings?.[SettingKey.SignInMessage] ??
                ''
              }
              onChange={(e) =>
                handleSettingChange(SettingKey.SignInMessage, e.target.value)
              }
            />
            <Button
              onClick={() => handleSaveSetting(SettingKey.SignInMessage)}
              disabled={!checkIsSettingChanged(SettingKey.SignInMessage)}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
