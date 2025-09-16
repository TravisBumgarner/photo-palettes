import * as amplitude from '@amplitude/analytics-browser'
import { Capacitor } from '@capacitor/core'
import config from '../config'
import type { Details } from '../pages/Palette/Palette.types'

type CreateButtonClickedEvent = {
  event: 'create_button_clicked'
  properties: {
    mode: 'lite' | 'full'
  }
}

type CreatePhotoSelectedEvent = {
  event: 'create_photo_selected'
  properties: {
    mode: 'lite' | 'full'
  }
}

type CreatePhotoLoadedEvent = {
  event: 'create_photo_loaded'
  properties: {
    mode: 'lite' | 'full'
  }
}

type AnonModelDownloadEvent = {
  event: 'anon_model_download'
}

type AnonModelSignUpEvent = {
  event: 'anon_model_sign_up'
}

type UserSignUpEvent = {
  event: 'user_sign_up'
  properties: {
    method: 'email'
  }
}

type UserLogInEvent = {
  event: 'user_log_in'
}

type CreatePaletteSaveEvent = {
  event: 'create_palette_save'
  properties: {
    lite_mode_conversion: boolean
    mode: 'lite' | 'full'
  }
}

type UserFavoriteButtonEvent = {
  event: 'user_favorite_button'
}

type UserUnfavoriteButtonEvent = {
  event: 'user_unfavorite_button'
}

type BrowseFilterButtonEvent = {
  event: 'browse_filter_button'
  properties: {
    browse_filter: 'newest' | 'oldest' | 'favorites_count'
    page: 'browse' | 'favorites'
  }
}

type BrowseNavigationEvent = {
  event: 'browse_navigation'
  properties: {
    browse_filter: 'newest' | 'oldest' | 'favorites_count'
    page: 'browse' | 'favorites' | 'profile'
    page_number: number
  }
}

type PaletteFilterButtonEvent = {
  event: 'palette_filter_button'
  properties: {
    background?: string // hex value
    color_mix?: 'none' | 'complementary' | string
    details?: 'none' | 'hex' | string
  }
}

type CreatePaletteCreatedEvent = {
  event: 'create_palette_created'
  properties: {
    mode: 'lite' | 'full'
  }
}

type CopyColorDetailEvent = {
  event: 'copy_color_detail'
  properties: {
    detail: Details
    step: number
    is_swatch: boolean
  }
}

type Event =
  | CreateButtonClickedEvent
  | CreatePhotoSelectedEvent
  | CreatePhotoLoadedEvent
  | AnonModelDownloadEvent
  | AnonModelSignUpEvent
  | UserSignUpEvent
  | UserLogInEvent
  | CreatePaletteSaveEvent
  | UserFavoriteButtonEvent
  | UserUnfavoriteButtonEvent
  | BrowseFilterButtonEvent
  | PaletteFilterButtonEvent
  | CreatePaletteCreatedEvent
  | BrowseNavigationEvent
  | CopyColorDetailEvent

export const trackEvent = (event: Event) => {
  const properties = {
    platform: Capacitor.getPlatform(),
    ...('properties' in event ? event.properties : {}),
  }

  if (config.isProduction) {
    amplitude.track(event.event, properties)
    return
  }
  // eslint-disable-next-line no-console
  console.log('Analytics event:', event.event, properties)
}
