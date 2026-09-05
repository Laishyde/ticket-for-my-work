// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = string;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING: IconMapping = {
  "house.fill": "home",
  house: "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "chevron.down": "expand-more",
  "chevron.up": "expand-less",
  "battery.full": "battery-full",
  "battery.charging": "battery-charging-full",
  wifi: "wifi",
  signal: "signal-cellular-4-bar",
  cart: "shopping-cart",
  "star.fill": "star",
  star: "star-border",
  magnifyingglass: "search",
  tag: "local-offer",
  "ticket.fill": "confirmation-number",
  ticket: "confirmation-number",
  "person.fill": "person",
  "person.circle": "account-circle",
  "antenna.radiowaves.left.and.right": "radar",
  sparkles: "auto-awesome",
  calendar: "event",
  mappin: "location-on",
  "slider.horizontal.3": "tune",
  "music.note": "music-note",
  theatermasks: "theater-comedy",
  "face.smiling": "sentiment-very-satisfied",
  sportscourt: "sports-basketball",
  cpu: "memory",
  "arrow.right.arrow.left": "swap-horiz",
  bell: "notifications",
  "bell.fill": "notifications-active",
  creditcard: "credit-card",
  lock: "lock",
  "lock.fill": "lock",
  "questionmark.circle": "help-outline",
  "questionmark.circle.fill": "help",
  "arrow.right.square": "logout",
  "arrow.right.square.fill": "logout",
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
