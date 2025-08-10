import { Injectable } from '@angular/core';

@Injectable()
export class LicensePlateService {
  private readonly INITIAL_THRESHOLD = 1_000_000;
  private readonly PLATE_LENGTH = 6;
  private readonly ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private readonly MAX = this.calculateTotalLicense();

  public generateLicense(index: number): string {
    if (index < 0 || index >= this.MAX) {
      throw new Error('Index out of range');
    }

    if (index < this.INITIAL_THRESHOLD) {
      return index.toString().padStart(6, '0');
    }

    let lettersCount = 1;
    let currentThreshold = this.INITIAL_THRESHOLD;

    while (lettersCount <= this.PLATE_LENGTH) {
      const digits = this.PLATE_LENGTH - lettersCount;
      const rangeNumbers = Math.pow(10, digits);
      const rangeTotal =
        rangeNumbers * Math.pow(this.ALPHABET.length, lettersCount);

      if (index < currentThreshold + rangeTotal) {
        const offset = index - currentThreshold;
        const numberPart = this.getNumberPart(offset, rangeNumbers, digits);
        const letterPart = this.getLetterPart(
          offset,
          rangeNumbers,
          lettersCount
        );

        return numberPart + letterPart;
      }

      currentThreshold += rangeTotal;
      lettersCount++;
    }

    throw new Error('Index out of supported range');
  }

  private getNumberPart(
    offset: number,
    rangeNumbers: number,
    digits: number
  ): string {
    if (digits === 0) {
      return '';
    }
    return (offset % rangeNumbers).toString().padStart(digits, '0');
  }

  private getLetterPart(
    offset: number,
    rangeNumbers: number,
    lettersCount: number
  ): string {
    let letterPart = '';
    let letterIndex = (offset / rangeNumbers) | 0;
    for (let i = 0; i < lettersCount; i++) {
      letterPart =
        this.ALPHABET[letterIndex % this.ALPHABET.length] + letterPart;
      letterIndex = (letterIndex / this.ALPHABET.length) | 0;
    }
    return letterPart;
  }

  private calculateTotalLicense(): number {
    const DIGITS_COUNT = 10;
    const LETTERS_COUNT = 26;

    const plateGroups = Array.from(
      { length: this.PLATE_LENGTH + 1 },
      (_, letterCount) => {
        const numberCount = this.PLATE_LENGTH - letterCount;
        const combinationsForThisGroup =
          DIGITS_COUNT ** numberCount * LETTERS_COUNT ** letterCount;
        return combinationsForThisGroup;
      }
    );

    return plateGroups.reduce((total, groupCount) => total + groupCount, 0);
  }
}
