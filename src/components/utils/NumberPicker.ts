export class NumberPicker extends HTMLElement {
    private min: number | null = null;
    private max: number | null = null;
    private value: number = 0;

    constructor() {
        super();
        this.initNumberPicker(this);
    }

    getValue() {
        return this.value;
    }
    
    private initNumberPicker(root: HTMLElement) {
        const span = root.querySelector('.value') as HTMLSpanElement;
        const minus = root.querySelector('.sub-btn') as HTMLButtonElement;
        const plus = root.querySelector('.add-btn') as HTMLButtonElement;
        const minAttr = root.getAttribute('data-min');
        const maxAttr = root.querySelector('[data-max]')?.getAttribute('data-max');
        const valueAttr = root.getAttribute('data-value');
        this.min = minAttr ? parseInt(minAttr) : null;
        this.max = maxAttr ? parseInt(maxAttr) : null;
        this.value = valueAttr ? parseInt(valueAttr) : 0;
        
        minus.addEventListener('click', () => {
            if (this.min === null || this.value > this.min) {
                this.setValue(root, this.value - 1);
            }
        });
        
        plus.addEventListener('click', () => {
            if (this.max === null || this.value < this.max) {
                this.setValue(root, this.value + 1);
            }
        });
    }

    private setValue(root: HTMLElement, value: number) {
        this.value = value;
        const span = root.querySelector('.value') as HTMLSpanElement;
        span.textContent = value.toString();

        root?.dispatchEvent(
            new CustomEvent('number-picker-change', {
                detail: {
                    value
                }
            })
        );
    }
}
