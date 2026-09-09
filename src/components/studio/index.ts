/**
 * LOGIFORGE: Studio Component Foundation
 */

export interface StudioViewportConfig {
  device: 'desktop' | 'tablet' | 'mobile' | 'fluid';
  width: string;
  height: string;
  presentationMode: boolean;
  activeTrackingNumber: string;
}
