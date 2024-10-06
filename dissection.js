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
        width: 20px; /* Adjust overlay size as necessary */
        height: 20px;
        pointer-events: none; /* Prevent interfering with clicks */
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
            var bladderneckSparing = false;
            var apicalDissectionValue = "";
            const bladderneckSparingRoot = querySelector("c-input-boolean[name='T0_bladderneck_sparing']");
            const apicalDissectionRoot = querySelector("c-input-select[name='T0_apical_dissection']");

            bladderneckSparingRoot?.addEventListener('input', function(event) {
                bladderneckSparing = event.target.value;
                updateOverlay(bladderneckSparing, apicalDissectionValue);
            });

            apicalDissectionRoot?.addEventListener('input', function(event) {
                apicalDissectionValue = event.target.value;
                updateOverlay(bladderneckSparing, apicalDissectionValue);
            });

            function updateOverlay(sparing, dissection) {
                // Remove existing overlays
                const existingOverlays = shadowRoot.querySelectorAll('.overlay-image');
                existingOverlays.forEach(overlay => overlay.remove());

                const baseUrl = "https://raw.githubusercontent.com/BaltzarL/cambio-test/refs/heads/main/images/";

                console.log("Sparing: " + sparing);
                console.log("Dissection: " + dissection);

                // Define positions for the overlays
                const positions = {
                    top: { top: '10%', left: '50%', transform: 'translate(-50%, -100%)' }, // Adjust top position
                    middle: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }, // Center position
                    bottom: { top: '90%', left: '50%', transform: 'translate(-50%, 0)' } // Adjust bottom position
                };

                // Append the overlay images based on the dissection value
                const overlays = {
                    apicalTop: baseUrl + "apical_top.svg",
                    apicalMiddle: baseUrl + "apical_middle.svg",
                    apicalBottom: baseUrl + "apical_bottom.svg"
                };

                for (const [key, src] of Object.entries(overlays)) {
                    const overlay = document.createElement('img');
                    overlay.src = src;
                    overlay.classList.add('overlay-image');

                    // Set position
                    Object.assign(overlay.style, positions[key]);

                    // Apply grayscale filter except for the middle overlay
                    if (key === 'apicalMiddle') {
                        overlay.style.filter = 'none'; // Keep color
                    } else {
                        overlay.style.filter = 'grayscale(100%)'; // Grayscale for other overlays
                    }

                    // Append overlay to container
                    container.appendChild(overlay);
                }
            }
        });
    }
}

// Register the custom element
customElements.define('prostatectomy-dissection-image', DissectionImage);
