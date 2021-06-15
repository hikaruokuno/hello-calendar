export const getStartDateStr = (dateText: string) => {
  const applyPeriodText = dateText
    .replace(/[年月日時月火水木金土日まで]/g, '')
    .replaceAll('（）', '')
    .replace(/\s+/g, '');
  const start = applyPeriodText.substring(0, applyPeriodText.indexOf('～'));
  const startDateStr =
    start.substring(0, 4) +
    '-' +
    start.substring(4, 6) +
    '-' +
    start.substring(6, 8) +
    ' ' +
    start.substring(8, 10) +
    ':00:00';

  return startDateStr;
};

export const getEndDateStr = (dateText: string) => {
  const end = dateText.substring(dateText.indexOf('～') + 1);
  const endDateStr =
    end.substring(0, 4) +
    '-' +
    end.substring(4, 6) +
    '-' +
    end.substring(6, 8) +
    ' ' +
    end.substring(8, 10) +
    ':00:00';
  return endDateStr;
};
