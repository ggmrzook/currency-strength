import { CountryData } from "@/types";

export const COUNTRIES: CountryData[] = [
  { name: "United States", code: "US", currency: "USD", currencySymbol: "$", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", currency: "GBP", currencySymbol: "£", flag: "🇬🇧" },
  { name: "Japan", code: "JP", currency: "JPY", currencySymbol: "¥", flag: "🇯🇵" },
  { name: "Canada", code: "CA", currency: "CAD", currencySymbol: "CA$", flag: "🇨🇦" },
  { name: "Australia", code: "AU", currency: "AUD", currencySymbol: "A$", flag: "🇦🇺" },
  { name: "Switzerland", code: "CH", currency: "CHF", currencySymbol: "CHF", flag: "🇨🇭" },
  { name: "China", code: "CN", currency: "CNY", currencySymbol: "¥", flag: "🇨🇳" },
  { name: "South Korea", code: "KR", currency: "KRW", currencySymbol: "₩", flag: "🇰🇷" },
  { name: "Singapore", code: "SG", currency: "SGD", currencySymbol: "S$", flag: "🇸🇬" },
  { name: "Hong Kong", code: "HK", currency: "HKD", currencySymbol: "HK$", flag: "🇭🇰" },
  { name: "Norway", code: "NO", currency: "NOK", currencySymbol: "kr", flag: "🇳🇴" },
  { name: "Sweden", code: "SE", currency: "SEK", currencySymbol: "kr", flag: "🇸🇪" },
  { name: "Denmark", code: "DK", currency: "DKK", currencySymbol: "kr", flag: "🇩🇰" },
  { name: "New Zealand", code: "NZ", currency: "NZD", currencySymbol: "NZ$", flag: "🇳🇿" },
  { name: "India", code: "IN", currency: "INR", currencySymbol: "₹", flag: "🇮🇳" },
  { name: "Brazil", code: "BR", currency: "BRL", currencySymbol: "R$", flag: "🇧🇷" },
  { name: "Mexico", code: "MX", currency: "MXN", currencySymbol: "Mex$", flag: "🇲🇽" },
  { name: "South Africa", code: "ZA", currency: "ZAR", currencySymbol: "R", flag: "🇿🇦" },
  { name: "Russia", code: "RU", currency: "RUB", currencySymbol: "₽", flag: "🇷🇺" },
  { name: "Turkey", code: "TR", currency: "TRY", currencySymbol: "₺", flag: "🇹🇷" },
  { name: "Saudi Arabia", code: "SA", currency: "SAR", currencySymbol: "﷼", flag: "🇸🇦" },
  { name: "UAE", code: "AE", currency: "AED", currencySymbol: "د.إ", flag: "🇦🇪" },
  { name: "Malaysia", code: "MY", currency: "MYR", currencySymbol: "RM", flag: "🇲🇾" },
  { name: "Philippines", code: "PH", currency: "PHP", currencySymbol: "₱", flag: "🇵🇭" },
  { name: "Indonesia", code: "ID", currency: "IDR", currencySymbol: "Rp", flag: "🇮🇩" },
  { name: "Thailand", code: "TH", currency: "THB", currencySymbol: "฿", flag: "🇹🇭" },
  { name: "Vietnam", code: "VN", currency: "VND", currencySymbol: "₫", flag: "🇻🇳" },
  { name: "Pakistan", code: "PK", currency: "PKR", currencySymbol: "Rs", flag: "🇵🇰" },
  { name: "Bangladesh", code: "BD", currency: "BDT", currencySymbol: "৳", flag: "🇧🇩" },
  { name: "Nigeria", code: "NG", currency: "NGN", currencySymbol: "₦", flag: "🇳🇬" },
  { name: "Kenya", code: "KE", currency: "KES", currencySymbol: "KSh", flag: "🇰🇪" },
  { name: "Egypt", code: "EG", currency: "EGP", currencySymbol: "E£", flag: "🇪🇬" },
  { name: "Argentina", code: "AR", currency: "ARS", currencySymbol: "AR$", flag: "🇦🇷" },
  { name: "Colombia", code: "CO", currency: "COP", currencySymbol: "Col$", flag: "🇨🇴" },
  { name: "Chile", code: "CL", currency: "CLP", currencySymbol: "CL$", flag: "🇨🇱" },
  { name: "Peru", code: "PE", currency: "PEN", currencySymbol: "S/.", flag: "🇵🇪" },
  { name: "Poland", code: "PL", currency: "PLN", currencySymbol: "zł", flag: "🇵🇱" },
  { name: "Czech Republic", code: "CZ", currency: "CZK", currencySymbol: "Kč", flag: "🇨🇿" },
  { name: "Hungary", code: "HU", currency: "HUF", currencySymbol: "Ft", flag: "🇭🇺" },
  { name: "Romania", code: "RO", currency: "RON", currencySymbol: "lei", flag: "🇷🇴" },
  { name: "Israel", code: "IL", currency: "ILS", currencySymbol: "₪", flag: "🇮🇱" },
  { name: "Taiwan", code: "TW", currency: "TWD", currencySymbol: "NT$", flag: "🇹🇼" },
  { name: "Germany", code: "DE", currency: "EUR", currencySymbol: "€", flag: "🇩🇪" },
  { name: "France", code: "FR", currency: "EUR", currencySymbol: "€", flag: "🇫🇷" },
  { name: "Spain", code: "ES", currency: "EUR", currencySymbol: "€", flag: "🇪🇸" },
  { name: "Italy", code: "IT", currency: "EUR", currencySymbol: "€", flag: "🇮🇹" },
  { name: "Netherlands", code: "NL", currency: "EUR", currencySymbol: "€", flag: "🇳🇱" },
];

export function findCountry(query: string): CountryData | undefined {
  const q = query.toLowerCase().trim();
  return COUNTRIES.find(
    (c) =>
      c.code.toLowerCase() === q ||
      c.name.toLowerCase() === q ||
      c.currency.toLowerCase() === q
  );
}

export function getCountryByCode(code: string): CountryData | undefined {
  return COUNTRIES.find((c) => c.code === code);
}
