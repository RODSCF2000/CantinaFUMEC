import { CartItem } from './cart-item';

export class Order {
    id: string;
    userEmail: string;
    date: string;
    value: number;
    items: CartItem[];
}
