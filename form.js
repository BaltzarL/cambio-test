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
        width: 50px; /* Adjust overlay size as necessary */
        height: 50px;
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
      const lesionLocationRoot = querySelector("c-input-count[name='T0_location']");

      // Listener for gleasonScoreRoot changes (for future use)
      gleasonScoreRoot?.addEventListener('input', function(event) {
        console.log('gleasonScoreRoot value changed to:', event.target.value);
      });

      // Listener for lesionLocationRoot changes
      lesionLocationRoot?.addEventListener('input', function(event) {
        console.log('lesionLocationRoot value changed to:', event.target.value);

        // Update overlay based on lesionLocationRoot input
        updateOverlay(event.target.text);
      });

      // Function to update the overlay images
      function updateOverlay(location) {
        // Remove existing overlays
        const existingOverlays = shadowRoot.querySelectorAll('.overlay-image');
        existingOverlays.forEach(overlay => overlay.remove());

        // Depending on the lesion location value, add new overlays
        if (location === '1Av') {
          // Example overlay for location 1
          const overlayImage1 = document.createElement('img');
          overlayImage1.src = 'http://clipart-library.com/img1/1036648.png'; // Overlay image for location1
          overlayImage1.className = 'overlay-image';
          overlayImage1.style.top = '20px';  // Adjust positioning
          overlayImage1.style.left = '50px'; // Adjust positioning
          container.appendChild(overlayImage1);
        }

        if (location === '1Bv') {
          // Example overlay for location 2
          const overlayImage2 = document.createElement('img');
          overlayImage2.src = 'https://www.pngmart.com/files/23/Blue-Dot-PNG.png'; // Overlay image for location2
          overlayImage2.className = 'overlay-image';
          overlayImage2.style.top = '100px';  // Adjust positioning
          overlayImage2.style.left = '150px'; // Adjust positioning
          container.appendChild(overlayImage2);
        }
      }
    });
  }
}

// Register the custom element
customElements.define('acme-submit-button', AcmeSubmitButton);
