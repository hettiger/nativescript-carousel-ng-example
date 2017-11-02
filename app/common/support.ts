const CarouselItem = require('nativescript-carousel').CarouselItem;
const Carousel = require('nativescript-carousel').Carousel;
import { isAndroid } from "tns-core-modules/platform";
import { View } from "tns-core-modules/ui/core/view";

function carouselItemFromView(view: View) {
    const item = new CarouselItem();
    item.addChild(view);
    return item;
}

function addItemToCarousel(carousel: typeof Carousel) {
    return (item: typeof CarouselItem, index: number) => {
        carousel.addChild(item);

        if (isAndroid) {
            const adapter = carousel.android.getAdapter();

            if (adapter) {
                const count = index + 1;
                adapter.notifyDataSetChanged();
                carousel._pageIndicatorView.setCount(count);

                if (count === 1) {
                    carousel._pageIndicatorView.setSelection(item.android);
                }
            }
        }
    }
}

/**
 * @see https://github.com/manijak/nativescript-carousel/issues/5#issuecomment-325879416
 */
export function renderCarouselSlides(
    carousel: typeof Carousel,
    items: any[],
    slideRenderer: (item: any) => View
): void {
    items
        .map(slideRenderer)
        .map(carouselItemFromView)
        .map(addItemToCarousel(carousel));

    carousel.refresh();
}
