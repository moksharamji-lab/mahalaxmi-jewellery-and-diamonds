export type HeroSliderPage =
  | "Home"
  | "Gold"
  | "Diamonds"
  | "Categories";

export type HeroMediaType =
  | "image"
  | "video";

export interface HeroSlide {
  id: string;

  title: string;
  subtitle: string;

  buttonText: string;
  buttonLink: string;

  page: HeroSliderPage;
  mediaType: HeroMediaType;

  image: string;
  imageUrl: string;

  video: string;
  videoUrl: string;

  active: boolean;
  order: number;

  created: string;
  updated: string;
}