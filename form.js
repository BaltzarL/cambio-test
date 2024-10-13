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
        top: 0;
        left: 0;
        width: 20px; /* Adjust overlay size as necessary */
        height: 20px;
        pointer-events: none; /* Prevent interfering with clicks */
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
                const row = location[0];
                const section = location[1];
                const column = location[2];

                const sparingInformation = {
                    none: {
                        url: baseUrl + "sparing_none.svg",
                        position: { width: '11%', left: '150px', top: '223px' },
                        name: "at0014"
                    },
                    semi: {
                        url: baseUrl + "sparing_semi.svg",
                        position: { width: '11%', left: '150px', top: '223px' },
                        name: "at0013"
                    },
                    interLow: {
                        url: baseUrl + "sparing_inter.svg",
                        position: { width: '11%', left: '150px', top: '223px' },
                        name: "at0012"
                    },
                    interHigh: {
                        url: baseUrl + "sparing_inter.svg",
                        position: { width: '11%', left: '150px', top: '223px' },
                        name: "at0011"
                    },
                    intraLow: {
                        url: baseUrl + "sparing_intra.svg",
                        position: { width: '11%', left: '150px', top: '223px' },
                        name: "at0010"
                    },
                    intraHigh: {
                        url: baseUrl + "sparing_intra.svg",
                        position: { width: '11%', left: '150px', top: '223px' },
                        name: "at0009"
                    }
                };

                for (const [key, info] of Object.entries(sparingInformation)) {
                    const overlay = document.createElement('img');
                    overlay.src = info.url;
                    overlay.classList.add('overlay-image');
                    overlay.title = findOptionByValue(sparingDxRoot, info.name).text;

                    // Set position
                    Object.assign(overlay.style, info.position);

                    // Apply grayscale filter on all unselected images
                    if (sparingDx != info.name) {
                        Object.assign(overlay.style, grayscale);
                    }

                    overlay.addEventListener("click", function() {
                        console.log("Clicked on " + info.name);
                        if (sparingDxRoot) {
                            sparingDxRoot.value = info.name;
                            prostateSparingDx = info.name;
                            refreshOverlay();
                        };
                    });

                    // Append overlay to container
                    container.appendChild(overlay);
                }

                var container = containerA
                if (section === 'A') {
                    container = containerA;
                } else if (section === 'B') {
                    container = containerB;
                } else if (section === 'C') {
                    container = containerC;
                }

                var xOffset = 0;
                if (row === '1') {
                    xOffset = 65;
                } else if (row === '2') {
                    xOffset = 110;
                } else if (row === '3') {
                    xOffset = 175;
                } else if (row === '4') {
                    xOffset = 215;
                }

                var yOffset = 0;
                if (column === 'v') {
                    yOffset = 70;
                } else if (column === 'd') {
                    yOffset = 110;
                }


                //textOverlay?.innerText = section;

                const overlayImage1 = document.createElement('img');
                overlayImage1.src = 'https://raw.githubusercontent.com/BaltzarL/cambio-test/refs/heads/main/images/dot_overlay.svg';
                overlayImage1.className = 'overlay-image';
                overlayImage1.title = location;

                // Calculate brightness based on Gleason score (from 2 to 10)
                //                const brightness = 0.3 + ((score ?? 0) - 2) * 0.1; // 0.3 for Gleason score 2, 1.0 for score 10
                //                overlayImage1.style.filter = `brightness(${brightness})`;

                overlayImage1.style.top = yOffset + 'px';
                overlayImage1.style.left = xOffset + 'px';
                container.appendChild(overlayImage1);
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
