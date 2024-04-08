import { Item } from '../src/components/Item';

describe('Item', () => {
    let item: Item;
    let image = require('../assets/images/splash.png');

    beforeEach(() => {
        item = new Item(1,'Test Item', 'This is a test item', image, image, 100);
    });

    test('getId returns the correct id', () => {
        expect(item.getId()).toBe(1);
    });

    test('getName returns the correct name', () => {
        expect(item.getName()).toBe('Test Item');
    });

    test('getDescription returns the correct description', () => {
        expect(item.getDescription()).toBe('This is a test item');
    });

    test('getIcon returns the correct icon', () => {
        expect(item.getIcon()).toBe(require('../assets/images/splash.png'));
    });

    test('getImage returns the correct image', () => {
        expect(item.getImage()).toBe(require('../assets/images/splash.png'));
    });

    test('getPrice returns the correct price', () => {
        expect(item.getPrice()).toBe(100);
    });
});