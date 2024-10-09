export class DissectionImage extends HTMLElement {
    constructor() {
        super();

        // Create shadow DOM
        const shadowRoot = this.attachShadow({
            mode: 'open'
        });

        // Create a container for the image and overlays
        const container = document.createElement('div');
        container.style.position = 'relative'; // For positioning overlay images
        container.style.display = 'inline-block';

        // Create the base image
        const baseImage = document.createElement('img');
        baseImage.src = 'https://raw.githubusercontent.com/BaltzarL/cambio-test/refs/heads/main/images/nerve_sparing_guide.png';
        baseImage.alt = 'Base Image';
        baseImage.style.width = '300px'; // You can adjust the size as needed

        // Append the base image to the container
        container.appendChild(baseImage);
        shadowRoot.appendChild(container);

        // Create a style tag for overlay styles
        const style = document.createElement('style');
        style.innerText = `
      img {
        display: block;
        border-radius: 0.5em;
      }
      .overlay-image {
        position: absolute;
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

        // Wait until the DOM is ready
        setTimeout(() => {
            const bladderneckSparingRoot = querySelector("c-input-boolean[name='T0_bladderneck_sparing']");
            const apicalDissectionRoot = querySelector("c-input-select[name='T0_apical_dissection']");
            var bladderneckSparing = bladderneckSparingRoot.value ?? false;
            var apicalDissectionValue = apicalDissectionRoot ?? "";

            bladderneckSparingRoot?.addEventListener('input', function(event) {
                bladderneckSparing = event.target.value;
                updateOverlay(bladderneckSparing, apicalDissectionValue);
            });

            apicalDissectionRoot?.addEventListener('input', function(event) {
                apicalDissectionValue = event.target.value;
                updateOverlay(bladderneckSparing, apicalDissectionValue);
            });

            function updateOverlay(isSparing, dissection) {
                // Remove existing overlays
                const existingOverlays = shadowRoot.querySelectorAll('.overlay-image');
                existingOverlays.forEach(overlay => overlay.remove());

                const baseUrl = "https://raw.githubusercontent.com/BaltzarL/cambio-test/refs/heads/main/images/";

                console.log("Sparing: " + isSparing);
                console.log("Dissection: " + dissection);

                const apicalInformation = {
                    apicalTop: {
                        url: baseUrl + "apical_top.svg",
                        position: { width: '11%', left: '150px', top: '223px' },
                        name: "at0021" // The drop-down values for each apical dissection
                    },
                    apicalMiddle: {
                        url: baseUrl + "apical_middle.svg",
                        position: { width: '12%', left: '147px', top: '234px' },
                        name: "at0022",
                    },
                    apicalBottom: {
                        url: baseUrl + "apical_bottom.svg",
                        position: { width: '11%', left: '143px', top: '242px' },
                        name: "at0023"
                    }
                };

                const grayscale = {
                     filter: 'brightness(0) saturate(100%) invert(47%) sepia(2%) saturate(812%) hue-rotate(212deg) brightness(98%) contrast(89%)'
                }

                for (const [key, info] of Object.entries(apicalInformation)) {
                    const overlay = document.createElement('img');
                    overlay.src = info.url;
                    overlay.classList.add('overlay-image');

                    // Set position
                    Object.assign(overlay.style, info.position);

                    // Apply grayscale filter on all unselected images
                    if (dissection != info.name) {
                        Object.assign(overlay.style, grayscale);
                    }
                    overlay.addEventListener("click", function() {
                        console.log("Clicked on " + info.name);
                        apicalDissectionRoot?.value = info.name;
                    });

                    // Append overlay to container
                    container.appendChild(overlay);
                }

                // --- Bladder-neck sparing images
                const bladderSparingInformation = {
                    sparing: {
                        url: baseUrl + "bladder_bottom.svg",
                        position: { width: '12%', left: '155px', top: '70px' },
                        isSparing: true,
                    },
                    nonSparing: {
                        url: baseUrl + "bladder_top.svg",
                        position: { width: '13%', left: '150px', top: '60px' },
                        isSparing: false,
                    },
                }

                for (const [key, info] of Object.entries(bladderSparingInformation)) {
                    const overlay = document.createElement('img');
                    overlay.src = info.url;
                    overlay.classList.add('overlay-image');

                    // Set position
                    Object.assign(overlay.style, info.position);

                    // Apply grayscale filter on all unselected images
                    if (isSparing != info.isSparing) {
                        Object.assign(overlay.style, grayscale);
                    }

                    container.appendChild(overlay);
                }
            }

            updateOverlay(bladderneckSparing, apicalDissectionValue);
        });
    }
}

// Register the custom element
customElements.define('prostatectomy-dissection-image', DissectionImage);
