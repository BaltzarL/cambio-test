export class AcmeSubmitButton extends HTMLElement {
  constructor() {
    super();

    // Create shadow DOM
    const shadowRoot = this.attachShadow({ mode: 'open' });

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
        node => node instanceof Element && node.shadowRoot
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT,
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
                gleasonScore = event.target.value;
                updateOverlay(lesionLocationText, gleasonScore);
            });

            lesionLocationRoot?.addEventListener('input', function(event) {
                lesionLocationText = event.target.text;
                updateOverlay(lesionLocationText, gleasonScore);
            });

            function updateOverlay(location, score) {
                // Remove existing overlays
                const existingOverlays = shadowRoot.querySelectorAll('.overlay-image');
                existingOverlays.forEach(overlay => overlay.remove());

                const row = location[0];
                const section = location[1];
                const column = location[2];

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

                textOverlay?.innerText = section;

                const overlayImage1 = document.createElement('img');
                overlayImage1.src = 'http://clipart-library.com/img1/1036648.png';
                overlayImage1.className = 'overlay-image';

                // Calculate brightness based on Gleason score (from 2 to 10)
                const brightness = 0.3 + ((score ?? 0) - 2) * 0.1; // 0.3 for Gleason score 2, 1.0 for score 10
                overlayImage1.style.filter = `brightness(${brightness})`;

                overlayImage1.style.top = yOffset + 'px';
                overlayImage1.style.left = xOffset + 'px';
                container.appendChild(overlayImage1);
            }
        });
    }
}

// Register the custom element
customElements.define('acme-submit-button', AcmeSubmitButton);
