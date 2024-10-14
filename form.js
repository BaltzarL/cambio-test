export class AcmeSubmitButton extends HTMLElement {
    constructor() {
        super();

        // Create shadow DOM
        const shadowRoot = this.attachShadow({
            mode: 'open'
        });

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

        shadowRoot.appendChild(containerA);
        shadowRoot.appendChild(containerB);
        shadowRoot.appendChild(containerC);

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

            function refreshOverlay() {
                updateOverlay(lesionLocationText, gleasonScore, prostateSparingDx, prostateSparingSin);
            };

            function updateOverlay(location, score, sparingDx, sparingSin) {
                // Remove existing overlays
                const existingOverlays = shadowRoot.querySelectorAll('.overlay-image');
                existingOverlays.forEach(overlay => overlay.remove());

                const baseUrl = "https://raw.githubusercontent.com/BaltzarL/cambio-test/refs/heads/main/images/";

                const grayscale = {
                    filter: 'brightness(0) saturate(100%) invert(47%) sepia(2%) saturate(812%) hue-rotate(212deg) brightness(98%) contrast(89%)'
                }

                // Get the row, section and column from the location
                // E.g "1Cd" means row "1", section "C" and column "d"
                const row = location[0];
                const section = location[1];
                const column = location[2];

                // Scale the x coordinates for the different prostatectomy images
                var imageWidthScaling = 1;

                var container = containerA
                if (section === 'A') {
                    container = containerA;
                    imageWidthScaling = 1.2;
                } else if (section === 'B') {
                    container = containerB;
                    imageWidthScaling = 1;
                } else if (section === 'C') {
                    container = containerC;
                    imageWidthScaling = 1;
                }

                var xOffset = 0;
                if (row === '1') {
                    xOffset = 40;
                } else if (row === '2') {
                    xOffset = 70;
                } else if (row === '3') {
                    xOffset = 120;
                } else if (row === '4') {
                    xOffset = 150;
                }

                var yOffset = 0;
                if (column === 'v') {
                    yOffset = 65;
                } else if (column === 'd') {
                    yOffset = 100;
                }


                // Dex = Left (on image)
                // Sin = Right (on image)
                const sparingInformation = {
                    none: {
                        url: baseUrl + "sparing_none.svg",
                        // Terrible solution, but not sure how to do it better
                        positionRight: { width: '30%', left: '208px', top: '60px' },
                        positionLeft: { width: '30%', left: '-62px', top: '60px' },
                        // The coded text IDs
                        nameLeft: "at0014",
                        nameRight: "at0020",
                    },
                    semi: {
                        url: baseUrl + "sparing_semi.svg",
                        positionRight: { width: '20%', left: '196px', top: '70px' },
                        positionLeft: { width: '20%', left: '-30px', top: '70px' },
                        nameLeft: "at0013",
                        nameRight: "at0019",
                    },
                    interLow: {
                        url: baseUrl + "sparing_inter.svg",
                        positionRight: { width: '20%', left: '180px', top: '70px' },
                        positionLeft: { width: '20%', left: '-14px', top: '70px' },
                        nameLeft: "at0012",
                        nameRight: "at0018"
                    },
//                    interHigh: {
//                        url: baseUrl + "sparing_inter.svg",
//                        positionRight: { width: '20%', left: '166px', top: '70px' },
//                        positionLeft: { width: '20%', left: '166px', top: '70px' },
//                        nameLeft: "at0011",
//                        nameRight: "at0017"
//                    },
                    intraLow: {
                        url: baseUrl + "sparing_intra.svg",
                        positionRight: { width: '20%', left: '166px', top: '70px' },
                        positionLeft: { width: '20%', left: '0px', top: '70px' },
                        nameLeft: "at0010",
                        nameRight: "at0016"
                    },
//                    intraHigh: {
//                        url: baseUrl + "sparing_intra.svg",
//                        positionRight: { width: '20%', left: '166px', top: '70px' },
//                        positionLeft: { width: '20%', left: '166px', top: '70px' },
//                        nameLeft: "at0009",
//                        nameRight: "at0015"
//                    }
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
                    if (sparingDx != info.nameLeft) {
                        Object.assign(overlayLeft.style, grayscale);
                    }
                    if (sparingSin != info.nameRight){
                        Object.assign(overlayRight.style, grayscale);
                    }
                    // Reverse the left
                    overlayLeft.style.transform = 'scaleX(-1)'

                    overlayRight.addEventListener("click", function() {
                        console.log("Clicked on " + info.nameRight);
                        if (sparingSinRoot) {
                            sparingSinRoot.value = info.nameRight;
                            prostateSparingSin = info.nameRight;
                            refreshOverlay();
                        };
                    });

                    overlayLeft.addEventListener("click", function() {
                        console.log("Clicked on " + info.nameLeft);
                        if (sparingDxRoot) {
                            sparingDxRoot.value = info.nameLeft;
                            prostateSparingDx = info.nameLeft;
                            refreshOverlay();
                        };
                    });

                    // Append overlay to container
                    containerA.appendChild(overlayRight);
                    containerA.appendChild(overlayLeft);
                }

                //textOverlay?.innerText = section;

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

            gleasonScoreRoot?.addEventListener('input', function(event) {
                gleasonScore = event.target.value;
                refreshOverlay();
            });

            lesionLocationRoot?.addEventListener('input', function(event) {
                lesionLocationText = event.target.text;
                refreshOverlay();
            });

        });
    }
}

// Register the custom element
customElements.define('acme-submit-button', AcmeSubmitButton);
