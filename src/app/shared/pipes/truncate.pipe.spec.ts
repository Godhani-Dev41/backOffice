import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  it('should does nothing if the strings has less character than the limit', () => {
    const pipe = new TruncatePipe();

    expect(pipe.transform('Lorem', 10)).toBe('Lorem');
  });

  it('should truncate the string if input value has more character than the limit', () => {
    const pipe = new TruncatePipe();

    expect(pipe.transform('Lorem ipsum', 10)).toBe('Lorem ipsu...');
  });

  it('should replace the truncate sign from default to ---', () => {
    const pipe = new TruncatePipe();

    expect(pipe.transform('Lorem ipsum', 10, '---')).toBe('Lorem ipsu---');
  });

  it('should place the truncate sign at the beginning of the word', () => {
    const pipe = new TruncatePipe();

    expect(pipe.transform('Lorem ipsum', 10, '---', 'left')).toBe('---orem ipsum');
  });
});
