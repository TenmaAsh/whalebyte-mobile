import { ethers } from 'ethers';

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatEther(value: string | number | bigint): string {
  if (!value) return '0';
  try {
    const formatted = ethers.formatEther(value.toString());
    const number = parseFloat(formatted);
    return number.toFixed(number >= 0.01 ? 2 : 4);
  } catch (error) {
    console.error('Error formatting ether value:', error);
    return '0';
  }
}

export function parseEther(value: string): bigint {
  if (!value) return BigInt(0);
  try {
    return ethers.parseEther(value);
  } catch (error) {
    console.error('Error parsing ether value:', error);
    return BigInt(0);
  }
}