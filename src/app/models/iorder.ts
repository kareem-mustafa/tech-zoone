export interface IUser {
  _id: string;
  username: string;
  email: string;
}

export interface IProduct {
  _id: string;
  title: string;
  price: number;
  description: string;
}

export interface IOrder {
  _id?: string;
  user: IUser;
  items: {
    _id?: string;
    product: IProduct;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    phone: string;
  };
  paymentMethodType: 'card' | 'cash' | 'paypal';
  paymentStatus: 'pending' | 'paid' | 'failed';
  isDelivered: boolean;
  totalOrderPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}
