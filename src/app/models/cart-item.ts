import { Product } from './product';

export class CartItem {
    constructor(public menuItem: Product,
                public quantity: number = 1) { }

    value(): number {
        return this.menuItem.price * this.quantity;
    }
}
