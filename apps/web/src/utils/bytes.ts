const BASE_2 = 1024;
const BASE_10 = 1000;

type NumericBase = typeof BASE_2 | typeof BASE_10;

export interface FormatBytesOptions {
  decimals?: number;
  base?: NumericBase;
  spacer?: string;
}

interface FormatResult {
  value: number;
  unit: string;
}

const UNITS = ["B", "KB", "MB", "GB", "TB"] as const;

export function formatBytes(bytes: number, options: FormatBytesOptions = {}): string {
  const { decimals = 1, base = BASE_2, spacer = " " } = options;

  validateInput(bytes, decimals);

  if (bytes === 0) return `0${spacer}B`;

  const { value, unit } = toUnit(bytes, base);
  const formattedValue = formatValue(value, decimals);

  return `${formattedValue}${spacer}${unit}`;
}

function toUnit(bytes: number, base: NumericBase): FormatResult {
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(base)), UNITS.length - 1);

  const value = bytes / Math.pow(base, exponent);
  const unit = UNITS[exponent];

  return { value, unit };
}

function formatValue(value: number, decimals: number): string {
  if (decimals === 0) {
    return Math.round(value).toString();
  }

  const fixed = value.toFixed(decimals);
  return removeTrailingZeros(fixed);
}

function removeTrailingZeros(value: string): string {
  return value.replace(/\.?0+$/, "");
}

function validateInput(bytes: number, decimals: number): void {
  if (!Number.isFinite(bytes) || bytes < 0) {
    throw new Error('Invalid "bytes" value');
  }

  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new Error('"decimals" must be a non-negative integer');
  }
}

export const bytes = {
  format: formatBytes,
};
