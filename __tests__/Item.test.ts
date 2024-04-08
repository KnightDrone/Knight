import { Item } from '../src/components/Item';

describe('Item', () => {
    let item: Item;

    beforeEach(() => {
        item = new Item('Test Item', 'This is a test item', '../assets/images/splash.png', 100);
    });

    test('getName returns the correct name', () => {
        expect(item.getName()).toBe('Test Item');
    });

    test('getDescription returns the correct description', () => {
        expect(item.getDescription()).toBe('This is a test item');
    });

    test('getImage returns the correct image', () => {
        expect(item.getImage()).toBe('../assets/images/splash.png');
    });

    test('getPrice returns the correct price', () => {
        expect(item.getPrice()).toBe(100);
    });
});