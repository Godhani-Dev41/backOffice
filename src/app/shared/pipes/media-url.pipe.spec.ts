import { RCMediaObject } from '@app/models';
import { MediaUrlPipe } from './media-url.pipe';

describe('MediaUrlPipe', () => {
  it('should return the value passed as is if it was a string', () => {
    const pipe = new MediaUrlPipe();
    expect(pipe.transform('test.string')).toBe('test.string');
  });

  it('should return image not from cloudinary provider', () => {
    const pipe = new MediaUrlPipe();
    const testImage: RCMediaObject = {
      url: 'test.url',
      provider: 'other'
    };

    expect(pipe.transform(testImage)).toBe('test.url');
  });

  it('should return image default resolution image from cloudinary provider', () => {
    const pipe = new MediaUrlPipe();
    const testImage: RCMediaObject = {
      url: 'test.url',
      provider: 'cloudinary',
      fileType: 'jpg',
      mediaKey: '1q2w3e4r'
    };

    expect(pipe.transform(testImage)).toContain('/image/upload/q_60/w_1000/1q2w3e4r.jpg');
  });

  it('should return image default specific resolution image from cloudinary provider', () => {
    const pipe = new MediaUrlPipe();
    const testImage: RCMediaObject = {
      url: 'test.url',
      provider: 'cloudinary',
      fileType: 'jpg',
      mediaKey: '1q2w3e4r'
    };

    expect(pipe.transform(testImage, 400)).toContain('/image/upload/q_60/w_400/1q2w3e4r.jpg');
  });

  // this method used by branch sharing links to generate an overlay image
  it('should return an overlay image with reccenter logo', () => {
    const pipe = new MediaUrlPipe();
    const testImage: RCMediaObject = {
      url: 'test.url',
      provider: 'cloudinary',
      fileType: 'jpg',
      mediaKey: '1q2w3e4r'
    };

    expect(pipe.transform(testImage, null, true))
      // tslint:disable-next-line:max-line-length
      .toContain('/image/upload/q_100,w_476,h_249,c_thumb/l_strip_jplwwk,x_0,y_-125,w_476,h_7/l_icon_qwopvt,w_50,h_50,y_-100,x_-199/1q2w3e4r.jpg');
  });
});
