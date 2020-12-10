import { ajaxRequest } from '../ajax.js';

export class MapElement extends HTMLElement {
    constructor () {
        console.log('constructing');
        super();
        this.attachShadow({mode: 'open'});
        this.initialized = false;
        this.positionLocked = false;
    }

    async connectedCallback() {
        if (!this.initialized) {
            await this.getHtml();
        }
    }

    async getHtml() {
        const html = await ajaxRequest('../html/map-element.html');
        this.shadowRoot.innerHTML = html;

        this.initialize();
    }

    initialize() {
        this.addEventListener('mousedown', this.initializeDrag);
        this.initializeImage();

        this.initialized = true;
    }

    initializeImage() {
        const image = this.shadowRoot.querySelector('.image');
        image.src = this.getAttribute('image');

        this.shadowRoot.appendChild(image);
    }

    initializeDrag(e) {
        if (!this.positionLocked) {
            let initX = 0, initY = 0, currX = 0, currY = 0;

            e = e || window.event;
            e.preventDefault();
            e.stopPropagation(); // prevents drag from traversing up DOM and affecting map grid
            initX = e.clientX;
            initY = e.clientY;
            
            const drag = (e) => {
                e = e || window.event;
                e.preventDefault();
                currX = initX - e.clientX;
                currY = initY - e.clientY;
                initX = e.clientX;
                initY = e.clientY;

                this.style.left = (this.offsetLeft - currX) + 'px';
                this.style.top = (this.offsetTop - currY) + 'px';
            }

            const stopDrag = (e) => {
                document.onmouseup = null;
                document.onmousemove = null;

                const toolbar = document.querySelector('ww2-map-toolbar');

                if (this.getRootNode().host === toolbar) {
                    this.checkPos();
                }
            }

            document.onmouseup = stopDrag;
            document.onmousemove = drag;
        }
    }

    checkPos() {
        const mapGrid = document.querySelector('ww2-map').shadowRoot.querySelector('.map-grid');
        const toolbar = document.querySelector('ww2-map-toolbar');

        let elementLeft = this.offsetLeft;
        let elementTop = this.offsetTop;
        const mapGridLeft = mapGrid.offsetLeft;
        const mapGridTop = mapGrid.offsetTop;
        const toolbarHeight = toolbar.offsetHeight;
        
        if (elementLeft >= mapGridLeft && elementTop >= mapGridTop && elementTop >= toolbarHeight) {
            // TODO: ensure not still on toolbar (such as if map is under toolbar)
            // Adjust element position to grid
            elementLeft -= mapGridLeft;
            elementTop -= mapGridTop;
            this.style.left = elementLeft + 'px';
            this.style.top = elementTop + 'px';

            // Attach element to position in map grid
            this.appendToMap();
        }
    }

    appendToMap() {
        const mapGrid = document.querySelector('ww2-map').shadowRoot.querySelector('.map-grid');
        const mapGridWrapper = mapGrid.querySelector('.map-grid-wrapper');
        const toolbar = document.querySelector('ww2-map-toolbar');

        toolbar.shadowRoot.removeChild(this);
        mapGridWrapper.appendChild(this);
        this.classList.remove('toolbar-element');
    }

    checkConfirmation() {
        const confirmBox = document.createElement('div');
        confirmBox.classList.add('confirmation');

        const elementStyles = window.getComputedStyle(this);
        const elementWidth = parseFloat(elementStyles.getPropertyValue('width').replace('px', ''));
        const elementHeight = parseFloat(elementStyles.getPropertyValue('height').replace('px', ''));

        this.shadowRoot.appendChild(confirmBox); // append before getComputedStyle
        
        const confirmBoxStyles = window.getComputedStyle(confirmBox);
        const confirmBoxHeight = parseFloat(confirmBoxStyles.getPropertyValue('height').replace('px', ''));

        confirmBox.style.left = (elementWidth) + 'px';
        confirmBox.style.top = (elementHeight - confirmBoxHeight) + 'px';

        const check = document.createElement('div');
        check.classList.add('check');
        check.innerHTML = '&#x2713;'; // checkmark
        confirmBox.appendChild(check);

        const cross = document.createElement('div');
        cross.classList.add('cross');
        cross.innerHTML = '&#x2717;'; // x mark
        confirmBox.appendChild(cross);

        const confirm = () => {
            this.positionLocked = true;
            confirmBox.remove();
        }

        const cancel = () => {
            this.remove();
        }

        check.addEventListener('click', confirm);
        cross.addEventListener('click', cancel);
    }
}

customElements.define('ww2-map-element', MapElement);