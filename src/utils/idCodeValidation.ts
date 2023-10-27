import { validationResult } from './validation';

const multiplierOne = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
const multiplierTwo = [3, 4, 5, 6, 7, 8, 9, 1, 2, 3];
const monthNumbers31 = [1, 3, 5, 7, 8, 10, 12];
const monthNumbers30 = [4, 6, 9, 11];

const verifyControlNumber = (userId: string) => {
  let result = 0;
  for (let i = 0; i < 10; i += 1) result += parseInt(userId.substring(i + 2, i + 3), 10) * multiplierOne[i];
  result %= 11;

  if (result === 10) {
    result = 0;
    for (let i = 0; i < 10; i += 1) result += parseInt(userId.substring(i + 2, i + 3), 10) * multiplierTwo[i];
    result %= 11;
  }
  if (result === 10) result = 0;
  return result === parseInt(userId.substring(12, 13), 10);
};

export const verifyGenderMonthDayNumbers = (gender: number, month: number, day: number, year: number): boolean => {
  if (gender > 6 || gender < 1 || day < 1 || month < 1) return false;
  if (monthNumbers31.includes(month) && day > 31) return false;
  if (monthNumbers30.includes(month) && day > 30) return false;
  if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || (year === 0 && (gender === 5 || gender === 6)))) {
    if (day > 29) return false;
  }
  return !(month === 2 && day > 28);
};

export const validateUserIdCode = (userId: string): validationResult => {
  if (userId.substring(0, 2).toUpperCase() !== 'EE') return { result: false, resultMessage: 'addUser.missingPrefix' };

  if (userId.length !== 13) return { result: false, resultMessage: 'addUser.wrongIdCodeLength' };

  if (Number(userId.substring(2, 13)) !== parseInt(userId.substring(2, 13), 10)) return { result: false, resultMessage: 'addUser.idCodeNumeric' };

  if (
    !verifyGenderMonthDayNumbers(
      parseInt(userId.substring(2, 3), 10),
      parseInt(userId.substring(5, 7), 10),
      parseInt(userId.substring(7, 9), 10),
      parseInt(userId.substring(3, 5), 10),
    )
  ) {
    return { result: false, resultMessage: 'addUser.invalidIdCode' };
  }

  if (!verifyControlNumber(userId)) return { result: false, resultMessage: 'addUser.invalidIdCode' };
  return { result: true, resultMessage: '' };
};
