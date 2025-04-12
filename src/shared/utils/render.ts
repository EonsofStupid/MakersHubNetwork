
import React from 'react';

/**
 * Safely render unknown values as React nodes
 */
export function renderUnknownAsNode(value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return null;
  }

  if (value instanceof Error) {
    return value.message + (value.cause ? ` (${String(value.cause)})` : '');
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (React.isValidElement(value)) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => (
      <span key={index}>{renderUnknownAsNode(item)}</span>
    ));
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return '[Object]';
    }
  }

  return String(value);
}

/**
 * Convert an error to a plain object for logging
 */
export function errorToObject(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  if (typeof error === 'string') {
    return { message: error };
  }

  if (typeof error === 'object' && error !== null) {
    return { ...error };
  }

  return { unknown: String(error) };
}

/**
 * Slugify a string for use in URLs or IDs
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
