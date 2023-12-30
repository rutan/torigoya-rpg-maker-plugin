export function generateMessage(histories) {
  if (histories.length === 0) return '';

  return histories
    .slice(0)
    .sort((a, b) => b.adPoint - a.adPoint)
    .map((item) => `${item.advertiserName}さん（${item.adPoint}pt）`)
    .join(' / ');
}
