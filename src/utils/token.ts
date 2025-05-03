import { BN } from "@coral-xyz/anchor";

export function bnToUiAmount(
  amount: BN,
  decimals: number,
  numOfDecimals?: number
): string {
  if (!amount) {
    return "0";
  }

  // Convert to big decimal string based on decimals
  const denominator = new BN(10).pow(new BN(decimals));

  // Handle integer part
  const integerPart = amount.div(denominator);

  // Handle fractional part
  const fractionalPart = amount.mod(denominator);

  // Convert fractional part to string with leading zeros
  let fractionalPartString = fractionalPart.toString();

  // Pad with leading zeros if needed
  while (fractionalPartString.length < decimals) {
    fractionalPartString = "0" + fractionalPartString;
  }

  // Apply numOfDecimals formatting if specified
  if (numOfDecimals !== undefined) {
    // Make sure we don't exceed available decimals
    const displayDecimals = Math.min(numOfDecimals, decimals);

    if (displayDecimals <= 0) {
      // No decimals requested, return just integer part
      return integerPart.toString();
    } else {
      // Truncate to specified number of decimals
      fractionalPartString = fractionalPartString.substring(0, displayDecimals);
    }
  } else {
    // No specific format requested, trim trailing zeros
    fractionalPartString = fractionalPartString.replace(/0+$/, "");
  }

  // Combine integer and fractional parts
  let result: string;
  if (fractionalPartString !== "") {
    result = `${integerPart}.${fractionalPartString}`;
  } else {
    result = integerPart.toString();
  }

  return result;
}
