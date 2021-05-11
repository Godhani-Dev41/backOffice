export interface MediaInterface {
  id: number;
  url: string;
  name: string;
  title: string;
  description: string;
  // Avoid key duplication in gallery
  entityId?: number;
  spaceType?: string;
  surface: string;
  properties: string[];
  sport: number;
}

export interface MediaUpload {
  file: {
      url: string; // example : "https://res.cloudinary.com/rcenter/image/upload/v1612964269/feypwl2lc8qbmi9qzjsd.jpg",
      provider: string; // example : "cloudinary",
      fileType: string; // example : "jpg",
      mediaKey: string; // example : "feypwl2lc8qbmi9qzjsd",
      fileName: string; // example : "tennis"
  },
  handleType:string; // example :  "main" (should be "main" unless its "logo" or "banner")
}
