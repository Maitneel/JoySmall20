export function convertKeycode(keycode: string, isMouse: boolean = false): string {
  const keyMacroMap: Record<string, string> = {
    "ESC": "KEY_ESC",
    "F1": "KEY_F1", "F2": "KEY_F2", "F3": "KEY_F3", "F4": "KEY_F4", "F5": "KEY_F5",
    "F6": "KEY_F6", "F7": "KEY_F7", "F8": "KEY_F8", "F9": "KEY_F9", "F10": "KEY_F10",
    "F11": "KEY_F11", "F12": "KEY_F12",
    "PRTSC": "KEY_PRINT_SCREEN", "SCRLK": "KEY_SCROLL_LOCK", "PAUSE": "KEY_PAUSE",
    "`": "'`'", "1": "'1'", "2": "'2'", "3": "'3'", "4": "'4'", "5": "'5'", "6": "'6'", "7": "'7'", "8": "'8'", "9": "'9'", "0": "'0'",
    "-": "'-'", "=": "'='", "BS": "KEY_BACKSPACE",
    "TAB": "KEY_TAB", "Q": "'q'", "W": "'w'", "E": "'e'", "R": "'r'", "T": "'t'", "Y": "'y'", "U": "'u'", "I": "'i'", "O": "'o'", "P": "'p'", "[": "'['", "]": "]'", "\\": "'\\'",
    "CAPS": "KEY_CAPS_LOCK", "A": "'a'", "S": "'s'", "D": "'d'", "F": "'f'", "G": "'g'", "H": "'h'", "J": "'j'", "K": "'k'", "L": "'l'", ";": "';'", "'": "'\''", "ENT": "KEY_RETURN",
    "L_SHIFT": "KEY_LEFT_SHIFT", "Z": "'z'", "X": "'x'", "C": "'c'", "V": "'v'", "B": "'b'", "N": "'n'", "M": "'m'", ",": "','", ".": "'.'", "/": "'/'", "R_SHIFT": "KEY_RIGHT_SHIFT", "↑": "KEY_UP_ARROW",
    "L_CTRL": "KEY_LEFT_CTRL", "L_GUI": "KEY_LEFT_GUI", "L_ALT": "KEY_LEFT_ALT", "SPACE": "' '", "R_ALT": "KEY_RIGHT_ALT", "R_GUI": "KEY_RIGHT_GUI", "MENU": "KEY_MENU", "R_CTRL": "KEY_RIGHT_CTRL", "←": "KEY_LEFT_ARROW", "↓": "KEY_DOWN_ARROW", "→": "KEY_RIGHT_ARROW",
    // Numpad
    "NUMLC": "KEY_NUM_LOCK", "KP_/": "KEY_KP_SLASH", "KP_*": "KEY_KP_ASTERISK", "KP_-": "KEY_KP_MINUS",
    "KP_7": "KEY_KP_7", "KP_8": "KEY_KP_8", "KP_9": "KEY_KP_9", "KP_+": "KEY_KP_PLUS",
    "KP_4": "KEY_KP_4", "KP_5": "KEY_KP_5", "KP_6": "KEY_KP_6",
    "KP_1": "KEY_KP_1", "KP_2": "KEY_KP_2", "KP_3": "KEY_KP_3", "KP_ENT": "KEY_KP_ENTER",
    "KP_0": "KEY_KP_0", "KP_.": "KEY_KP_DOT",
    // undfeind key;
    "N/A": "UNDEFINED_KEY",
  };

  const mouseMacroMap: Record<string, string> = {
    "MO_L": "MOUSE_LEFT",
    "MO_MID": "MOUSE_MIDDLE",
    "MO_R": "MOUSE_RIGHT",
  }

  if (!isMouse && keyMacroMap[keycode]) {
    return keyMacroMap[keycode];
  }

  if (isMouse && mouseMacroMap[keycode]) {
    return mouseMacroMap[keycode];
  }

  // その他はそのまま
  return 'UNDEFINED_KEY';
}