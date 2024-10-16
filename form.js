export class AcmeSubmitButton extends HTMLElement {
    constructor() {
        super();

        // Create shadow DOM
        const shadowRoot = this.attachShadow({
            mode: 'open'
        });

        const rootContainer = document.createElement('div');
        // Add padding to make space for dissection overlay
        rootContainer.style.paddingLeft = "200px"
        rootContainer.style.paddingRight = "200px"

        // Create a container for the image and overlays
        const containerA = document.createElement('div');
        containerA.style.position = 'relative'; // For positioning overlay images
        containerA.style.display = 'inline-block';

        const containerB = document.createElement('div');
        containerB.style.position = 'relative'; // For positioning overlay images
        containerB.style.display = 'inline-block';

        const containerC = document.createElement('div');
        containerC.style.position = 'relative'; // For positioning overlay images
        containerC.style.display = 'inline-block';

        // Create the base image
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

        // Append the base image to the container
        containerA.appendChild(prostateA);
        containerB.appendChild(prostateB);
        containerC.appendChild(prostateC);

        //        shadowRoot.style.display = 'flex';
        //        shadowRoot.style.flexDirection = 'row';

        rootContainer.appendChild(containerA);
        rootContainer.appendChild(containerB);
        rootContainer.appendChild(containerC);
        shadowRoot.appendChild(rootContainer);

        // Create a style tag for overlay styles
        const style = document.createElement('style');
        style.innerText = `
      img {
        display: block;
        border-radius: 0.5em;
      }
      .overlay-image {
        position: absolute;
        position: absolute;
        cursor: pointer;
      }
    `;
        shadowRoot.appendChild(style);

        function findOptionByValue(selectElement, valueToFind) {
            let foundOption = null;

            Array.from(selectElement.options).forEach(option => {
                if (option.value === valueToFind) {
                    foundOption = option;
                }
            });
            return foundOption;
        }

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

        // Wait until the DOM is ready
        setTimeout(() => {
            var gleasonScore = 0;
            var lesionLocationText = "";
            var prostateSparingDx = "";
            var prostateSparingSin = "";

            // These are to be replaced with the ids of the final inputs
            const gleasonScoreRoot = querySelector("c-input-count[name='T0_total_gleason_score']");
            const lesionLocationRoot = querySelector("c-input-select[name='T0_location']");
            const sparingDxRoot = querySelector("c-input-select[name='T0_nerve_sparing_dx']");
            const sparingSinRoot = querySelector("c-input-select[name='T0_nerve_sparing_sin']");

            const baseUrl = "https://raw.githubusercontent.com/BaltzarL/cambio-test/refs/heads/main/images/";

            const grayscale = {
                filter: 'brightness(0) saturate(100%) invert(47%) sepia(2%) saturate(812%) hue-rotate(212deg) brightness(98%) contrast(89%)'
            }

            function updateLocation(location, score) {
                if (!location) return;

                // Get the row, section and column from the location
                // E.g "1Cd" means row "1", section "C" and column "d"
                const row = location[0];
                const section = location[1];
                const column = location[2];

                // This should be designed in some other way, hardcoded coordinates is not good
                const locationInformation = {
                    '1': {
                        xOffsetA: 30,
                        xOffsetB: 40,
                        xOffsetC: 50,
                        yOffsetV: 70,
                        yOffsetD: 95
                    },
                    '2': {
                        xOffsetA: 70,
                        xOffsetB: 70,
                        xOffsetC: 70,
                        yOffsetV: 70,
                        yOffsetD: 95
                    },
                    '3': {
                        xOffsetA: 115,
                        xOffsetB: 115,
                        xOffsetC: 115,
                        yOffsetV: 70,
                        yOffsetD: 95
                    },
                    '4': {
                        xOffsetA: 150,
                        xOffsetB: 150,
                        xOffsetC: 150,
                        yOffsetV: 70,
                        yOffsetD: 95
                    }
                };
                // Extra harcoded locations because the above system is not 100% accurate
                const extraLocations = {
                    '1Av': {
                        xOffset: 20,
                    },
                    '4Av': {
                        xOffset: 160,
                    },
                }

                const locationCoordinates = locationInformation[row];
                if (!locationCoordinates) return;

                var xOffset = 0;
                var yOffset = 0;
                if (column === 'v') {
                    yOffset = locationCoordinates.yOffsetV;
                } else if (column === 'd') {
                    yOffset = locationCoordinates.yOffsetD;
                }

                var container = containerA
                if (section === 'A') {
                    xOffset = locationCoordinates.xOffsetA;
                    container = containerA;
                } else if (section === 'B') {
                    xOffset = locationCoordinates.xOffsetB;
                    container = containerB;
                } else if (section === 'C') {
                    xOffset = locationCoordinates.xOffsetC;
                    container = containerC;
                }

                // Override the location
                const extraLocation = extraLocations[location];
                if (extraLocation) {
                    xOffset = (extraLocation.xOffset ?? xOffset);
                    yOffset = (extraLocation.yOffset ?? yOffset);
                }

                const dotOverlay = document.createElement('img');
                dotOverlay.src = 'https://raw.githubusercontent.com/BaltzarL/cambio-test/refs/heads/main/images/dot_overlay.svg';
                dotOverlay.className = 'overlay-image';
                dotOverlay.style.width = "20px"
                dotOverlay.style.height = "20px"

                // Mirror image on the left
                const isLeft = row === '1' || row === '2';
                if (isLeft) {
                    dotOverlay.style.transform = 'scaleX(-1)'
                }
                dotOverlay.title = location;

                // Calculate brightness based on Gleason score (from 2 to 10)
                //                const brightness = 0.3 + ((score ?? 0) - 2) * 0.1; // 0.3 for Gleason score 2, 1.0 for score 10
                //                dotOverlay.style.filter = `brightness(${brightness})`;

                dotOverlay.style.top = yOffset + 'px';
                dotOverlay.style.left = xOffset + 'px';
                container.appendChild(dotOverlay);
            }

            function refreshOverlay() {
                updateOverlay(lesionLocationText, gleasonScore, prostateSparingDx, prostateSparingSin);
            };

            function updateOverlay(location, score, sparingDx, sparingSin) {
                // Remove existing overlays
                const existingOverlays = shadowRoot.querySelectorAll('.overlay-image');
                existingOverlays.forEach(overlay => overlay.remove());
                updateLocation(location, score);

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

                //textOverlay?.innerText = section;
            }

            gleasonScoreRoot?.addEventListener('input', function(event) {
                gleasonScore = event.target.value;
                refreshOverlay();
            });

            lesionLocationRoot?.addEventListener('input', function(event) {
                lesionLocationText = event.target.text;
                refreshOverlay();
            });

            sparingSinRoot?.addEventListener('input', function(event) {
                prostateSparingSin = event.target.value;
                refreshOverlay();
            });

            sparingDxRoot?.addEventListener('input', function(event) {
                prostateSparingDx = event.target.value;
                refreshOverlay();
            });

            refreshOverlay();
        });
    }
}

// Register the custom element
customElements.define('acme-submit-button', AcmeSubmitButton);
