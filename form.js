export class AcmeSubmitButton extends HTMLElement {
    constructor() {
        super();

        // Create shadow DOM
        const shadowRoot = this.attachShadow({ mode: 'open' });

        const rootContainer = document.createElement('div');
        rootContainer.style.paddingLeft = "200px";
        rootContainer.style.paddingRight = "200px";

        // Create containers for the images
        const containerA = document.createElement('div');
        containerA.style.position = 'relative';
        containerA.style.display = 'inline-block';

        const containerB = document.createElement('div');
        containerB.style.position = 'relative';
        containerB.style.display = 'inline-block';

        const containerC = document.createElement('div');
        containerC.style.position = 'relative';
        containerC.style.display = 'inline-block';

        // Create the base images
        const prostateA = document.createElement('img');
        prostateA.src = 'https://github.com/BaltzarL/cambio-test/blob/main/images/prostate_A.png?raw=true';
        prostateA.alt = 'Base Image';
        prostateA.style.width = '200px';

        const prostateB = document.createElement('img');
        prostateB.src = 'https://github.com/BaltzarL/cambio-test/blob/main/images/prostate_B.png?raw=true';
        prostateB.alt = 'Base Image';
        prostateB.style.width = '200px';

        const prostateC = document.createElement('img');
        prostateC.src = 'https://github.com/BaltzarL/cambio-test/blob/main/images/prostate_C.png?raw=true';
        prostateC.alt = 'Base Image';
        prostateC.style.width = '200px';

        // Append base images to containers
        containerA.appendChild(prostateA);
        containerB.appendChild(prostateB);
        containerC.appendChild(prostateC);

        rootContainer.appendChild(containerA);
        rootContainer.appendChild(containerB);
        rootContainer.appendChild(containerC);
        shadowRoot.appendChild(rootContainer);

        // Style for overlay
        const style = document.createElement('style');
        style.innerText = `
            img {
                display: block;
                border-radius: 0.5em;
            }
            .overlay-image {
                position: absolute;
                cursor: pointer;
            }
        `;
        shadowRoot.appendChild(style);

        // Utility functions for querying elements in the shadow DOM
        function querySelector(selector) {
            return querySelectorAll(document, selector)[0];
        }

        function querySelectorAll(node, selector) {
            const nodes = [...node.querySelectorAll(selector)];
            const nodeIterator = document.createNodeIterator(
                node,
                NodeFilter.SHOW_ELEMENT,
                node => node instanceof Element && node.shadowRoot ?
                NodeFilter.FILTER_ACCEPT :
                NodeFilter.FILTER_REJECT,
            );

            let currentNode = nodeIterator.nextNode();
            while (currentNode) {
                nodes.push(...querySelectorAll(currentNode.shadowRoot, selector));
                currentNode = nodeIterator.nextNode();
            }

            return nodes;
        }

        setTimeout(() => {
            let gleasonScore = 0;
            let prostateSparingDx = "";
            let prostateSparingSin = "";

            const gleasonScoreRoot = querySelector("c-input-count[name='T0_total_gleason_score']");
            const sparingDxRoot = querySelector("c-input-select[name='T0_nerve_sparing_dx']");
            const sparingSinRoot = querySelector("c-input-select[name='T0_nerve_sparing_sin']");

            let lesionLocationRoots = [];
            const lesionLocationInstance = querySelector("c-instantiator[name='T0_location_EL']");

            // MutationObserver to update lesionLocationRoots dynamically
            const observer = new MutationObserver(mutations => {
                lesionLocationRoots = querySelectorAll(lesionLocationInstance, "c-input-select");
                lesionLocationRoots.forEach(locationElement => {
                    locationElement.addEventListener('input', event => {
                        refreshOverlay();
                    });
                });
            });

            // Start observing for changes
            if (lesionLocationInstance) {
                observer.observe(lesionLocationInstance, { childList: true });
                lesionLocationRoots = Array.from(lesionLocationInstance.children);
            }

            const baseUrl = "https://raw.githubusercontent.com/BaltzarL/cambio-test/refs/heads/main/images/";

            const grayscale = {
                filter: 'brightness(0) saturate(100%) invert(47%) sepia(2%) saturate(812%) hue-rotate(212deg) brightness(98%) contrast(89%)'
            };

            const lesionCoordinates = {
                A: { top: [[11, 50], [16, 41], [50, 29], [83, 38], [90, 45]], middle: [[9, 63], [22, 60], [51, 60], [79, 61], [93, 63]], bottom: [[14, 86], [30, 92], [51, 94], [72, 93], [88, 85]] },
                B: { top: [[20, 56], [26, 46], [51, 29], [77, 41], [83, 53]], middle: [[21, 62], [30, 60], [52, 58], [75, 61], [85, 61]], bottom: [[21, 74], [35, 90], [53, 95], [70, 93], [82, 81]] },
                C: { top: [[28, 51], [37, 41], [56, 33], [75, 41], [85, 50]], middle: [[26, 62], [41, 57], [56, 57], [73, 58], [89, 63]], bottom: [[39, 94], [47, 91], [57, 88], [68, 91], [76, 93]] },
            };

            function createOverlayShape(pointsArray, container, color = 'rgba(255, 0, 0, 0.5)') {
                const newOverlay = document.createElement('div');
                newOverlay.classList.add('overlay-image');
                newOverlay.style.backgroundColor = color;
                newOverlay.style.width = "100%";
                newOverlay.style.height = "100%";
                newOverlay.style.clipPath = `polygon(${pointsArray.map(point => `${point[0]}% ${point[1]}%`).join(', ')})`;
                container.insertBefore(newOverlay, container.firstChild);
            }

            function updateLocationOverlay(location, score) {
                if (!location) return;
                const section = location[1];
                const row = location[2];
                const column = parseInt(location[0]) - 1;

                const container = section === 'A' ? containerA : section === 'B' ? containerB : containerC;
                const coordinates = lesionCoordinates[section];
                const topPoints = row === 'v' ? coordinates.top : coordinates.middle;
                const bottomPoints = row === 'v' ? coordinates.middle : coordinates.bottom;
                const selectedCoordinates = [topPoints[column], topPoints[column + 1], bottomPoints[column + 1], bottomPoints[column]];

                createOverlayShape(selectedCoordinates, container);
            }

            function updateSparingOverlay(sparingDx, sparingSin) {
                // Dex = Left (on image)
                // Sin = Right (on image)
                const sparingInformation = {
                    none: {
                        url: baseUrl + "sparing_none.svg",
                        // Terrible solution, but not sure how to do it better
                        positionRight: { width: '30%', left: '212px', top: '60px' },
                        positionLeft: { width: '30%', left: '-66px', top: '60px' },
                        // The coded text IDs
                        nameLeft: "at0014",
                        nameRight: "at0020",
                    },
                    semi: {
                        url: baseUrl + "sparing_semi.svg",
                        positionRight: { width: '20%', left: '200px', top: '70px' },
                        positionLeft: { width: '20%', left: '-34px', top: '70px' },
                        nameLeft: "at0013",
                        nameRight: "at0019",
                    },
                    inter: {
                        url: baseUrl + "sparing_inter.svg",
                        positionRight: { width: '20%', left: '184px', top: '70px' },
                        positionLeft: { width: '20%', left: '-18px', top: '70px' },
                        nameLeft: "at0012",
                        nameRight: "at0018",
                        // Extra buttons for clicking in the top part of the element
                        nameLeftTop: "at0011",
                        nameRightTop: "at0017",
                    },
                    intra: {
                        url: baseUrl + "sparing_intra.svg",
                        positionRight: { width: '20%', left: '166px', top: '70px' },
                        positionLeft: { width: '20%', left: '0px', top: '70px' },
                        nameLeft: "at0010",
                        nameRight: "at0016",
                        // Extra buttons for clicking in the top part of the element
                        nameLeftTop: "at0009",
                        nameRightTop: "at0015",
                    },
                };

                for (const [key, info] of Object.entries(sparingInformation)) {
                    const overlayRight = document.createElement('img');
                    const overlayLeft = document.createElement('img');
                    overlayRight.className = 'overlay-image';
                    overlayLeft.className = 'overlay-image';
                    overlayRight.src = info.url;
                    overlayLeft.src = info.url;
                    //                    overlay.classList.add('overlay-image');
                    overlayLeft.title = findOptionByValue(sparingDxRoot, info.nameLeft).text;
                    overlayRight.title = findOptionByValue(sparingSinRoot, info.nameRight).text;

                    // Set position
                    Object.assign(overlayRight.style, info.positionRight);
                    Object.assign(overlayLeft.style, info.positionLeft);

                    // Apply grayscale filter on all unselected images
                    if (sparingDx != info.nameLeft && sparingDx != info.nameLeftTop) {
                        Object.assign(overlayLeft.style, grayscale);
                    }
                    if (sparingSin != info.nameRight && sparingSin != info.nameRightTop){
                        Object.assign(overlayRight.style, grayscale);
                    }
                    // Reverse the left
                    overlayLeft.style.transform = 'scaleX(-1)'

                    overlayRight.addEventListener("click", function(event) {
                        const overlayHeight = overlayRight.clientHeight; // Get the height of overlayLeft
                        const clickY = event.clientY - overlayRight.getBoundingClientRect().top; // Get the Y coordinate relative to overlayLeft
                        const clickTop = clickY < overlayHeight / 2;

                        const selectedName = clickTop ? (info.nameRightTop ?? info.nameRight) : info.nameRight;

                        console.log("Clicked on " + selectedName + ", Clicked top: " + clickTop);
                        if (sparingSinRoot) {
                            sparingSinRoot.value = selectedName;
                            prostateSparingSin = selectedName;
                            refreshOverlay();
                        };
                    });

                    overlayLeft.addEventListener("click", function(event) {
                        const overlayHeight = overlayLeft.clientHeight; // Get the height of overlayLeft
                        const clickY = event.clientY - overlayLeft.getBoundingClientRect().top; // Get the Y coordinate relative to overlayLeft
                        const clickTop = clickY < overlayHeight / 2;

                        const selectedName = clickTop ? (info.nameLeftTop ?? info.nameLeft) : info.nameLeft;

                        console.log("Clicked on " + selectedName + ", Clicked top: " + clickTop);
                        if (sparingDxRoot) {
                            sparingDxRoot.value = selectedName;
                            prostateSparingDx = selectedName;
                            refreshOverlay();
                        };
                    });

                    // Append overlay to container
                    containerA.appendChild(overlayRight);
                    containerA.appendChild(overlayLeft);
                }
            }

            function refreshOverlay() {
                querySelectorAll(rootContainer, '.overlay-image').forEach(overlay => overlay.remove());
                const allLocations = lesionLocationRoots.map(root => root.text);
                updateSparingOverlay(prostateSparingDx, prostateSparingSin);
                allLocations.forEach(location => updateLocationOverlay(location, gleasonScore));
            }

            gleasonScoreRoot?.addEventListener('input', event => {
                gleasonScore = event.target.value;
                refreshOverlay();
            });

            sparingSinRoot?.addEventListener('input', event => {
                prostateSparingSin = event.target.value;
                refreshOverlay();
            });

            sparingDxRoot?.addEventListener('input', event => {
                prostateSparingDx = event.target.value;
                refreshOverlay();
            });

            refreshOverlay();
        });
    }
}

// Register the custom element
customElements.define('acme-submit-button', AcmeSubmitButton);
