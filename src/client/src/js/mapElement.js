import { ajaxRequest, ajaxPost } from '../ajax.js';

export class MapElement extends HTMLElement {
    constructor () {
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

    static get observedAttributes() {
        return ['image'];
    };

    attributeChangedCallback(name, oldValue, newValue) {
        // this.initializeImage(newValue);
        this.imageUrl = newValue;
    }

    async getHtml() {
        const html = await ajaxRequest('../html/map-element.html');
        this.shadowRoot.innerHTML += html; // += because the image may have already been appended to the shadow root

        this.initialize();
    }

    async initialize() {
        const path = window.location.origin + '/get/isAdmin';
        this.admin = false;
        this.adminMove = false;
        try {
            this.admin = await ajaxRequest(path);
        } catch (error) {
            console.error(error);
        }
        const remoteData = (await this.getData()).remoteData;
        if (remoteData && remoteData.command) {
            this.command = remoteData.command;
        }
        this.initialized = true;

        this.initializeImage(this.imageUrl);
        this.initializeInformationBox();
        await this.initializeContextMenu();
        this.addEventListener('mousedown', this.initializeDrag);
        this.addEventListener('mouseover', this.displayInformationBox);
        this.addEventListener('contextmenu', this.toggleContextMenu);
    }

    initializeImage(url) {
        const image = document.createElement('img');
        image.classList.add('image');
        image.setAttribute('src', url);

        this.shadowRoot.appendChild(image);
    }

    initializeInformationBox() {
        const informationBox = document.createElement('div');
        informationBox.classList.add('information');
        informationBox.classList.add('hidden');
        this.shadowRoot.appendChild(informationBox);

        const elementStyles = window.getComputedStyle(this);
        const elementWidth = elementStyles.getPropertyValue('width');

        const imageStyles = window.getComputedStyle(this.shadowRoot.querySelector('.image'));
        const outlineWidth = imageStyles.getPropertyValue('outline-width');

        const mockData = {
            Name: 'Division',
            Strength: 100
        };

        for (const data of Object.entries(mockData)) {
            const dataDiv = document.createElement('div');
            dataDiv.innerHTML = `${data[0]}:&nbsp${data[1]}`;
            informationBox.appendChild(dataDiv);
        }

        informationBox.style.left = elementWidth;
        informationBox.style.top = `-${outlineWidth}`;
    }

    async initializeContextMenu() {
        const contextMenu = document.createElement('div');
        contextMenu.classList.add('context-menu');
        contextMenu.classList.add('hidden');
        this.shadowRoot.appendChild(contextMenu);

        // Admin Options

        if (this.admin) {
            const move = document.createElement('div');
            move.classList.add('context-option');
            move.innerHTML = 'Admin Move';
            move.addEventListener('click', async () => {
                const informationBox = this.shadowRoot.querySelector('.information');
                if (!informationBox.classList.contains('hidden')) {
                    informationBox.classList.add('hidden');
                }

                if (!contextMenu.classList.contains('hidden')) {
                    contextMenu.classList.add('hidden');
                }

                const priorData = await this.getData();
                this.positionLocked = false;
                this.adminMove = true;
                this.checkConfirmation(priorData);
            });
            contextMenu.appendChild(move);

            const remove = document.createElement('div');
            remove.classList.add('context-option');
            remove.innerHTML = 'Remove';
            remove.addEventListener('click', async () => {
                const response = await this.deleteElement();
                this.remove();
            });
            contextMenu.appendChild(remove);

            const copyId = document.createElement('div');
            copyId.classList.add('context-option');
            copyId.innerHTML = 'Copy ID';
            copyId.addEventListener('click', async () => {
                if (!contextMenu.classList.contains('hidden')) {
                    contextMenu.classList.add('hidden');
                }

                const id = this.getAttribute('mapId');
                navigator.clipboard.writeText(id);
            });
            contextMenu.appendChild(copyId);
        }

        // Player options
        const path = window.location.origin + '/get/steamId';
        const playerId = await ajaxRequest(path);

        if (this.command == playerId) {
            const move = document.createElement('div');
            move.classList.add('context-option');
            move.innerHTML = 'Move';
            move.addEventListener('click', async () => {
                const informationBox = this.shadowRoot.querySelector('.information');
                if (!informationBox.classList.contains('hidden')) {
                    informationBox.classList.add('hidden');
                }

                if (!contextMenu.classList.contains('hidden')) {
                    contextMenu.classList.add('hidden');
                }

                const priorData = await this.getData();
                this.positionLocked = false;
                this.checkConfirmation(priorData);
            });
            contextMenu.appendChild(move);
        }
    }

    async initializeDrag(e) {
        if (!this.positionLocked && e.button == 0) {
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation(); // prevents drag from traversing up DOM and affecting map grid
            
            const remoteData = (await this.getData()).remoteData;
            let range;
            let startingX;
            let startingY;
            if (remoteData && !this.adminMove) {
                range = remoteData.range;
                startingX = remoteData.pos_x;
                startingY = remoteData.pos_y;
            }

            let maxX = Number.POSITIVE_INFINITY, maxY = Number.POSITIVE_INFINITY;
            let minX = Number.NEGATIVE_INFINITY, minY = Number.NEGATIVE_INFINITY;
            if (range) {
                maxX = startingX + range;
                maxY = startingY + range;
                minX = startingX - range;
                minY = startingY - range;
            }

            let initX = 0, initY = 0, currX = 0, currY = 0;

            initX = e.clientX;
            initY = e.clientY;
            
            const drag = (e) => {
                if (!this.positionLocked) {
                    e = e || window.event;
                    e.preventDefault();
                    currX = initX - e.clientX;
                    currY = initY - e.clientY;
                    initX = e.clientX;
                    initY = e.clientY;

                    currX = this.offsetLeft - currX;
                    currY = this.offsetTop - currY;
                    if (currX < maxX && currX > minX) {
                        this.style.left = currX + 'px';
                    }
                    if (currY < maxY && currY > minY) {
                        this.style.top = currY + 'px';
                    }
                    // this.style.left = (this.offsetLeft - currX) + 'px';
                    // this.style.top = (this.offsetTop - currY) + 'px';
                }
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

    displayInformationBox(e) {
        const informationBox = this.shadowRoot.querySelector('.information');
        if (this.positionLocked) {
            const displayInformationBox = setTimeout(() => {
                informationBox.classList.remove('hidden');
            }, 600);

            this.onmouseleave = () => {
                if (!informationBox.classList.contains('hidden')) {
                    informationBox.classList.add('hidden');
                }
                clearTimeout(displayInformationBox);
            }
        }
    }

    toggleContextMenu(e) {
        if (this.positionLocked) {
            e.preventDefault(); // overrides standard context menu

            const contextMenu = this.shadowRoot.querySelector('.context-menu');
            if (contextMenu.childElementCount > 0) { // if options exist
                contextMenu.classList.toggle('hidden');
            }

            if (!contextMenu.classList.contains('hidden')) {
                const elementBounds = this.getBoundingClientRect();
                contextMenu.style.left = `${e.clientX - elementBounds.left}px`;
                contextMenu.style.top = `${e.clientY - elementBounds.top}px`;
            } else {
                contextMenu.style.left = null;
                contextMenu.style.top = null;
            }
            
            contextMenu.addEventListener('mouseleave', () => {
                if (!contextMenu.classList.contains('hidden')) {
                    contextMenu.classList.toggle('hidden');
                    contextMenu.style.left = null;
                    contextMenu.style.top = null;
                }
            })
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
        const toolbarElementsContainer = document.querySelector('ww2-map-toolbar').shadowRoot.querySelector('.elements-container');

        toolbarElementsContainer.removeChild(this);
        mapGridWrapper.appendChild(this);
    }

    checkConfirmation(priorData) {
        const confirmBox = document.createElement('div');
        confirmBox.classList.add('confirmation');
        this.shadowRoot.appendChild(confirmBox); // append before getComputedStyle

        const confirmBoxStyles = window.getComputedStyle(confirmBox);
        const confirmBoxHeight = parseFloat(confirmBoxStyles.getPropertyValue('height').replace('px', ''));

        const elementStyles = window.getComputedStyle(this);
        const elementWidth = parseFloat(elementStyles.getPropertyValue('width').replace('px', ''));
        const elementHeight = parseFloat(elementStyles.getPropertyValue('height').replace('px', ''));
        
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

        const confirm = async () => {
            this.positionLocked = true;
            if (priorData) {
                let newData = await this.getData();
                priorData.dataToUpdate = {
                    pos_x: newData.pos_x,
                    pos_y: newData.pos_y,
                    adminMove: this.adminMove
                };
                await this.updateElement(priorData);
            } else {
                await this.postElement();
            }
            if (this.adminMove) {
                this.adminMove = false;
            }
            confirmBox.remove();
        }

        const cancel = () => {
            this.positionLocked = true;
            if (priorData) {
                const confirmBox = this.shadowRoot.querySelector('.confirmation');
                confirmBox.remove();

                this.style.left = priorData.pos_x + 'px';
                this.style.top = priorData.pos_y + 'px';
            } else {
                this.remove();
            }
        }

        check.addEventListener('click', confirm);
        cross.addEventListener('click', cancel);
    }

    async getData() {
        const posX = parseFloat(this.style.left.replace('px', ''));
        const posY = parseFloat(this.style.top.replace('px', ''));
        const type = this.getAttribute('type');
        const id = this.getAttribute('mapId');

        const elementData = {
            pos_x: posX,
            pos_y: posY,
            type,
            id,
            command: this.command
        };

        if (type && id) {
            try {
                const path = window.location.origin + `/get/mapElement?type=${type}&id=${id}`;
                const remoteData = await ajaxRequest(path);
                if (remoteData) {
                    elementData.remoteData = JSON.parse(remoteData);
                }
                // console.log(elementData);
            } catch (error) {
                console.error(error);
            }
        }

        return elementData;
    }

    async postElement() {
        const elementData = await this.getData();

        const path = window.location.origin + '/post/mapElement?method=create';
        const response = await ajaxPost(path, JSON.stringify(elementData));
        // response should contain newly created unit's attributes
        // console.log('Post response:', response);
        this.setAttribute('mapId', JSON.parse(response)._id);
        return response;
    }

    async updateElement(data) {
        const path = window.location.origin + '/post/mapElement?method=update';
        const response = await ajaxPost(path, JSON.stringify(data));
    }

    async deleteElement() {
        const elementData = await this.getData();
        let response = null;
        if (elementData.id) {
            const path = window.location.origin + '/post/mapElement?method=delete';
            response = await ajaxPost(path, JSON.stringify(elementData));
        }
        return response;
    }
}

customElements.define('ww2-map-element', MapElement);