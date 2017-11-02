const Carousel = require('nativescript-carousel').Carousel;
import { Component, OnInit } from "@angular/core";
import { EventData } from "tns-core-modules/data/observable";
import { renderCarouselSlides } from "../common/support";
import { PercentLength } from "tns-core-modules/ui/styling/style-properties";
import { Image } from "tns-core-modules/ui/image";
import { GridLayout, GridUnitType, ItemSpec } from "tns-core-modules/ui/layouts/grid-layout";
import { Button } from "tns-core-modules/ui/button";
import * as Rx from "rxjs";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent {

    loading = true;

    private subject: Rx.Subject<{ images: { src: string; }[] }> = new Rx.AsyncSubject();

    constructor() {
        this.subject.next({
            images: [
                {
                    src: "https://lorempixel.com/800/600/city/2/"
                },
                {
                    src: "https://lorempixel.com/800/600/nightlife/6/"
                },
                {
                    src: "https://lorempixel.com/800/600/nightlife/5/"
                }
            ]
        });

        this.subject.subscribe({
            next: (data) => {
                this.loading = false;
            }
        });

        setTimeout(() => this.subject.complete(), 3000);
    }

    onCarouselLoad(args: EventData): void {
        this.subject.subscribe({
            next: (data) => {
                const carousel: typeof Carousel = args.object;

                renderCarouselSlides(
                    carousel,
                    data.images,
                    (imageData: { src: string }) => {
                        const layout = new GridLayout();
                        layout.addRow(new ItemSpec(1, GridUnitType.AUTO));
                        layout.addColumn(new ItemSpec(1, GridUnitType.STAR));

                        layout.addEventListener(Button.tapEvent, (data: EventData) => {
                            alert(imageData.src);
                        });

                        const image = new Image();
                        image.width = PercentLength.parse("100%");
                        image.height = carousel.height;
                        image.src = imageData.src;
                        image.className = "image";
                        image.stretch = "aspectFill";
                        image.loadMode = "async";
                        GridLayout.setRow(image, 0);
                        GridLayout.setRowSpan(image, 1);
                        GridLayout.setColumn(image, 0);
                        GridLayout.setColumnSpan(image, 0);
                        layout.addChild(image);

                        return layout;
                    }
                );
            }
        });
    }

}
