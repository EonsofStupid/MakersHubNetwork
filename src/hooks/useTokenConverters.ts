
// Update ThemeToken usage
interface ExtendedThemeToken {
  token_name: string;
  token_value: string;
  name?: string;
  value?: string;
  type?: string;
}

// Update functions to handle both formats
// For example:
const getTokenValue = (token: ExtendedThemeToken) => {
  return token.value || token.token_value;
};

const getTokenType = (token: ExtendedThemeToken) => {
  return token.type || 'color'; // Default to color if not specified
};
