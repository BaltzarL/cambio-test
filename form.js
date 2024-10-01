export class AcmeSubmitButton extends HTMLElement {
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
        baseImage.src = 'https://github.com/BaltzarL/cambio-test/blob/main/images/base_image.png?raw=true'; // Replace with your image URL
        baseImage.alt = 'Base Image';
        baseImage.style.width = '300px'; // You can adjust the size as needed

        // Append the base image to the container
        container.appendChild(baseImage);

        // Create a text overlay
        const textOverlay = document.createElement('div');
        textOverlay.innerText = 'Example text header';
        textOverlay.className = 'text-overlay'; // Apply class for styles

        // Append the text overlay to the container
        container.appendChild(textOverlay);

        shadowRoot.appendChild(container);

        // Create a style tag for overlay styles
        const style = document.createElement('style');
        style.innerText = `
            .image-container {
                position: relative;
                display: inline-block;
            }
            .base-image {
                display: block;
                width: 300px; /* Adjust size as needed */
                border-radius: 0.5em;
            }
            .text-overlay {
                position: absolute;
                top: 10px; /* Adjust top position */
                left: 50%; /* Center horizontally */
                transform: translateX(-50%);
                color: white;
                font-size: 20px;
                font-weight: bold;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7); /* Add shadow for readability */
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
            const gleasonScoreRoot = querySelector("c-input-count[name='T0_total_gleason_score']");
            const lesionLocationRoot = querySelector("c-input-select[name='T0_location']");

            gleasonScoreRoot?.addEventListener('input', function(event) {
                console.log('gleasonScoreRoot value changed to:', event.target.value);
            });

            lesionLocationRoot?.addEventListener('input', function(event) {
                console.log('lesionLocationRoot value changed to:', event.target.value);
                updateOverlay(event.target.text);
            });

            function updateOverlay(location) {
                // Remove existing overlays
                const existingOverlays = shadowRoot.querySelectorAll('.overlay-image');
                existingOverlays.forEach(overlay => overlay.remove());

                const row = location[0];
                const section = location[1];
                const column = location[2];

                var xOffset = 0;
                switch (row) {
                    case '1':
                        xOffset = 65;
                        break;
                    case '2':
                        xOffset = 110;
                        break;
                    case '3':
                        xOffset = 175;
                        break;
                    case '4':
                        xOffset = 215;
                        break;
                }
                var yOffset = 0;
                switch (column) {
                    case 'v':
                        xOffset = 70;
                        break;
                    case 'd':
                        yOffset = 110;
                        break;
                }

                textOverlay?.innerText = section;

                const overlayImage1 = document.createElement('img');
                overlayImage1.src = 'http://clipart-library.com/img1/1036648.png';
                overlayImage1.className = 'overlay-image';
                overlayImage1.style.top = yOffset + 'px';
                overlayImage1.style.left = xOffset + 'px';
                container.appendChild(overlayImage1);
            }
        });
    }
}

// Register the custom element
customElements.define('acme-submit-button', AcmeSubmitButton);
