export interface ImageResponse {
  events_name?: string;
  image: {
    data?: any[];
    type?: string;
  };
  product_name?: string;
  product_id?: number | string;
}
